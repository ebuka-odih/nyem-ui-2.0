
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, MapPin, Zap, ChevronDown } from 'lucide-react';

interface DiscoverHeaderProps {
  onFilter: () => void;
  onLocation: () => void;
  onWishlist: () => void;
  activeCategory: string;
  setActiveTab: (t: any) => void;
  activeTab: string;
  wishlistCount: number;
}

export const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({ 
  onFilter, onLocation, onWishlist, activeCategory, setActiveTab, activeTab, wishlistCount 
}) => (
  <header className="shrink-0 z-[100] bg-white py-3 px-4 sm:px-6">
    <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-2xl mx-auto">
      <button onClick={onFilter} className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl active:scale-95 transition-all flex-shrink-0 ${activeCategory !== "All" ? 'bg-indigo-600 text-white shadow-lg' : 'bg-neutral-100 text-neutral-500'}`}>
        <Filter size={20} />
      </button>

      <div className="flex-1 bg-neutral-100 p-1 rounded-xl sm:rounded-2xl flex relative overflow-hidden h-10 sm:h-12 min-w-0">
        {(['marketplace', 'services', 'barter'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`relative z-10 flex-1 flex items-center justify-center text-[10px] sm:text-[13px] font-bold transition-all duration-300 capitalize px-1 truncate ${activeTab === tab ? 'text-neutral-900' : 'text-neutral-400'}`}>
            <span className="truncate">{tab}</span>
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-lg sm:rounded-xl shadow-sm -z-10" transition={{ type: "spring", duration: 0.5, bounce: 0.2 }} />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button onClick={onLocation} className="p-2 sm:p-3 bg-neutral-100 rounded-xl sm:rounded-2xl text-[#8B2344] active:scale-95 transition-all flex items-center gap-1">
          <MapPin size={20} />
          <ChevronDown size={14} className="hidden sm:block opacity-40" />
        </button>
        <button onClick={onWishlist} className="relative p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center active:scale-95 transition-all">
          <Zap size={20} className="text-neutral-800" fill="currentColor" strokeWidth={1} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-white">{wishlistCount}</span>
          )}
        </button>
      </div>
    </div>
  </header>
);
