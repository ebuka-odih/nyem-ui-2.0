
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

  /**
   * Refined Sizing Philosophy (Shrunk for better balance):
   * - Small: 42px (was 52px)
   * - Medium: 56px (was 68px)
   * - Big: 76px (was 92px)
   * - Icons scaled proportionally to maintain visual clarity.
   */

  return (
    <div className="flex justify-center w-full pointer-events-none px-6">
      <div className="flex items-end justify-center gap-2 pointer-events-auto">
        
        {/* Undo Button - Small (42px) */}
        <div className="relative">
          <ActionTooltip label="Undo" isVisible={hoveredAction === 'undo' && canUndo} offset={-50} />
          <motion.button 
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={onUndo} onMouseEnter={() => setHoveredAction('undo')} onMouseLeave={() => setHoveredAction(null)}
            className={`w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white text-[#E7C184] shadow-[0_6px_15px_rgba(0,0,0,0.06)] transition-all ${!canUndo ? 'opacity-20 pointer-events-none' : 'opacity-100 hover:shadow-lg'}`}
          >
            <RotateCcw size={14} strokeWidth={4} />
          </motion.button>
        </div>

        {/* Nope Button - Medium (56px) */}
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
          onClick={onNope} 
          className="w-[56px] h-[56px] flex items-center justify-center rounded-full bg-white text-[#F63A6E] shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-neutral-100/50"
        >
          <X size={24} strokeWidth={6} />
        </motion.button>

        {/* Star Button - Big (76px) */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onStar} 
            className="w-[76px] h-[76px] flex items-center justify-center rounded-full bg-white text-[#29B3F0] shadow-[0_15px_30px_rgba(41,179,240,0.2)] border border-neutral-100/50"
          >
            <Star size={38} strokeWidth={0} fill="currentColor" className="drop-shadow-sm" />
          </motion.button>
        </div>

        {/* Like Button - Medium (56px) */}
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
          onClick={onLike} 
          className="w-[56px] h-[56px] flex items-center justify-center rounded-full bg-white text-[#15D491] shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-neutral-100/50"
        >
          <Heart size={28} strokeWidth={0} fill="currentColor" />
        </motion.button>

        {/* Share Button - Small (42px) */}
        <motion.button 
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={onShare} 
          className="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white text-[#8A56FF] shadow-[0_6px_15px_rgba(0,0,0,0.06)] border border-neutral-100/50"
        >
          <Share2 size={14} strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};
