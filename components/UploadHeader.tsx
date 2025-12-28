
import React from 'react';
import { History } from 'lucide-react';

export const UploadHeader: React.FC = () => (
  <header className="shrink-0 z-[100] bg-white py-6 px-6">
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase leading-none italic">Post A Drop</h1>
        <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mt-1.5">Create your marketplace entry</p>
      </div>
      <button className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 hover:text-neutral-900 transition-all flex items-center gap-2 border border-neutral-100">
        <History size={18} strokeWidth={2.5} />
        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Drafts</span>
      </button>
    </div>
  </header>
);
