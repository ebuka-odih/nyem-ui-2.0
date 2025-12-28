
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, X, Star, Heart, Share2 } from 'lucide-react';
import { ActionTooltip } from './ActionTooltip';

interface SwipeControlsProps {
  onUndo: () => void;
  onNope: () => void;
  onStar: () => void;
  onLike: () => void;
  onShare: () => void;
  canUndo: boolean;
}

export const SwipeControls: React.FC<SwipeControlsProps> = ({
  onUndo, onNope, onStar, onLike, onShare, canUndo,
}) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  return (
    <div className="flex justify-center w-full pointer-events-none px-4">
      <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-3.5 bg-black/95 backdrop-blur-2xl rounded-full shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/5 pointer-events-auto">
        {/* Undo Button */}
        <div className="relative">
          <ActionTooltip label="Undo" isVisible={hoveredAction === 'undo' && canUndo} offset={-55} />
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onUndo} onMouseEnter={() => setHoveredAction('undo')} onMouseLeave={() => setHoveredAction(null)}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#E7C184] shadow-md transition-all ${!canUndo ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
          >
            <RotateCcw size={18} strokeWidth={4} />
          </motion.button>
        </div>

        {/* Nope Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
          onClick={onNope} 
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-[#F63A6E] shadow-lg"
        >
          <X size={28} strokeWidth={6} />
        </motion.button>

        {/* Star Button (The Big One) */}
        <motion.button 
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={onStar} 
          className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center rounded-full bg-white text-[#29B3F0] shadow-[0_12px_40px_rgba(41,179,240,0.4)] z-20"
        >
          <Star size={44} strokeWidth={0} fill="currentColor" />
          <div className="absolute inset-0 bg-white rounded-full -z-10 scale-[1.03]" />
        </motion.button>

        {/* Like Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
          onClick={onLike} 
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-[#15D491] shadow-lg"
        >
          <Heart size={30} strokeWidth={0} fill="currentColor" />
        </motion.button>

        {/* Share Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onShare} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#8A56FF] shadow-md"
        >
          <Share2 size={18} strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};
