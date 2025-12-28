
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, PlusCircle, FileText, ChevronDown } from 'lucide-react';
import { CATEGORIES_DATA } from '../data';

export const UploadPage: React.FC = () => {
  const [listingType, setListingType] = useState<'market' | 'service' | 'barter'>('market');
  const [selectedCategory, setSelectedCategory] = useState("Electronics");

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-10 pb-40 px-1">
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">Add Media</h3>
          <span className="text-[9px] font-bold text-neutral-300">Max 4 photos</span>
        </div>
        <div className="grid grid-cols-12 gap-3 aspect-[4/3] w-full">
          <div className="col-span-8 h-full rounded-[2.5rem] border-2 border-dashed border-neutral-100 bg-neutral-50 flex flex-col items-center justify-center gap-3 group hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-indigo-600 transition-all">
              <Camera size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300 group-hover:text-indigo-600">Primary Photo</span>
          </div>
          <div className="col-span-4 flex flex-col gap-3 h-full">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 rounded-[1.8rem] border-2 border-dashed border-neutral-100 bg-neutral-50 flex items-center justify-center text-neutral-200 hover:border-indigo-300 transition-all cursor-pointer">
                <ImageIcon size={20} />
              </div>
            ))}
          </div>
        </div>
        <button className="w-16 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-lg"><PlusCircle size={18} /></button>
      </section>

      <section className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">Drop Details</h3>
        <div className="bg-neutral-50 p-1.5 rounded-3xl flex items-center gap-1 border border-neutral-100 shadow-inner">
          {(['market', 'service', 'barter'] as const).map((type) => (
            <button
              key={type} onClick={() => setListingType(type)}
              className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${listingType === type ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-400'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="relative">
          <input type="text" placeholder="What are you listing?" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-5 text-sm font-black focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-neutral-300" />
          <FileText size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-200" />
        </div>
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES_DATA.filter(c => c.name !== "All").map((cat) => (
              <button
                key={cat.name} onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.name ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-400 border border-neutral-100'}`}
              >
                <cat.icon size={12} /> {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 font-black text-sm">₦</span>
            <input type="text" placeholder="Price" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pl-10 pr-6 py-5 text-sm font-black focus:outline-none focus:border-indigo-600 focus:bg-white transition-all" />
          </div>
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-5 flex items-center justify-between text-neutral-300 cursor-pointer">
            <span className="text-xs font-black uppercase tracking-widest">Fixed Price</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </section>
      <button className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">Live Drop</button>
    </motion.div>
  );
};
