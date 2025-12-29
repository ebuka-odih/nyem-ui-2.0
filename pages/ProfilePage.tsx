
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  ShieldCheck, 
  MapPin, 
  Package, 
  Heart, 
  Star, 
  Wallet, 
  ChevronRight, 
  LogOut, 
  Bell, 
  CreditCard, 
  History,
  ExternalLink,
  Edit3,
  BadgeCheck,
  Zap
} from 'lucide-react';
import { RatingStars } from '../components/RatingStars';

const subtleTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 1
};

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drops' | 'settings'>('drops');

  const stats = [
    { label: 'Deals', value: '24', icon: Package },
    { label: 'Rating', value: '4.9', icon: Star },
    { label: 'Drops', value: '3', icon: Zap },
  ];

  const menuItems = [
    { label: 'Notification Settings', icon: Bell, color: 'text-indigo-600' },
    { label: 'Payment Methods', icon: CreditCard, color: 'text-emerald-600' },
    { label: 'Security & Password', icon: ShieldCheck, color: 'text-neutral-900' },
    { label: 'Trade History', icon: History, color: 'text-neutral-900' },
  ];

  const myDrops = [
    {
      id: 1,
      name: "Nebula Smart Bottle",
      price: "₦48,500",
      image: "https://images.unsplash.com/photo-1602143399827-bd95968c471c?auto=format&fit=crop&q=80&w=200",
      views: 128,
      status: 'Active'
    },
    {
      id: 2,
      name: "Vintage Film Camera",
      price: "₦115,000",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      views: 45,
      status: 'Sold'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={subtleTransition}
      className="w-full max-w-2xl mx-auto flex flex-col pb-40 px-4"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-8 pb-10">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src="https://i.pravatar.cc/300?u=current_user" 
              className="w-full h-full object-cover" 
              alt="Profile"
            />
          </div>
          <button className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-2xl shadow-lg border border-neutral-100 text-neutral-900 active:scale-90 transition-all">
            <Edit3 size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase italic">Alex Thompson</h2>
            <BadgeCheck size={20} className="text-indigo-600" fill="currentColor" />
          </div>
          <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
            <MapPin size={12} /> Victoria Island, Lagos
          </p>
        </div>
      </div>

      {/* Wallet / Escrow Card */}
      <div className="bg-neutral-900 rounded-[2.5rem] p-6 mb-8 shadow-2xl shadow-indigo-100/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Escrow Balance</span>
            </div>
            <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
              Details <ExternalLink size={12} />
            </button>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white tracking-tighter">₦420,500.00</h3>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-neutral-100 rounded-3xl p-4 flex flex-col items-center text-center">
            <stat.icon size={18} className="text-neutral-400 mb-2" />
            <span className="text-lg font-black text-neutral-900 leading-none">{stat.value}</span>
            <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest mt-1.5">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('drops')}
          className={`relative px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'drops' ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white text-neutral-400 border border-neutral-100'}`}
        >
          My Drops
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`relative px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white text-neutral-400 border border-neutral-100'}`}
        >
          Account
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'drops' ? (
          <motion.div 
            key="drops-list"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            {myDrops.map((drop) => (
              <div key={drop.id} className="bg-white border border-neutral-100 rounded-[2rem] p-3 flex items-center gap-4 group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-neutral-100">
                  <img src={drop.image} className="w-full h-full object-cover" alt={drop.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${drop.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}>
                      {drop.status}
                    </span>
                    <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest">{drop.views} Views</span>
                  </div>
                  <h4 className="text-sm font-black text-neutral-900 truncate tracking-tight">{drop.name}</h4>
                  <p className="text-xs font-black text-indigo-600 mt-0.5">{drop.price}</p>
                </div>
                <button className="p-3 text-neutral-300 hover:text-neutral-900 transition-colors">
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </div>
            ))}
            <button className="w-full py-6 border-2 border-dashed border-neutral-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-neutral-300 hover:border-indigo-100 hover:text-indigo-400 transition-all group">
              <Zap size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Post a new drop</span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="settings-list"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-2"
          >
            {menuItems.map((item) => (
              <button 
                key={item.label}
                className="w-full flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-[1.5rem] hover:bg-neutral-50 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 bg-neutral-50 rounded-xl ${item.color}`}>
                    <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-black text-neutral-900 tracking-tight">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-neutral-200" strokeWidth={3} />
              </button>
            ))}
            
            <button className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-[1.5rem] mt-4 hover:bg-rose-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl text-rose-500 shadow-sm">
                  <LogOut size={20} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-rose-600 tracking-tight">Sign Out</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
