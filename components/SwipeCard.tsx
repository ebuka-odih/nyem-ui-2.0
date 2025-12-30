import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { MapPin, Info } from 'lucide-react';
import { Product } from '../types';

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
  
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

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
      const stackOffset = Math.min(index * 8, 16);
      const stackScale = 1 - Math.min(index * 0.04, 0.08);
      controls.start({ 
        scale: stackScale, 
        y: stackOffset, 
        x: 0, 
        opacity: index > 2 ? 0 : 1 - (index * 0.15),
        transition: { type: 'spring', stiffness: 300, damping: 30 } 
      });
    }
  }, [isTop, index, triggerDirection, controls, onSwipe]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) return;
    if (info.offset.x > 120) controls.start({ x: 800, opacity: 0 }).then(() => onSwipe('right'));
    else if (info.offset.x < -120) controls.start({ x: -800, opacity: 0 }).then(() => onSwipe('left'));
    else if (info.offset.y < -120) controls.start({ y: -1200, opacity: 0 }).then(() => onSwipe('up'));
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
      whileTap={isTop ? { scale: 0.99 } : {}}
      className={`touch-none ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <div 
        className="relative w-full h-full bg-black rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden border border-white/5" 
        onClick={handleImageNav}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={product.images[currentImageIndex]} 
            initial={{ opacity: 0.9 }} animate={{ opacity: 1 }} exit={{ opacity: 0.9 }}
            src={product.images[currentImageIndex]} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
          />
        </AnimatePresence>
        
        {/* Story Indicators */}
        <div className="absolute top-3 left-4 right-4 flex gap-1 z-[60]">
          {product.images.map((_, i) => (
            <div key={i} className={`h-[2px] flex-1 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>

        {/* Info Button */}
        <div className="absolute top-6 right-4 z-[70]">
          <button 
            onClick={(e) => { e.stopPropagation(); onShowDetail(product); }}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 active:scale-90 flex items-center justify-center transition-all shadow-lg"
          >
            <Info size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dark Gradient Bottom - Deepened for control clarity */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
        
        {/* Content Overlay - Reduced pb to bring content closer to buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-24 text-white pointer-events-none">
          {/* Vendor Section */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <img src={product.vendor.avatar} className="w-10 h-10 rounded-full border-2 border-white/40 object-cover shadow-lg" />
            <div className="flex flex-col">
              <span className="text-[13px] font-black uppercase italic tracking-tight drop-shadow-md">{product.vendor.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="px-1.5 py-0.5 bg-white/20 rounded text-[8px] font-black uppercase tracking-widest">{product.distance}</span>
                 <span className="text-[9px] font-bold flex items-center gap-1 opacity-90 drop-shadow-sm"><MapPin size={10} /> {product.vendor.location}</span>
              </div>
            </div>
          </div>

          {/* Product Title - Reduced size from text-3xl to text-2xl */}
          <h2 className="text-2xl font-black leading-[0.95] tracking-tighter uppercase italic mb-3 drop-shadow-2xl max-w-[95%]">
            {product.name}
          </h2>

          <div className="flex items-center justify-between pointer-events-none">
            {/* Category Tag */}
            <div className="px-2.5 py-1 bg-neutral-800/80 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-neutral-200">
              {product.category}
            </div>
            
            {/* Glow Price Tag */}
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full" />
              <div className="relative bg-neutral-900/90 px-3.5 py-2 rounded-xl border border-white/10 text-emerald-400 text-base font-black tracking-tighter shadow-2xl">
                {product.price}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};