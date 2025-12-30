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
      style={{ x, y, rotate, zIndex: isTop ? 50 : 50 - index, position: 'absolute', width: '100%', height: '100%', willChange: 'transform' }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { scale: 0.99 } : {}}
      className={`touch-none ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <div 
        className="relative w-full h-full bg-black rounded-[2.2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10 isolate" 
        style={{ transform: 'translateZ(0)' }}
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
        <div className="absolute top-3 left-4 right-4 flex gap-1.5 z-[60]">
          {product.images.map((_, i) => (
            <div key={i} className={`h-[2px] flex-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-white/30'}`} />
          ))}
        </div>

        {/* Info Button */}
        <div className="absolute top-6 right-4 z-[70]">
          <button 
            onClick={(e) => { e.stopPropagation(); onShowDetail(product); }}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 active:scale-90 flex items-center justify-center transition-all shadow-2xl"
          >
            <Info size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dark Gradient Bottom - Deepened for control clarity */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-[65]" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 text-white pointer-events-none z-[70]">
          {/* Vendor Section */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="relative">
              <img src={product.vendor.avatar} className="w-11 h-11 rounded-full border-2 border-white/30 object-cover shadow-2xl" />
              {product.vendor.verified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black uppercase italic tracking-tight drop-shadow-lg">{product.vendor.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="px-1.5 py-0.5 bg-white/10 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/5">{product.distance}</span>
                 <span className="text-[9px] font-bold flex items-center gap-1 opacity-80 drop-shadow-md"><MapPin size={10} className="text-white/60" /> {product.vendor.location}</span>
              </div>
            </div>
          </div>

          {/* Product Title */}
          <h2 className="text-[22px] font-black leading-[0.9] tracking-tighter uppercase italic mb-4 drop-shadow-2xl max-w-[90%]">
            {product.name}
          </h2>

          <div className="flex items-center justify-between pointer-events-none">
            {/* Category Tag */}
            <div className="px-3 py-1.5 bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.25em] text-neutral-200 shadow-sm">
              {product.category}
            </div>
            
            {/* Refined Price Tag */}
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-40" />
              <div className="relative bg-neutral-950/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 text-emerald-400 text-[15px] font-black tracking-tight shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                {product.price}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
