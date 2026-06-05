import React, { useState } from 'react';
import { WindowController } from '../components';
import WindowWrapper from '../hoc/WindowWrapper';
import { motion } from 'framer-motion';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Download, Loader2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Resume = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="flex flex-col w-[min(700px,94vw)] h-[min(85vh,700px)] bg-white rounded-xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] border border-black/10 overflow-hidden">
      
      {/* Custom Window Header for Resume matching the screenshot */}
      <WindowController windowKey="resume">
        <div className="flex-1 flex items-center justify-center relative w-full h-full pr-4">
          <div className="text-center text-[#404040]/80 text-[13px] font-medium select-none">
            Resume.pdf
          </div>
          <a 
            href="/files/Angelo_Mafilas_Resume_2027.pdf" 
            download="Angelo_Mafilas_Resume_2027.pdf"
            className="absolute right-0 flex items-center justify-center w-8 h-8 rounded hover:bg-black/10 transition-colors cursor-pointer text-[#404040]/60 hover:text-black"
            title="Download Resume"
          >
            <Download size={16} strokeWidth={2.5} />
          </a>
        </div>
      </WindowController>

      {/* PDF Viewer Area - Seamless White Background */}
      <div className="flex-1 w-full bg-white overflow-y-auto overflow-x-hidden flex justify-center custom-scrollbar pb-10 relative">
        
        {/* Premium Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <Loader2 className="w-7 h-7 text-black/30 animate-spin mb-3" />
            <p className="text-[#404040]/50 font-medium text-xs tracking-wide uppercase">Rendering Document...</p>
          </div>
        )}

        <Document 
          file="/files/Angelo_Mafilas_Resume_2027.pdf"
          className="w-full flex justify-center pt-6"
          loading={null}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <Page 
              pageNumber={1} 
              onLoadSuccess={() => setIsLoaded(true)}
              renderTextLayer={false}
              renderAnnotationLayer={false} 
              className="w-full h-fit flex justify-center"
              renderMode="canvas"
              scale={1} 

            />
          </motion.div>
        </Document>
      </div>

      {/* CSS overrides for making the PDF fully responsive and scrollbar minimal */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
        .react-pdf__Page__canvas {
          margin: 0 auto;
          max-width: 100% !important;
          height: auto !important;
        }
        .react-pdf__Page__textContent, .react-pdf__Page__annotations {
          max-width: 100% !important;
        }
      `}} />
    </div>
  );
};

export default WindowWrapper(Resume, 'resume');