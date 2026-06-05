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

const useGithubStore = create((set, get) => ({
    pinnedRepos: [],
    repoContents: {}, // { repoName: [files] }
    isPinnedLoading: false,
    isContentsLoading: false,
    error: null,

    fetchPinnedRepos: async () => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (!token) return;
        set({ isPinnedLoading: true, error: null });
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
        } catch (err) {
            set({ error: err.message, isPinnedLoading: false });
        }
    },


    fetchRepoContents: async (repoName) => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (!token) return;
        
        // Don't refetch if we already have it
        if (get().repoContents[repoName]) return;

        set({ isContentsLoading: true });
        try {
            const res = await fetch(`https://api.github.com/repos/AngeloMafilas/${repoName}/contents`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json',
                }
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
