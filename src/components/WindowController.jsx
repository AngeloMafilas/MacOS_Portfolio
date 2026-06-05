import React from 'react'
import useWindowsStore from '../store/window';

const WindowController = ({ windowKey, title, children }) => {
  const { closeWindow, focusWindow } = useWindowsStore();

  return (
    <div 
      className="window-header flex items-center px-5 h-14 bg-[#f6f6f6] border-b border-black/10 w-full cursor-grab active:cursor-grabbing rounded-t-xl"
      onMouseDown={() => focusWindow(windowKey)}
    >
      {/* Traffic Light Controls */}
      <div className="flex gap-2.5 min-w-[65px] mr-4 shrink-0">
        <div 
          className="w-4 h-4 rounded-full bg-[#ff5f56] cursor-pointer hover:bg-[#ff5f56]/80 flex items-center justify-center group"
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(windowKey);
          }}
        >
          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-black/60 font-bold leading-none">✕</span>
        </div>
        <div className="w-4 h-4 rounded-full bg-[#ffbd2e] cursor-pointer hover:bg-[#ffbd2e]/80 flex items-center justify-center group">
          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-black/60 font-bold leading-none">−</span>
        </div>
        <div className="w-4 h-4 rounded-full bg-[#27c93f] cursor-pointer hover:bg-[#27c93f]/80 flex items-center justify-center group">
          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-black/60 font-bold leading-none">＋</span>
        </div>
      </div>
      
      {/* Dynamic Content Area - Width is controlled by w-full here */}
      <div className="flex-1 flex items-center h-full w-full">
        {children ? children : (
          title && (
            <div className="flex-1 text-center text-[#404040] text-[13px] font-medium select-none pr-14 w-full">
              {title}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default WindowController
