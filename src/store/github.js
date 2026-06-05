import { create } from 'zustand';

const PINNED_QUERY = `
query {
  user(login: "AngeloMafilas") {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          stargazerCount
          openGraphImageUrl
          primaryLanguage { name color }
          repositoryTopics(first: 5) {
            nodes { topic { name } }
          }
        }
      }
    }
  }
}
`;

const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Python: '#3572A5',
    Shell: '#89e051',
};
const getLanguageColor = (lang) => LANGUAGE_COLORS[lang] || '#858585';

const useGithubStore = create((set, get) => ({
    pinnedRepos: [],
    repoContents: {}, // { repoName: [files] }
    isPinnedLoading: false,
    isContentsLoading: false,
    error: null,

    fetchPinnedRepos: async () => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        set({ isPinnedLoading: true, error: null });
        
        if (token) {
            try {
                const res = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github+json',
                    },
                    body: JSON.stringify({ query: PINNED_QUERY }),
                });
                const result = await res.json();
                if (result.errors) throw new Error(result.errors[0].message);
                const repos = result.data.user.pinnedItems.nodes.map(repo => ({
                    ...repo,
                    imageUrl: repo.openGraphImageUrl
                }));
                set({ pinnedRepos: repos, isPinnedLoading: false });
                return;
            } catch (err) {
                console.warn("GitHub GraphQL API failed, falling back to REST API:", err);
            }
        }

        // Fallback to Public REST API
        try {
            const headers = {
                'Accept': 'application/vnd.github+json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const res = await fetch('https://api.github.com/users/AngeloMafilas/repos?sort=updated&per_page=12', { headers });
            if (!res.ok) throw new Error(`Failed to fetch repositories: ${res.statusText}`);
            const data = await res.json();
            
            const repos = data.map(repo => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                homepageUrl: repo.homepage,
                stargazerCount: repo.stargazers_count,
                openGraphImageUrl: `https://opengraph.githubassets.com/1/AngeloMafilas/${repo.name}`,
                imageUrl: `https://opengraph.githubassets.com/1/AngeloMafilas/${repo.name}`,
                primaryLanguage: repo.language ? {
                    name: repo.language,
                    color: getLanguageColor(repo.language)
                } : null,
                repositoryTopics: {
                    nodes: repo.topics ? repo.topics.map(t => ({ topic: { name: t } })) : []
                }
            }));
            
            set({ pinnedRepos: repos, isPinnedLoading: false });
        } catch (err) {
            set({ error: err.message, isPinnedLoading: false });
        }
    },


    fetchRepoContents: async (repoName) => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        
        // Don't refetch if we already have it
        if (get().repoContents[repoName]) return;

        set({ isContentsLoading: true });
        try {
            const headers = { 
                'Accept': 'application/vnd.github+json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const res = await fetch(`https://api.github.com/repos/AngeloMafilas/${repoName}/contents`, {
                headers
            });
            const data = await res.json();
            
            // Normalize GitHub contents to our file structure
            const files = Array.isArray(data) ? data.map(f => ({
                id: f.sha,
                name: f.name,
                kind: f.type === 'dir' ? 'folder' : 'file',
                fileType: f.name.split('.').pop(),
                path: f.path,
                download_url: f.download_url,
                url: f.html_url
            })) : [];

            // Try to find a preview image in the root
            const previewFile = Array.isArray(data) && data.find(f => 
                f.type === 'file' && 
                (f.name.toLowerCase().includes('preview') || 
                 f.name.toLowerCase().includes('screenshot') || 
                 f.name.toLowerCase().includes('thumbnail') ||
                 f.name.toLowerCase().includes('banner')) &&
                 ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(f.name.split('.').pop().toLowerCase())
            );

            if (previewFile) {
                set(state => ({
                    pinnedRepos: state.pinnedRepos.map(r => 
                        r.name === repoName ? { ...r, imageUrl: previewFile.download_url } : r
                    )
                }));
            }

            set(state => ({
                repoContents: { ...state.repoContents, [repoName]: files },
                isContentsLoading: false
            }));
        } catch (err) {
            console.error("Failed to fetch contents:", err);
            set({ isContentsLoading: false });
        }
    }
}));

export default useGithubStore;
