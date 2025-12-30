
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, X, Star, Heart, Share2 } from 'lucide-react';

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
  return (
    <div className="flex justify-center w-full pointer-events-none">
      <div className="flex items-center justify-center gap-2 pointer-events-auto">
        
        {/* Undo */}
        <motion.button 
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={onUndo} 
          className={`w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white text-[#EFC47D] shadow-2xl border border-neutral-100 ${!canUndo ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <RotateCcw size={14} strokeWidth={4} />
        </motion.button>

        {/* Nope */}
        <motion.button 
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
          onClick={onNope} 
          className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-white text-[#F5497B] shadow-2xl border border-neutral-100"
        >
          <X size={24} strokeWidth={5} />
        </motion.button>

        {/* Super */}
        <motion.button 
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
          onClick={onStar} 
          className="w-[66px] h-[66px] flex items-center justify-center rounded-full bg-white text-[#2DB3F2] shadow-[0_12px_30px_rgba(45,179,242,0.3)] border border-neutral-100 relative overflow-hidden"
        >
          <Star size={34} strokeWidth={0} fill="currentColor" />
          <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-10 rounded-full" />
        </motion.button>

        {/* Like */}
        <motion.button 
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
          onClick={onLike} 
          className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-white text-[#26E09E] shadow-2xl border border-neutral-100"
        >
          <Heart size={26} strokeWidth={0} fill="currentColor" />
        </motion.button>

        {/* Share */}
        <motion.button 
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={onShare} 
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white text-[#9260FF] shadow-2xl border border-neutral-100"
        >
          <Share2 size={16} strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};
