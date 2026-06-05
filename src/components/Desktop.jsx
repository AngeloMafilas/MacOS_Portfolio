import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import useWindowsStore from '../store/window';
import useLocationStore from '../store/location';
import useGithubStore from '../store/github';
import { locations } from './constants';

gsap.registerPlugin(Draggable);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FolderIcon = ({ className }) => (
    <svg 
        width="52" 
        height="52" 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
    >
        <path d="M4 14C4 11.7909 5.79086 10 8 10H22.5L28 15.5H56C58.2091 15.5 60 17.2909 60 19.5V50C60 52.2091 58.2091 54 56 54H8C57.7909 54 4 52.2091 4 50V14Z" fill="#7DD3FC" />
        <path d="M4 19.5C4 17.2909 5.79086 15.5 8 15.5H56C58.2091 15.5 60 17.2909 60 19.5V50C60 52.2091 58.2091 54 56 54H8C5.79086 54 4 52.2091 4 50V19.5Z" fill="#9DDDFD" />
        <circle cx="32" cy="35" r="5" fill="white" fillOpacity="0.4" />
    </svg>
);

const DesktopIcon = ({ item, type = 'project', selectedId, onSelect, onOpen, initialX, initialY }) => {
    const iconRef = useRef(null);
    const { openWindow } = useWindowsStore();
    const { setActiveLocation } = useLocationStore();
    const isSelected = selectedId === (item.id || item.name);

    useGSAP(() => {
        Draggable.create(iconRef.current, {
            type: "x,y",
            bounds: "body",
            inertia: true,
            onPress: () => onSelect(item.id || item.name),
        });
    }, []);

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (onOpen) onOpen();
        
        if (type === 'all-projects') {
            setActiveLocation({
                name: "All Projects",
                kind: "folder",
                children: item.children
            });
            openWindow('finder');
        } else {
            setActiveLocation(item);
            openWindow('finder');
        }
    };

    return (
        <div 
            ref={iconRef}
            className="absolute flex flex-col items-center group cursor-default select-none w-[100px] z-20 pointer-events-auto"
            style={{ right: initialX, top: initialY }}
            onDoubleClick={handleDoubleClick}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id || item.name);
            }}
        >
            <div className={cn(
                "relative p-1.5 rounded-lg transition-all duration-75 flex items-center justify-center",
                isSelected ? "bg-white/20 shadow-sm" : "group-hover:bg-white/10"
            )}>
                <FolderIcon />
            </div>
            
            <p className={cn(
                "mt-1 px-1.5 py-0.5 text-[11px] font-medium text-center leading-[1.2] max-w-[95px] rounded-[3px] transition-colors line-clamp-2",
                isSelected 
                    ? "bg-[#0058D0] text-white shadow-sm ring-[0.5px] ring-white/20" 
                    : "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]"
            )}>
                {item.name}
            </p>
        </div>
    );
};

const SkeletonIcon = ({ x, y }) => (
    <div 
        className="absolute flex flex-col items-center w-[100px] pointer-events-none"
        style={{ right: x, top: y }}
    >
        <div className="w-16 h-12 bg-white/10 rounded-lg animate-pulse mb-2" />
        <div className="w-14 h-3 bg-white/10 rounded animate-pulse" />
    </div>
);

const Desktop = () => {
    const [selectedId, setSelectedId] = useState(null);
    const { 
        pinnedRepos, 
        allRepos, 
        isPinnedLoading, 
        fetchPinnedRepos, 
        fetchAllRepos,
        fetchRepoContents 
    } = useGithubStore();

    useEffect(() => {
        fetchPinnedRepos();
    }, [fetchPinnedRepos]);

    // Double click handler for All Projects folder
    const handleAllProjectsOpen = () => {
        fetchAllRepos();
    };

    // Determine which icons to show
    const displayPinned = (pinnedRepos.length > 0) 
        ? pinnedRepos 
        : locations.work.children.slice(0, 5);

    return (
        <div 
            className="fixed inset-0 pointer-events-none z-10"
            onClick={() => setSelectedId(null)}
        >
                {isPinnedLoading ? (
                    [...Array(6)].map((_, i) => (
                        <SkeletonIcon key={i} x={40} y={80 + (i * 110)} />
                    ))
                ) : (
                    <>
                        {displayPinned.map((project, i) => (
                            <DesktopIcon 
                                key={project.id || project.name} 
                                item={project} 
                                selectedId={selectedId} 
                                onSelect={setSelectedId}
                                onOpen={() => project.stargazerCount !== undefined && fetchRepoContents(project.name)}
                                initialX={40}
                                initialY={80 + (i * 96)}
                            />
                        ))}
                    </>
                )}
            </div>
    );
};

export default Desktop;
