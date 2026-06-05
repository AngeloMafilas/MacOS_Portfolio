import React from 'react';
import useWindowsStore from '../store/window';
import WindowWrapper from '../hoc/WindowWrapper';

const TextWindow = () => {
    const { windows, closeWindow, focusWindow } = useWindowsStore();
    const data = windows.txtfile.data;

    if (!data) return null;

    const { name, image, subtitle, description } = data;

    return (
        <div 
            onMouseDown={() => focusWindow('txtfile')}
            className="flex flex-col w-[min(500px,94vw)] max-h-[80vh] bg-white rounded-xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] border border-black/10 overflow-hidden font-sans"
        >
            {/* Title Bar */}
            <div className="window-header h-12 bg-[#f6f6f6] border-b border-gray-200 flex items-center px-4 shrink-0 select-none cursor-grab active:cursor-grabbing">
                {/* Traffic Lights */}
                <div className="flex gap-2.5 min-w-[70px] group/lights">
                    <div 
                        onClick={(e) => { e.stopPropagation(); closeWindow('txtfile'); }}
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
            <div className="flex-1 overflow-y-auto bg-white p-8">
                {image && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-6 shadow-sm border border-black/5">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{name}</h2>
                    {subtitle && <p className="text-blue-600 font-medium text-sm mt-1">{subtitle}</p>}
                </div>

                <div className="space-y-4">
                    {description && Array.isArray(description) ? (
                        description.map((para, i) => (
                            <p key={i} className="text-[15px] text-gray-700 leading-relaxed">
                                {para}
                            </p>
                        ))
                    ) : (
                        <p className="text-[15px] text-gray-700 leading-relaxed">{description}</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="h-12 bg-gray-50 border-t border-gray-100 flex items-center justify-end px-6 shrink-0">
                <button 
                    onClick={() => closeWindow('txtfile')}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default WindowWrapper(TextWindow, 'txtfile');
