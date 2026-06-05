import React, { useState, useRef } from 'react';
import WindowWrapper from '../hoc/WindowWrapper';
import useWindowsStore from '../store/window'; // Direct access to window state
import { 
  PanelLeft, ChevronLeft, ChevronRight, Search, RotateCw, 
  Share, Plus, Copy, LayoutGrid, Shield 
} from 'lucide-react';
import { blogPosts } from '#components/constants';

const Safari = () => {
  // --- STORE ACTIONS ---
  const { closeWindow, focusWindow } = useWindowsStore();
  const windowKey = 'safari';

  // --- CAROUSEL STATE ---
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- SCROLL LOGIC ---
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.offsetWidth;
    const index = Math.round(container.scrollLeft / cardWidth);
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.offsetWidth,
      behavior: 'smooth'
    });
  };

  const nextSlide = () => {
    if (activeIndex < blogPosts.length - 1) scrollToIndex(activeIndex + 1);
  };

  const prevSlide = () => {
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
  };

  return (
    /* 
      MAIN WINDOW WRAPPER 
      - Width: w-[95vw] max-w-[1400px] (Prevents screen cutoff)
      - Height: h-[90vh] (Matches viewport height)
      - Shadow: heavy shadow for depth
    */
    <div 
      onMouseDown={() => focusWindow(windowKey)}
      className="flex flex-col w-[min(80vw,1000px)] h-[min(75vh,700px)] bg-white overflow-y-hidden rounded-2xl border border-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] select-none">      
      {/* 
        SECTION 1: MACOS TOOLBAR (BUILT-IN)
        - Fixed Height: h-14 (56px)
        - class 'window-header' makes it draggable via WindowWrapper
      */}
      <div className="window-header flex items-center px-5 h-14 bg-[#f6f6f6] border-b border-black/10 w-full shrink-0 cursor-grab active:cursor-grabbing">
        
        {/* Traffic Light Controls (Left Side) */}
        <div className="flex gap-2.5 min-w-[70px] mr-4 shrink-0">
          <div 
            onClick={(e) => { e.stopPropagation(); closeWindow(windowKey); }}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[9px] text-black/60 font-black">✕</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group">
            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-black/60 font-black">−</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group">
            <span className="opacity-0 group-hover:opacity-100 text-[9px] text-black/60 font-black">＋</span>
          </div>
        </div>

        {/* Browser Toolbar Items */}
        <div className="flex items-center justify-between w-full h-full">
          {/* Nav Buttons */}
          <div className="flex items-center gap-4 shrink-0 pr-4">
            <PanelLeft size={18} className="text-[#404040]/80 cursor-pointer hover:bg-black/5 rounded p-0.5 transition-colors hidden md:block" />
            <div className="flex items-center gap-3">
              <ChevronLeft size={20} className="text-[#404040]/30" />
              <ChevronRight size={20} className="text-[#404040]/30" />
            </div>
          </div>

          {/* Search Bar - Width: max-w-[600px] */}
          <div className="flex-1 max-w-[600px] flex items-center h-8 bg-black/5 rounded-lg px-3 gap-2 border border-transparent">
            <Shield size={13} className="text-[#404040]/40 shrink-0" />
            <Search size={14} className="text-[#404040]/40 shrink-0" />
            <div className="flex-1 text-[13px] text-[#404040]/60 text-center truncate font-normal">
              Search or enter website name
            </div>
            <RotateCw size={14} className="text-[#404040]/40 shrink-0 cursor-pointer hover:text-black transition-colors" />
          </div>

          {/* Action Icons (Right Side) */}
          <div className="flex items-center gap-5 shrink-0 pl-6 text-[#404040]/80">
            <Share size={18} className="cursor-pointer hover:text-black transition-colors" />
            <Plus size={20} className="cursor-pointer hover:text-black transition-colors" />
            <Copy size={18} className="cursor-pointer hover:text-black transition-colors" />
            <LayoutGrid size={18} className="cursor-pointer hover:text-black transition-colors" />
          </div>
        </div>
      </div>

      {/* 
        SECTION 2: MAIN CONTENT AREA 
        - Padding: pt-10 pb-6
        - Flexbox: flex-1 min-h-0 (Crucial for vertical stability)
      */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white">
        
        {/* Page Header */}
        <div className="shrink-0 pt-10 pb-4 text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-black tracking-tight mb-3">
            Featured Posts
          </h2>
          <p className="text-[#86868b] text-base sm:text-lg font-medium max-w-xl mx-auto leading-snug opacity-70">
            Explore my latest work and insights through an interactive feed.
          </p>
        </div>

        {/* 
          SECTION 3: CAROUSEL TRACK 
          - Width: max-w-5xl (Framed center)
          - Snap: Mandatory horizontal snapping
        */}
        <div className="flex-1 min-h-0 relative mx-auto w-full max-w-5xl px-10 my-4">
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={activeIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/95 border border-black/10 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronLeft size={24} className="text-black" />
          </button>

          <button
            onClick={nextSlide}
            disabled={activeIndex === blogPosts.length - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/95 border border-black/10 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${activeIndex === blogPosts.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronRight size={24} className="text-black" />
          </button>

          {/* Horizontal Scroll Area */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-[2rem] border border-black/5 shadow-2xl bg-black/5"
          >
            {blogPosts?.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-full h-full overflow-hidden bg-black snap-start focus:ring-4 focus:ring-blue-500/50 outline-none"
              >
                {/* Visual Content (Background Image) */}
                <div className="absolute inset-0 h-full w-full transition-transform duration-1000 ease-out group-hover:scale-105">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Dark Scrim Gradient (Bottom-heavy for text legibility) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Metadata & Title Overlay */}
                <div className="relative h-full flex flex-col justify-end p-8 sm:p-14">
                  <div className="space-y-4 max-w-4xl">
                    <div className="flex items-center gap-3 text-sm text-white/70 font-medium">
                      <span>{post.date}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span>{post.category}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span>{post.duration}</span>
                    </div>
                    <h3 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 
          SECTION 4: POSITION INDICATORS (DOTS) 
          - Spacing: py-8
          - Interaction: Clickable dots
        */}
        <div className="shrink-0 flex items-center justify-center gap-2.5 py-8">
          {blogPosts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-10 bg-black' : 'w-2 bg-black/15 hover:bg-black/40'}`}
            />
          ))}
        </div>
      </div>

      {/* CSS Utility for hiding scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default WindowWrapper(Safari, 'safari');