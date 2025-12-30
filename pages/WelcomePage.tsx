import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShoppingBag, 
  Briefcase, 
  RefreshCw, 
  ArrowRight 
} from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 300, damping: 25 } 
  }
};

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const features = [
    {
      title: 'Marketplace',
      desc: 'Buy & sell from local sellers',
      icon: ShoppingBag,
      color: 'bg-rose-50',
      iconColor: 'text-rose-500'
    },
    {
      title: 'Services',
      desc: 'Hire skilled professionals nearby',
      icon: Briefcase,
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Swap',
      desc: 'Trade items — no cash needed',
      icon: RefreshCw,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center px-8 pt-16 pb-12 overflow-y-auto no-scrollbar"
    >
      {/* Branding Section */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-xl">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-4xl font-black tracking-tighter uppercase italic text-neutral-900">Nyem</span>
        </div>
        
        <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase italic leading-[0.85] mb-6">
          Your Local <br /> Marketplace
        </h1>
        
        <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-[260px] leading-relaxed">
          Connect with your community to buy, sell, trade, and hire — all in one app.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="w-full max-w-sm space-y-3 mb-6">
        {features.map((f, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="flex items-center gap-4 p-5 bg-neutral-50 border border-neutral-100 rounded-[2rem] hover:bg-white transition-all group"
          >
            <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center ${f.iconColor} shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
              <f.icon size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-none mb-1">{f.title}</h3>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Section - Removed mt-auto to push it up closer to the list */}
      <motion.div variants={itemVariants} className="w-full max-w-sm space-y-6">
        <button 
          onClick={onStart}
          className="w-full bg-neutral-900 text-white py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Start Exploring
          <ArrowRight size={18} strokeWidth={3} />
        </button>

        <div className="text-center space-y-5">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            Ready to join? <span className="text-indigo-600">Create an account</span>
          </p>
          
          <div className="flex justify-center items-center gap-4 opacity-30">
            <button className="text-[9px] font-black text-neutral-900 uppercase tracking-widest">Terms of Use</button>
            <div className="w-1 h-1 rounded-full bg-neutral-900" />
            <button className="text-[9px] font-black text-neutral-900 uppercase tracking-widest">Privacy Policy</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};