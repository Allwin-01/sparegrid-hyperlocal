
import React from 'react';
import { motion } from 'motion/react';
import { SpotlightCard } from './ui/spotlight-card';

interface BentoItemProps {
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

export const BentoItem: React.FC<BentoItemProps> = ({ name, icon: Icon, color, className, glowColor = 'orange' }) => {
  return (
    <SpotlightCard 
      glowColor={glowColor}
      className={`relative overflow-hidden flex flex-col items-center justify-center group transition-all duration-500 min-h-[140px] md:min-h-[160px] h-auto ${className}`}
      customSize
    >
      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mt-4 mb-4 md:mt-6 md:mb-6 group-hover:bg-brand-orange/10 transition-all duration-500 shadow-inner ${color}`}>
        <Icon size={32} />
      </div>
      
      <div className="relative z-10 text-center">
        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">{name}</h3>
      </div>
      
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-orange group-hover:w-full transition-all duration-500" />
    </SpotlightCard>
  );
};

export const BentoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8 mb-12">
      {children}
    </div>
  );
};
