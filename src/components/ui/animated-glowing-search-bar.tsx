import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Search, Cpu, Paperclip, HardDrive, ArrowUp } from 'lucide-react';

interface SearchComponentProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  user?: any;
  onShowLogin?: () => void;
  onShowHardware?: (tab: 'camera' | 'upload' | 'drive') => void;
}

export const SearchComponent = ({ onSearch, user, onShowLogin, onShowHardware }: SearchComponentProps) => {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const placeholders = [
    "Brake pads for 2018 Swift...",
    "Engine oil for Royal Enfield...",
    "Clutch plate for Hyundai i20...",
    "Headlights for Tata Nexon...",
    "Air filter for Honda Activa..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() && onSearch) {
      onSearch(query);
    }
  };

  const handleHardwareClick = (tab: 'camera' | 'upload' | 'drive') => {
    if (!user) {
      onShowLogin?.();
    } else {
      onShowHardware?.(tab);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!user) {
      onShowLogin?.();
      return;
    }
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onShowHardware?.('upload');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    let hasImage = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        hasImage = true;
        break;
      }
    }

    if (hasImage) {
      if (!user) {
        onShowLogin?.();
      } else {
        onShowHardware?.('upload');
      }
    }
  };

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center gap-4 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <div id="poda" className={`relative flex items-center justify-center group w-full max-w-[600px] transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}>
        {/* Glowing Background Layers */}
        <div className={`absolute z-[-1] overflow-hidden h-full w-full rounded-2xl blur-[4px] transition-all duration-500
                        before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                        before:bg-[conic-gradient(#000,#ff4d00_5%,#000_38%,#000_50%,#ff8c00_60%,#000_87%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]
                        ${isFocused || isDragging ? 'opacity-100 scale-105' : 'opacity-70 scale-100'}`}>
        </div>
        
        <div id="main" className={`relative group flex items-center w-full bg-[#0A0A0B] rounded-2xl border p-1.5 transition-all focus-within:border-brand-orange/50 ${isDragging ? 'border-brand-orange shadow-[0_0_30px_rgba(255,77,0,0.3)]' : 'border-white/10'}`}>
          <div className="flex items-center gap-3 pl-4 flex-1">
            <Search size={18} className={`${isFocused || isDragging ? 'text-brand-orange' : 'text-white/30'} transition-colors`} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDragging ? "Drop to search with image..." : placeholders[placeholderIndex]} 
              type="text" 
              className="bg-transparent w-full h-[48px] text-white text-sm md:text-base focus:outline-none placeholder:text-white/20" 
            />
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 pr-2">
            <div className="flex items-center gap-0.5 md:gap-1 border-r border-white/10 pr-2 mr-1">
              <button 
                onClick={() => handleHardwareClick('camera')}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                title="Camera"
              >
                <Camera size={18} />
              </button>
              <button 
                onClick={() => handleHardwareClick('upload')}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                title="Upload from Mobile"
              >
                <Paperclip size={18} />
              </button>
              <button 
                onClick={() => handleHardwareClick('drive')}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                title="Drive Options"
              >
                <HardDrive size={18} />
              </button>
            </div>
            
            <button 
              onClick={() => query.trim() && onSearch?.(query)}
              className={`flex items-center justify-center h-10 w-10 md:w-auto md:px-5 rounded-xl transition-all font-black uppercase tracking-widest text-[10px]
                        ${query.trim() 
                          ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.4)] hover:scale-105 active:scale-95' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
            >
              <span className="hidden md:inline mr-2">Search</span>
              <ArrowUp size={16} className={query.trim() ? 'animate-bounce-subtle' : ''} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">
        <Cpu size={10} className="text-brand-orange" />
        <span>Quick Strike: AI-Powered Search</span>
      </div>
    </motion.div>
  );
};
