
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { MapPin, Info } from 'lucide-react';
import { Product } from '../types';
import { ActionTooltip } from './ActionTooltip';

interface SwipeCardProps {
  product: Product;
  onSwipe: (dir: 'left' | 'right' | 'up') => void;
  isTop: boolean;
  index: number;
  triggerDirection: 'left' | 'right' | 'up' | null;
  onShowDetail: (product: Product) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ 
  product, 
  onSwipe, 
  isTop,
  index,
  triggerDirection,
  onShowDetail
}) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  useEffect(() => {
    if (isTop) {
      if (triggerDirection) {
        if (triggerDirection === 'right') controls.start({ x: 800, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('right'));
        else if (triggerDirection === 'left') controls.start({ x: -800, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('left'));
        else if (triggerDirection === 'up') controls.start({ y: -1200, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('up'));
      } else {
        controls.start({ scale: 1, y: 0, x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      }
    } else {
      const stackOffset = Math.min(index * 12, 24);
      const stackScale = 1 - Math.min(index * 0.05, 0.1);
      controls.start({ 
        scale: stackScale, 
        y: stackOffset, 
        x: 0, 
        opacity: index > 2 ? 0 : 1 - (index * 0.3),
        transition: { type: 'spring', stiffness: 300, damping: 30 } 
      });
    }
  }, [isTop, index, triggerDirection, controls, onSwipe]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) return;
    if (info.offset.x > 150) controls.start({ x: 800, opacity: 0 }).then(() => onSwipe('right'));
    else if (info.offset.x < -150) controls.start({ x: -800, opacity: 0 }).then(() => onSwipe('left'));
    else if (info.offset.y < -150) controls.start({ y: -1200, opacity: 0 }).then(() => onSwipe('up'));
    else controls.start({ x: 0, y: 0, rotate: 0 });
  };

  const handleImageNav = (e: React.MouseEvent) => {
    if (!isTop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    if (xPos < rect.width / 2) setCurrentImageIndex(prev => Math.max(0, prev - 1));
    else setCurrentImageIndex(prev => Math.min(product.images.length - 1, prev + 1));
  };

  return (
    <motion.div
      animate={controls}
      style={{ x, y, rotate, zIndex: isTop ? 50 : 50 - index, position: 'absolute', width: '100%', height: '100%' }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { scale: 0.98 } : {}}
      className={`touch-none ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <div className="relative w-full h-full bg-black rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-neutral-100/10" onClick={handleImageNav}>
        <AnimatePresence mode="wait">
          <motion.img 
            key={product.images[currentImageIndex]} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} exit={{ opacity: 0.8 }}
            src={product.images[currentImageIndex]} className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
          />
        </AnimatePresence>
        
        {/* Top Indicators */}
        <div className="absolute top-4 left-5 right-5 flex gap-1 z-[60]">
          {product.images.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i === currentImageIndex ? 'bg-white shadow-sm' : 'bg-white/30'}`} />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
        
        {/* Info Overlay - Reduced bottom padding to push content closer to the edge */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-5 text-white pointer-events-none">
          {/* Vendor Info (Top) */}
          <div className="flex items-center gap-2.5 mb-3 drop-shadow-lg">
            <img src={product.vendor.avatar} className="w-10 h-10 rounded-full border-2 border-white/20 object-cover shadow-lg" />
            <div className="flex flex-col">
              <span className="text-base font-black text-white leading-tight tracking-tight">{product.vendor.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-md text-[9px] font-black tracking-widest uppercase border border-white/10">{product.distance}</span>
                <span className="text-[10px] text-white/90 flex items-center gap-1 font-bold"><MapPin size={11} /> {product.vendor.location}</span>
              </div>
            </div>
          </div>

          {/* Product Info & Price Row */}
          <div className="flex justify-between items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <h2 className="text-3xl sm:text-4xl font-black leading-[0.85] tracking-tighter drop-shadow-2xl">
                {product.name}
              </h2>
              <div className="inline-block px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em]">
                {product.category}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-xl font-black text-indigo-400 bg-black/80 px-4 py-2 rounded-xl backdrop-blur-xl border border-white/10 tracking-tighter shadow-2xl">
                {product.price}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Detail Button */}
        <div className="absolute top-10 right-5 z-[70]">
          <ActionTooltip label="Show Details" isVisible={showInfoTooltip} offset={-45} />
          <button 
            onClick={(e) => { e.stopPropagation(); onShowDetail(product); }}
            onMouseEnter={() => isTop && setShowInfoTooltip(true)} onMouseLeave={() => setShowInfoTooltip(false)}
            className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/10 active:scale-90 shadow-2xl pointer-events-auto"
          >
            <Info size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
