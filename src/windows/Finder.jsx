import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, ChevronLeft, ChevronRight, FileText, 
    File, ArrowLeft, ExternalLink, AlertCircle,
    ArrowUpRight, Info, Briefcase, User, Trash2, Folder
} from 'lucide-react';
import useWindowsStore from '../store/window';
import useLocationStore from '../store/location';
import { locations } from '../components/constants';
import WindowWrapper from '../hoc/WindowWrapper';
import useGithubStore from '../store/github';
import { Star } from 'lucide-react';

const Finder = () => {
    const { activeLocation, setActiveLocation } = useLocationStore();
    const { openWindow, closeWindow } = useWindowsStore();
    const { 
        pinnedRepos, 
        repoContents,
        isPinnedLoading, 
        isContentsLoading,
        fetchPinnedRepos,
        fetchRepoContents,
        error 
    } = useGithubStore();

    useEffect(() => {
        if (pinnedRepos.length === 0) fetchPinnedRepos();
    }, [fetchPinnedRepos]);

    const [pathHistory, setPathHistory] = useState([activeLocation]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [inlineViewItem, setInlineViewItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);

    // Sync pathHistory when activeLocation changes from external source (Desktop/Dock)
    useEffect(() => {
        if (activeLocation && (!pathHistory[historyIndex] || pathHistory[historyIndex].id !== activeLocation.id)) {
            setPathHistory([activeLocation]);
            setHistoryIndex(0);
            setSelectedId(null);
            setInlineViewItem(null);
        }
    }, [activeLocation]);

    const currentFolder = pathHistory[historyIndex];

    const favorites = [
        { id: 'work',   name: 'Work',     icon: Briefcase, location: locations.work },
        { id: 'about',  name: 'About me', icon: User,      location: locations.about },
        { id: 'resume', name: 'Resume',   icon: FileText,  location: locations.resume },
        { id: 'trash',  name: 'Trash',    icon: Trash2,    location: locations.trash },
    ];

    const myProjects = pinnedRepos;

    // ─── Navigation ──────────────────────────────────────────────────────────
    const navigateTo = (folder, reset = false) => {
        if (reset) {
            // Reset to [Work, NewFolder]
            const workLocation = favorites.find(f => f.id === 'work').location;
            setPathHistory([workLocation, folder]);
            setHistoryIndex(1);
        } else {
            const newHistory = pathHistory.slice(0, historyIndex + 1);
            newHistory.push(folder);
            setPathHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
        setSelectedId(null);
        setInlineViewItem(null);
        if (folder.type) setActiveLocation(folder);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(i => i - 1);
            setSelectedId(null);
            setInlineViewItem(null);
        }
    };

    const handleForward = () => {
        if (historyIndex < pathHistory.length - 1) {
            setHistoryIndex(i => i + 1);
            setSelectedId(null);
            setInlineViewItem(null);
        }
    };

    const handleSingleClick = (item) => {
        const uid = item.node_id || item.id || item.url || item.name;
        setSelectedId(uid);
        
        // Show inline view for files immediately on single click if preferred, 
        // but user asked for "sidebar preview or small hover description".
        // I'll keep selectedId as the trigger for sidebar preview.
    };

    const handleDoubleClick = (item) => {
        if (item.kind === 'folder' || item.stargazerCount !== undefined) {
            if (item.stargazerCount !== undefined) {
                fetchRepoContents(item.name);
                navigateTo(item, true);
            } else {
                navigateTo(item);
            }
        } else if (item.fileType === 'url' && item.href) {
            window.open(item.href, '_blank');
        } else {
            setInlineViewItem(item);
        }
    };

    // ─── Hover ───────────────────────────────────────────────────────────────
    const handleMouseEnter = (e, item) => setHoveredItem(item);

    const handleMouseLeave = () => setHoveredItem(null);

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const getInitials = (name) =>
        name.split('.')[0].split(/[-_ ]/).map(n => n[0]?.toUpperCase() || '').join('').slice(0, 2);

    const colorMap = ['#007AFF','#5856D6','#FF2D55','#FF9500','#34C759','#AF52DE'];
    const getColor = (name) => colorMap[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colorMap.length];

    const getTypeLabel = (item) => {
        if (item.primaryLanguage) return item.primaryLanguage.name.toUpperCase();
        if (item.kind === 'folder') return 'FOLDER';
        const map = { img: 'IMAGE', txt: 'TEXT', pdf: 'PDF', url: 'LINK', fig: 'FIGMA' };
        return map[item.fileType] || 'FILE';
    };

    const getDescription = (item) => {
        if (item.description && typeof item.description === 'string') return item.description;
        if (item.desc) return item.desc;
        if (!item.description) return null;
        return Array.isArray(item.description) ? item.description[0] : item.description;
    };

    // ─── Sub-components ───────────────────────────────────────────────────────
    const FileIcon = ({ item, size = 40 }) => {
        const px = `${size}px`;
        if (item.kind === 'folder') {
            return (
                <svg width={px} height={px} viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="fb" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#5AC8FA"/>
                            <stop offset="100%" stopColor="#0A84FF"/>
                        </linearGradient>
                        <linearGradient id="ff" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#64D2FF"/>
                            <stop offset="100%" stopColor="#0A84FF"/>
                        </linearGradient>
                    </defs>
                    <rect x="0" y="10" width="64" height="44" rx="5" fill="url(#fb)" opacity="0.85"/>
                    <rect x="0" y="4"  width="26" height="12" rx="3" fill="url(#fb)" opacity="0.85"/>
                    <rect x="0" y="14" width="64" height="40" rx="5" fill="url(#ff)"/>
                    <rect x="0" y="14" width="64" height="13" rx="5" fill="white" opacity="0.12"/>
                </svg>
            );
        }

        if (item.fileType === 'img') {
            return (
                <div
                    style={{ width: px, height: px, background: getColor(item.name) }}
                    className="rounded-xl flex items-center justify-center text-white font-bold shadow-sm overflow-hidden"
                >
                    {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                        : <span style={{ fontSize: size * 0.3 }}>{getInitials(item.name)}</span>
                    }
                </div>
            );
        }

        if (item.fileType === 'txt') {
            return (
                <div style={{ width: size * 0.75, height: px }} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                    <div className="h-2.5 bg-gray-100 flex items-center px-1.5 gap-1 shrink-0">
                        {['#FF5F57','#FFBD2E','#27C93F'].map(c => (
                            <div key={c} style={{ background: c }} className="w-1.5 h-1.5 rounded-full"/>
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 p-1.5">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} style={{ width: i % 3 === 2 ? '60%' : '100%' }} className="h-0.5 bg-gray-300 rounded-full"/>
                        ))}
                    </div>
                </div>
            );
        }

        if (item.fileType === 'pdf') {
            return (
                <div style={{ width: size * 0.75, height: px }} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                    <div className="h-2.5 bg-red-500 flex items-center px-1.5 shrink-0">
                        <span className="text-white text-[6px] font-bold tracking-wider">PDF</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 p-1.5">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} style={{ width: i % 3 === 2 ? '60%' : '100%' }} className="h-0.5 bg-gray-300 rounded-full"/>
                        ))}
                    </div>
                </div>
            );
        }

        if (item.fileType === 'url') {
            return (
                <div style={{ width: px, height: px }} className="rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <ExternalLink size={size * 0.45} className="text-blue-400"/>
                </div>
            );
        }

        return <File size={size} className="text-gray-300"/>;
    };

    const RepoIcon = ({ item, size = 40 }) => {
        const px = `${size}px`;
        return (
            <div 
                style={{ width: px, height: px, background: getColor(item.name) }}
                className="rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-sm overflow-hidden p-2 relative"
            >
                <span style={{ fontSize: size * 0.25 }}>{getInitials(item.name)}</span>
                {item.stargazerCount > 0 && (
                    <div className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-black/20 px-1 rounded text-[8px]">
                        <Star size={8} fill="currentColor" />
                        {item.stargazerCount}
                    </div>
                )}
            </div>
        );
    };

    const RepoSkeleton = () => (
        <div className="flex flex-col items-center p-2 rounded-xl gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="w-16 h-3 bg-gray-100 rounded animate-pulse" />
        </div>
    );

    // ─── Viewers ──────────────────────────────────────────────────────────────
    const ImageViewer = ({ item }) => (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-[#f5f5f7]">
            <div
                style={{ background: getColor(item.name) }}
                className="w-72 h-72 rounded-2xl shadow-2xl overflow-hidden mb-6 flex items-center justify-center text-white text-6xl font-bold"
            >
                {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                    : getInitials(item.name)
                }
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
            {item.desc && <p className="text-gray-500 mt-2 text-sm text-center max-w-xs">{item.desc}</p>}
        </div>
    );

    const TextViewer = ({ item }) => (
        <div className="h-full overflow-y-auto bg-white">
            <div className="max-w-2xl mx-auto px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name.replace('.txt','')}</h1>
                {item.subtitle && <p className="text-blue-500 font-medium text-sm mb-6">{item.subtitle}</p>}
                <div className="space-y-4 text-[15px] text-gray-700 leading-[1.85]">
                    {Array.isArray(item.description)
                        ? item.description.map((p, i) => <p key={i}>{p}</p>)
                        : <p>{item.description || 'No content available.'}</p>
                    }
                </div>
            </div>
        </div>
    );

    const ProjectViewer = ({ item }) => (
        <div className="h-full overflow-y-auto bg-[#f5f5f7] p-6">
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div style={{ background: getColor(item.name) }} className="h-24 flex items-end px-6 pb-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg shadow">
                        {getInitials(item.name)}
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h2>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 mb-5">
                        Project Folder
                    </span>
                    <div className="grid grid-cols-2 gap-6 mb-6 text-[13px]">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stack</p>
                            <p className="text-gray-700 font-medium">React · Tailwind · Vite</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                            <p className="text-gray-700 font-medium">In Development</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                        {getDescription(item) || 'A modern web project built with the latest industry standards.'}
                    </p>
                    {item.children?.some(c => c.fileType === 'url') && (
                        <button
                            onClick={() => window.open(item.children.find(c => c.fileType === 'url').href, '_blank')}
                            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-[13px] font-semibold hover:bg-blue-600 transition-colors"
                        >
                            <ExternalLink size={14}/> View Project
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const PdfViewer = ({ item }) => (
        <div className="flex flex-col items-center justify-center h-full bg-[#f5f5f7] gap-4">
            <div className="w-20 h-24 bg-white border border-gray-200 rounded-xl shadow-md flex flex-col overflow-hidden">
                <div className="h-6 bg-red-500 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold tracking-widest">PDF</span>
                </div>
                <div className="flex-1 flex flex-col gap-1.5 p-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ width: i % 3 === 2 ? '55%' : '100%' }} className="h-0.5 bg-gray-200 rounded-full"/>
                    ))}
                </div>
            </div>
            <p className="text-gray-700 font-medium text-sm">{item.name}</p>
            {item.href && (
                <a 
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors"
                >
                    <ExternalLink size={14}/> Open PDF
                </a>
            )}
        </div>
    );

    // ─── Render ───────────────────────────────────────────────────────────────
    const getFolderChildren = () => {
        if (!currentFolder) return [];
        if (currentFolder.type === 'work') return pinnedRepos || [];
        if (currentFolder.stargazerCount !== undefined) {
            // It's a repo folder
            return repoContents[currentFolder.name] || [];
        }
        const children = currentFolder.children || [];
        return Array.isArray(children) ? children : [];
    };

    const filteredChildren = getFolderChildren().filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col w-[min(820px,92vw)] h-[min(540px,80vh)] bg-white rounded-xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] border border-black/10 overflow-hidden font-sans">

            {/* ── Title Bar ── */}
            <div className="window-header h-14 bg-[#f6f6f6] border-b border-gray-200 flex items-center px-4 shrink-0 select-none cursor-grab active:cursor-grabbing">
                {/* Traffic lights */}
                <div className="flex gap-2.5 mr-4 shrink-0 group/lights">
                    {[
                        { bg: '#FF5F56', label: '✕', action: () => closeWindow('finder') },
                        { bg: '#FFBD2E', label: '−', action: () => {} },
                        { bg: '#27C93F', label: '+', action: () => {} },
                    ].map(({ bg, label, action }) => (
                        <div
                            key={bg}
                            onClick={action}
                            style={{ background: bg }}
                            className="w-3.5 h-3.5 rounded-full border border-black/5 cursor-pointer hover:brightness-90 transition-all flex items-center justify-center"
                        >
                            <span className="opacity-0 group-hover/lights:opacity-100 text-[8px] text-black/50 font-black leading-none">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Back / Forward */}
                <div className="flex gap-1 mr-3">
                    <button
                        onClick={handleBack}
                        disabled={historyIndex === 0}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${historyIndex === 0 ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={historyIndex === pathHistory.length - 1}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${historyIndex === pathHistory.length - 1 ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        <ChevronRight size={20}/>
                    </button>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center text-[13px] font-medium text-gray-500 overflow-hidden flex-1 min-w-0">
                    {pathHistory.slice(0, historyIndex + 1).map((f, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span className="mx-1 text-gray-300">/</span>}
                            <span
                                className={`truncate cursor-pointer hover:text-blue-500 transition-colors ${i === historyIndex ? 'text-gray-900' : ''}`}
                                onClick={() => {
                                    setHistoryIndex(i);
                                    setInlineViewItem(null);
                                    setSelectedId(null);
                                    if (f.type) setActiveLocation(f);
                                }}
                            >
                                {f?.name || 'Angelo\'s Mac'}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Search */}
                <div className="flex items-center bg-gray-200/60 rounded-md px-2.5 py-1.5 w-40 shrink-0">
                    <Search size={13} className="text-gray-400 mr-2 shrink-0"/>
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-[12px] w-full placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <div className="w-48 bg-[#f3f3f3]/80 border-r border-gray-200 flex flex-col py-4 shrink-0 select-none overflow-y-auto">
                    {/* Favorites */}
                    <div className="px-4 mb-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Favorites</p>
                        {favorites.map(item => {
                            const active = currentFolder.type === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setPathHistory([item.location]);
                                        setHistoryIndex(0);
                                        setActiveLocation(item.location);
                                        setSelectedId(null);
                                        setInlineViewItem(null);
                                    }}
                                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors mb-0.5 ${
                                        active ? 'bg-black/8 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-black/5'
                                    }`}
                                >
                                    <item.icon size={15} className={active ? 'text-blue-500' : 'text-blue-400/80'}/>
                                    <span className="text-[13px]">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* My Projects */}
                    <div className="px-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">My Projects</p>
                        {myProjects.map(project => {
                            const uid = project.node_id || project.id || project.url || project.name;
                            const active = selectedId === uid;
                            return (
                                <div
                                    key={project.id}
                                    onClick={() => handleSingleClick(project)}
                                    className={`flex items-center justify-between group/side px-2.5 py-1.5 rounded-lg cursor-default transition-colors mb-0.5 ${
                                        active ? 'bg-black/8 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-black/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <svg width="15" height="13" viewBox="0 0 64 56" fill="none">
                                            <rect x="0" y="9"  width="64" height="45" rx="4" fill="#0A84FF" opacity="0.3"/>
                                            <rect x="0" y="3"  width="24" height="11" rx="3" fill="#0A84FF" opacity="0.3"/>
                                            <rect x="0" y="13" width="64" height="41" rx="4" fill={active ? '#007AFF' : '#5AC8FA'}/>
                                        </svg>
                                        <span className="text-[13px] truncate">{project.name}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDoubleClick(project);
                                        }}
                                        className="opacity-0 group-hover/side:opacity-100 p-0.5 hover:bg-black/10 rounded transition-all"
                                    >
                                        <ArrowUpRight size={14} className="text-gray-400 hover:text-blue-500" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main pane */}
                <div className="flex-1 bg-white overflow-hidden flex flex-col">
                    {inlineViewItem ? (
                        /* ── Inline viewer ── */
                        <div className="flex flex-col h-full">
                            <div className="h-11 flex items-center px-5 border-b border-gray-100 shrink-0">
                                <button
                                    onClick={() => setInlineViewItem(null)}
                                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors group"
                                >
                                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform"/>
                                    <span className="text-[13px] font-medium">Back</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {inlineViewItem.fileType === 'img' && <ImageViewer item={inlineViewItem}/>}
                                {inlineViewItem.fileType === 'txt' && <TextViewer  item={inlineViewItem}/>}
                                {inlineViewItem.fileType === 'pdf' && <PdfViewer   item={inlineViewItem}/>}
                                {inlineViewItem.kind === 'folder'  && <ProjectViewer item={inlineViewItem}/>}
                                {!['img','txt','pdf'].includes(inlineViewItem.fileType) && inlineViewItem.kind !== 'folder' && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                                        <File size={56} className="stroke-1"/>
                                        <p className="text-sm">No preview for this file type</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ── File grid ── */
                                <div className="flex-1 overflow-y-auto overflow-x-visible p-6">
                                    <div className="flex gap-6 h-full">
                                        <div className="flex-1">
                                            {(filteredChildren.length > 0) ? (
                                                <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-y-4 gap-x-2">
                                                    {filteredChildren.map((item, idx) => {
                                                        const uid = item.node_id || item.id || item.url || item.name;
                                                        return (
                                                            <div
                                                                key={uid}
                                                                onClick={() => handleSingleClick(item)}
                                                                onDoubleClick={() => handleDoubleClick(item)}
                                                                className={`relative group overflow-visible flex flex-col items-center p-2 rounded-xl cursor-default transition-all select-none ${
                                                                    selectedId === uid
                                                                        ? 'bg-blue-100/60 ring-1 ring-blue-200'
                                                                        : 'hover:bg-gray-50'
                                                                }`}
                                                            >
                                                            {/* Hover Preview Card */}
                                                            <div
                                                                className={`absolute top-full z-[50] pointer-events-none bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.14)] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                                                    idx === 0 
                                                                        ? 'left-0 transform-none' 
                                                                        : 'left-1/2 -translate-x-1/2'
                                                                }`}
                                                                style={{ width: 200 }}
                                                            >
                                                                {/* 1. Image preview */}
                                                                <div className="w-full h-[118px] bg-gray-100 overflow-hidden">
                                                                    {(item.imageUrl || item.openGraphImageUrl) && (
                                                                        <img
                                                                            src={item.imageUrl || item.openGraphImageUrl}
                                                                            alt={item.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={e => {
                                                                                e.target.style.display = 'none';
                                                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <div
                                                                        className="w-full h-full items-center justify-center text-white font-bold text-3xl"
                                                                        style={{
                                                                            background: getColor(item.name),
                                                                            display: (item.imageUrl || item.openGraphImageUrl) ? 'none' : 'flex',
                                                                        }}
                                                                    >
                                                                        {getInitials(item.name)}
                                                                    </div>
                                                                </div>

                                                                {/* 2. Name + type */}
                                                                <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-t border-gray-100">
                                                                    <p className="text-[12px] font-semibold text-gray-900 truncate">{item.name}</p>
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide shrink-0">
                                                                        {getTypeLabel(item)}
                                                                    </span>
                                                                </div>

                                                                {/* 3. Description */}
                                                                <div className="px-3 pb-3 border-t border-gray-100">
                                                                    <p className={`text-[11.5px] leading-relaxed mt-2 line-clamp-2 ${
                                                                        getDescription(item) ? 'text-gray-500' : 'text-gray-300 italic'
                                                                    }`}>
                                                                        {getDescription(item) || 'No description available.'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="relative">
                                                                {item.stargazerCount !== undefined ? (
                                                                    <RepoIcon item={item} />
                                                                ) : (
                                                                    <FileIcon item={item}/>
                                                                )}
                                                                {item.primaryLanguage && (
                                                                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white" style={{ background: item.primaryLanguage.color || '#3178c6' }} />
                                                                )}
                                                            </div>
                                                            <p className="mt-1.5 text-[11px] font-medium text-gray-700 text-center leading-tight w-20 line-clamp-2">
                                                                {item.name}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            ) : (isContentsLoading || (isPinnedLoading && currentFolder?.type === 'work')) ? (
                                                <div className="flex flex-col items-center justify-center h-full gap-4 w-full">
                                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] w-full gap-y-6 gap-x-3">
                                                        {[...Array(12)].map((_, i) => <RepoSkeleton key={i} />)}
                                                    </div>
                                                    <p className="text-xs text-gray-400 animate-pulse">Connecting to GitHub...</p>
                                                </div>
                                            ) : (error && currentFolder.type === 'work') ? (
                                                <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4">
                                                    <div className="p-4 bg-red-50 rounded-full">
                                                        <AlertCircle size={40} className="text-red-500" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">Connection Failed</h3>
                                                        <p className="text-sm text-gray-500 mt-1 max-w-[300px]">
                                                            {error || "An unexpected error occurred while connecting to GitHub."}
                                                        </p>
                                                        <button 
                                                            onClick={() => fetchPinnedRepos()}
                                                            className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            Try Again
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : searchQuery ? (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                                                    <Search size={48} className="opacity-40"/>
                                                    <p className="text-sm font-medium text-gray-400">No results for "{searchQuery}"</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-200 gap-3 select-none">
                                                    <Folder size={56} className="stroke-1"/>
                                                    <p className="text-sm font-medium text-gray-300">Folder is Empty</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedId && (
                                            <div className="w-72 border-l border-gray-200/50 bg-[#f6f6f6]/30 backdrop-blur-md p-6 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300 overflow-y-auto relative shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
                                                {/* macOS Inspector thin border */}
                                                <div className="absolute inset-y-0 left-0 w-[1px] bg-white/40" />

                                                {(() => {
                                                    const selectedItem = filteredChildren.find(i => (i.node_id || i.id || i.url || i.name) === selectedId) || 
                                                                         myProjects.find(p => (p.node_id || p.id || p.url || p.name) === selectedId);
                                                    if (!selectedItem) return null;
                                                    const previewImg = selectedItem.imageUrl || selectedItem.openGraphImageUrl || `/assets/previews/${selectedItem.name}.png`;
                                                    
                                                    return (
                                                        <>
                                                            <div className="flex flex-col items-center text-center gap-4">
                                                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-white/80 p-1">
                                                                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 relative group/prev flex items-center justify-center">
                                                                        {previewImg && (
                                                                            <img 
                                                                                src={previewImg} 
                                                                                alt={selectedItem.name}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    e.target.style.display = 'none';
                                                                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <div 
                                                                            className="w-full h-full items-center justify-center text-white font-bold text-2xl"
                                                                            style={{ 
                                                                                background: getColor(selectedItem.name),
                                                                                display: previewImg ? 'none' : 'flex'
                                                                            }}
                                                                        >
                                                                            {getInitials(selectedItem.name)}
                                                                        </div>
                                                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/prev:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{selectedItem.name}</h3>
                                                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em] mt-0.5">{getTypeLabel(selectedItem)}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-4">
                                                                <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
                                                                    <p className="text-[12px] leading-relaxed text-gray-600 font-medium">
                                                                        {getDescription(selectedItem) || "No extra information available for this item."}
                                                                    </p>
                                                                </div>

                                                                <div className="grid grid-cols-1 gap-2">
                                                                    <a 
                                                                        href={selectedItem.url || selectedItem.html_url} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-sm active:scale-[0.98]"
                                                                    >
                                                                        View on GitHub
                                                                        <ExternalLink size={12} />
                                                                    </a>
                                                                    {selectedItem.homepageUrl && (
                                                                        <a 
                                                                            href={selectedItem.homepageUrl} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-[0.98]"
                                                                        >
                                                                            Visit Live Site
                                                                            <ExternalLink size={12} />
                                                                        </a>
                                                                    )}
                                                                    <button 
                                                                        onClick={() => handleDoubleClick(selectedItem)}
                                                                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/80 text-gray-900 rounded-xl text-xs font-bold border border-gray-200 hover:bg-white transition-all shadow-sm active:scale-[0.98]"
                                                                    >
                                                                        Open Folder
                                                                        <ArrowUpRight size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="mt-auto pt-6 border-t border-gray-200/50 flex flex-col gap-2">
                                                                <div className="flex justify-between text-[11px]">
                                                                    <span className="text-gray-400">Stars</span>
                                                                    <span className="text-gray-700 font-bold">{selectedItem.stargazerCount || 0}</span>
                                                                </div>
                                                                <div className="flex justify-between text-[11px]">
                                                                    <span className="text-gray-400">Language</span>
                                                                    <span className="text-gray-700 font-bold">{selectedItem.primaryLanguage?.name || 'Unknown'}</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WindowWrapper(Finder, 'finder');