import React from 'react'
import { navIcons, navLinks } from './constants'
import useWindowsStore from '../store/window'

const Navbar = () => {
    const { openWindow } = useWindowsStore();
    return (
        <nav className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 z-[100] border-b border-white/5 select-none">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src="/icons/apple.svg" className="w-4 h-4 invert opacity-90" alt="apple" />
                    <span className="text-[13px] font-bold text-white">Angelo's Portfolio</span>
                </div>
                <ul className="flex items-center gap-4">
                    {navLinks.map(({ id, name, type }) => (
                        <li 
                            key={id} 
                            onClick={() => openWindow(type)} 
                            className="text-[13px] font-medium text-white/90 hover:bg-white/10 px-2 py-0.5 rounded-md cursor-default transition-colors"
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center gap-3">
                <ul className="flex items-center gap-3">
                    {navIcons.map(({ id, img, type }) => (
                        <li key={id}>
                            <img 
                                src={img} 
                                className="w-4 h-4 invert opacity-80 hover:opacity-100 transition-opacity cursor-default" 
                                alt="icon" 
                                onClick={() => openWindow(type)}
                            />
                        </li>
                    ))}
                </ul>
                <div className="text-[13px] font-medium text-white/90 min-w-[140px] text-right">
                    {new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;