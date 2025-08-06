
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SheetMusic } from '../types';
import { PlayIcon, PauseIcon, PlusIcon, MinusIcon, FullscreenOpenIcon, FullscreenCloseIcon, ArrowLeftIcon, FilePlusIcon } from './icons';

interface ViewerProps {
  file: SheetMusic;
  onClose: () => void;
  onAddToPlaylist: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const Viewer: React.FC<ViewerProps> = ({ file, onClose, onAddToPlaylist, isFullscreen, onToggleFullscreen }) => {
  const [scale, setScale] = useState(1);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // pixels per frame
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const lastTap = useRef(0);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setScale(currentScale => (currentScale > 1 ? 1 : 2));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap.current;
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      setScale(currentScale => (currentScale > 1 ? 1 : 2.5));
    }
    lastTap.current = currentTime;
  };
  
  const startScrolling = useCallback(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    
    const scroll = () => {
      if (viewer.scrollTop + viewer.clientHeight < viewer.scrollHeight) {
        viewer.scrollTop += scrollSpeed / 10;
        scrollIntervalRef.current = requestAnimationFrame(scroll);
      } else {
        setIsAutoScrolling(false);
      }
    };
    scrollIntervalRef.current = requestAnimationFrame(scroll);
  }, [scrollSpeed]);

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      cancelAnimationFrame(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoScrolling) {
      startScrolling();
    } else {
      stopScrolling();
    }
    return () => stopScrolling();
  }, [isAutoScrolling, startScrolling, stopScrolling]);

  const changeSpeed = (delta: number) => {
    setScrollSpeed(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const zoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col h-full w-full">
      {/* Header */}
      {!isFullscreen && (
        <header className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm z-20 flex items-center justify-between p-2 shadow-lg">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors">
            <ArrowLeftIcon />
          </button>
          <h1 className="text-lg font-bold text-gray-200 truncate mx-4 flex-1 text-center">{file.name}</h1>
          <button onClick={onAddToPlaylist} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors">
            <FilePlusIcon />
          </button>
        </header>
      )}

      {/* Viewer Content */}
      <div
        ref={viewerRef}
        className="flex-grow overflow-auto smooth-scrolling"
        onDoubleClick={handleDoubleClick}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex flex-col items-center py-4 transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          {file.pages.map((pageUrl, index) => (
            <img 
              key={index} 
              src={pageUrl} 
              alt={`Page ${index + 1}`} 
              className="max-w-full h-auto shadow-xl mb-4 bg-white"
              style={{ width: '80vw', maxWidth: '800px'}}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <footer className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm z-20 p-2 shadow-t-lg">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">Zoom</span>
              <button onClick={() => zoom(-0.25)} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors disabled:opacity-50" disabled={scale <= 0.5}><MinusIcon className="w-5 h-5"/></button>
              <span className="w-8 text-center font-mono text-sm">x{scale.toFixed(2)}</span>
              <button onClick={() => zoom(0.25)} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors disabled:opacity-50" disabled={scale >= 3}><PlusIcon className="w-5 h-5"/></button>
            </div>

            {/* Auto-Scroll Controls */}
            <div className="flex items-center space-x-2">
              <button onClick={() => changeSpeed(-1)} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors disabled:opacity-50" disabled={scrollSpeed <= 1}><MinusIcon className="w-5 h-5"/></button>
              <button onClick={() => setIsAutoScrolling(!isAutoScrolling)} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 active:bg-blue-700 transition-colors">
                {isAutoScrolling ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={() => changeSpeed(1)} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors disabled:opacity-50" disabled={scrollSpeed >= 10}><PlusIcon className="w-5 h-5"/></button>
            </div>
            
            {/* Fullscreen Button */}
            <button onClick={onToggleFullscreen} className="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors">
              {isFullscreen ? <FullscreenCloseIcon /> : <FullscreenOpenIcon />}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Viewer;
