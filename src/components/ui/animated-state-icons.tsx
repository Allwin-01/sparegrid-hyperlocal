import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle, Play, Pause } from 'lucide-react';

interface AnimatedStateIconProps {
  state: 'loading' | 'success' | 'error' | 'idle' | 'playing' | 'paused';
  size?: number;
  className?: string;
}

export const AnimatedStateIcon: React.FC<AnimatedStateIconProps> = ({
  state,
  size = 24,
  className,
}) => {
  return (
    <div className={className}>
      <motion.div
        key={state}
        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {state === 'loading' && (
          <Loader2 size={size} className="animate-spin text-primary" />
        )}
        {state === 'success' && (
          <Check size={size} className="text-green-500" />
        )}
        {state === 'error' && (
          <AlertCircle size={size} className="text-red-500" />
        )}
        {state === 'playing' && (
          <Play size={size} className="text-primary fill-primary" />
        )}
        {state === 'paused' && (
          <Pause size={size} className="text-primary fill-primary" />
        )}
        {state === 'idle' && (
          <div style={{ width: size, height: size }} className="rounded-full border-2 border-white/20" />
        )}
      </motion.div>
    </div>
  );
};
