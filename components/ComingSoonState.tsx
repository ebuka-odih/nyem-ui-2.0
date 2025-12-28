
import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Repeat } from 'lucide-react';

export const ComingSoonState: React.FC<{ type: 'services' | 'barter' }> = ({ type }) => {
  const isServices = type === 'services';
  const Icon = isServices ? Layers : Repeat;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 shadow-inner"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-sm border border-neutral-100 relative z-10">
          <Icon size={40} className="text-indigo-600" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 bg-indigo-100 rounded-[2rem] blur-2xl opacity-20 -z-10 scale-125" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
          {isServices ? 'Professional Services' : 'Smart Bartering'}
        </h3>
        <p className="text-neutral-400 text-xs font-black uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
          {isServices 
            ? 'Hire experts or offer your skills. Coming very soon.' 
            : 'Trade items directly with neighbors. Coming very soon.'}
        </p>
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <span className="px-5 py-2.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-100">
          Stay Tuned
        </span>
      </div>
    </motion.div>
  );
};
