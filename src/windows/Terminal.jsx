import React, { useState, useEffect, useRef } from 'react';
import WindowWrapper from '../hoc/WindowWrapper';
import { techStack } from '../components/constants';
import useWindowsStore from '../store/window';

const Terminal = () => {
  const { closeWindow, focusWindow } = useWindowsStore();
  const terminalRef = useRef(null);
  
  const [lines, setLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  // Format script specifically for tech stats
  const script = [
    { text: "user@angelo-macbook ~ % show tech-stat", type: "cmd" },
    { text: "Loading technology stack... ◇◆◈◉◊", type: "sys" },
    { text: "", type: "empty" },
    { text: "CATEGORY           TECHNOLOGIES", type: "header" },
    { text: "------------------------------------------------", type: "sys" },
    ...techStack.map(t => {
      // Pad category to align the columns nicely
      const paddedCat = t.category.padEnd(16, ' ');
      return { text: `✅ ${paddedCat} ${t.items.join(', ')}`, type: "tech" };
    }),
    { text: "", type: "empty" },
    { text: `✅ ${techStack.length} of ${techStack.length} stacks loaded successfully (100%)`, type: "success" },
    { text: "Render time: 6ms", type: "sys" },
  ];

  useEffect(() => {
    if (currentLineIdx < script.length) {
      const currentLine = script[currentLineIdx];
      
      if (currentCharIdx < currentLine.text.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIdx(prev => prev + 1);
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        }, 10); // Much faster typing
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, currentLine]);
          setCurrentLineIdx(prev => prev + 1);
          setCurrentCharIdx(0);
        }, 50); // Faster line transition
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIdx, currentCharIdx]);

  const renderText = (text, type) => {
    return text.split('').map((char, i) => {
      if (['◇', '◆', '◈', '◉', '◊'].includes(char)) {
        return <span key={i} className="inline-block animate-symbol text-[#4ec9b0]">{char}</span>;
      }
      return char;
    });
  };

  const getLineClass = (type) => {
    switch (type) {
      case 'cmd': return 'text-white font-bold';
      case 'sys': return 'text-[#858585]';
      case 'header': return 'text-[#569cd6] font-bold';
      case 'tech': return 'text-[#d4d4d4]'; // Keep main text white/gray
      case 'success': return 'text-[#4ec9b0] font-bold';
      default: return 'text-[#d4d4d4]';
    }
  };

  // Helper to colorize the checkmarks specifically
  const formatLine = (text, type) => {
    if (type === 'tech' || type === 'success') {
      // Colorize the ✅ and the category name for tech lines
      if (text.startsWith('✅')) {
        return (
          <>
            <span className="text-[#4ec9b0] mr-2">✔</span>
            {type === 'tech' ? (
              <>
                <span className="text-[#569cd6]">{text.substring(2, 19)}</span>
                <span className="text-[#4ec9b0]">{text.substring(19)}</span>
              </>
            ) : (
              <span>{text.substring(2)}</span>
            )}
          </>
        );
      }
    }
    return renderText(text, type);
  };

  return (
    <>
      <style>{`
        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-symbol {
          animation: fadeScale 0.6s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e1e1e; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
      `}</style>
      
      {/* 
        Fixed white bar and cutoff: 
        Removed mt-20 and rounded-xl. Made width/height full so it expands to the #terminal section. 
        Gave it a min-height so it doesn't collapse.
      */}
      <div className="flex flex-col w-full h-full min-h-[450px] bg-[#1e1e1e] overflow-hidden">
        {/* Title Bar */}
        <div 
          className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-black/30 w-full"
          onMouseDown={() => focusWindow('terminal')}
        >
          <div className="flex gap-2">
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] cursor-pointer hover:bg-[#ff5f56]/80 flex items-center justify-center group"
              onClick={() => closeWindow('terminal')}
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/60 font-bold">✕</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] cursor-pointer hover:bg-[#ffbd2e]/80 flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/60 font-bold">−</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] cursor-pointer hover:bg-[#27c93f]/80 flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/60 font-bold">＋</span>
            </div>
          </div>
          <div className="flex-1 text-center text-[#d4d4d4] text-xs font-semibold select-none font-mono">
            angelo@macbook: ~
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={terminalRef}
          className="flex-1 p-6 font-mono text-[14px] overflow-y-auto custom-scrollbar w-full"
        >
          {lines.map((line, i) => (
            <div key={i} className={`whitespace-pre-wrap leading-relaxed ${getLineClass(line.type)}`}>
              {formatLine(line.text, line.type)}
            </div>
          ))}
          
          {/* Currently typing line */}
          {currentLineIdx < script.length && (
            <div className={`whitespace-pre-wrap leading-relaxed ${getLineClass(script[currentLineIdx].type)}`}>
              {formatLine(script[currentLineIdx].text.substring(0, currentCharIdx), script[currentLineIdx].type)}
              <span className="inline-block w-2.5 h-4 ml-1 bg-[#d4d4d4] animate-pulse"></span>
            </div>
          )}

          {/* Final Prompt */}
          {currentLineIdx >= script.length && (
            <div className="text-white font-bold mt-4 flex items-center">
              <span className="text-[#4ec9b0]">user@angelo-macbook</span>
              <span className="text-[#d4d4d4] mx-1">~</span>
              <span className="text-[#569cd6] mr-2">%</span>
              <span className="inline-block w-2.5 h-4 bg-[#d4d4d4] animate-pulse"></span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');
export default TerminalWindow;