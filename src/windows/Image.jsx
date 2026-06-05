import React from 'react';
import useWindowsStore from '../store/window';
import WindowWrapper from '../hoc/WindowWrapper';

const ImageWindow = () => {
    const { windows, closeWindow, focusWindow } = useWindowsStore();
    const data = windows.imgfile.data;

    if (!data) return null;

    const { name, imageUrl } = data;

    return (
        <div 
            onMouseDown={() => focusWindow('imgfile')}
            className="flex flex-col w-[min(600px,94vw)] max-h-[85vh] bg-white rounded-xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] border border-black/10 overflow-hidden font-sans"
        >
            {/* Title Bar */}
            <div className="window-header h-12 bg-[#f6f6f6] border-b border-gray-200 flex items-center px-4 shrink-0 select-none cursor-grab active:cursor-grabbing">
                {/* Traffic Lights */}
                <div className="flex gap-2.5 min-w-[70px] group/lights">
                    <div 
                        onClick={(e) => { e.stopPropagation(); closeWindow('imgfile'); }}
                        className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group"
                    >
                        <span className="opacity-0 group-hover/lights:opacity-100 text-[9px] text-black/60 font-black">✕</span>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group">
                        <span className="opacity-0 group-hover/lights:opacity-100 text-[10px] text-black/60 font-black">−</span>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group">
                        <span className="opacity-0 group-hover/lights:opacity-100 text-[9px] text-black/60 font-black">＋</span>
                    </div>
                </div>
                <div className="flex-1 text-center text-[13px] font-semibold text-gray-700 truncate pr-[70px]">
                    {name}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-[#ebebeb] flex items-center justify-center p-2">
                <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-inner">
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        className="max-w-full max-h-full object-contain"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Footer / Status Bar (Optional macOS style) */}
            <div className="h-10 bg-[#f6f6f6] border-t border-gray-200 flex items-center justify-center px-4 shrink-0">
                <span className="text-[11px] text-gray-500 font-medium">
                    {name} • Image
                </span>
            </div>
        </div>
    );
};

export default WindowWrapper(ImageWindow, 'imgfile');
