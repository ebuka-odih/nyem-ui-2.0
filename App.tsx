
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, PlusCircle, MessageSquare, User, RotateCcw, CheckCircle2, Share2, Globe, MapPin, Check, ChevronRight, Zap, Trash2, Heart, Settings } from 'lucide-react';
import { Product } from './types';
import { PRODUCTS, CATEGORIES_DATA, NIGERIA_CITIES } from './data';
import { DiscoverHeader } from './components/DiscoverHeader';
import { UploadHeader } from './components/UploadHeader';
import { SwipeCard } from './components/SwipeCard';
import { SwipeControls } from './components/SwipeControls';
import { Modal } from './components/Modal';
import { UploadPage } from './pages/UploadPage';
import { MatchesPage } from './pages/MatchesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonState } from './components/ComingSoonState';

export const App = () => {
  const [items, setItems] = useState<Product[]>(PRODUCTS);
  const [history, setHistory] = useState<Product[]>([]);
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [triggerDir, setTriggerDir] = useState<'left' | 'right' | 'up' | null>(null);
  const [showSellerToast, setShowSellerToast] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentCity, setCurrentCity] = useState("All Locations");

  const [activeTab, setActiveTab] = useState<'marketplace' | 'services' | 'barter'>('marketplace');
  const [activePage, setActivePage] = useState<'discover' | 'upload' | 'matches' | 'profile'>('discover');

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (activeCategory !== "All") result = result.filter(p => p.category.toUpperCase() === activeCategory.toUpperCase());
    if (currentCity !== "All Locations") result = result.filter(p => p.vendor.location.toLowerCase().includes(currentCity.toLowerCase()));
    return result;
  }, [activeCategory, currentCity]);

  // Sync items when filters change
  useEffect(() => {
    setItems([...filteredProducts]);
    setHistory([]);
  }, [filteredProducts]);

  const activeIndex = items.length - 1;

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    const swipedItem = items[activeIndex];
    if (!swipedItem) return;
    if (direction === 'up') {
      setShowSellerToast(true);
      setTimeout(() => setShowSellerToast(false), 3000);
    }
    if (direction === 'right' || direction === 'up') {
      const enhancedItem = direction === 'up' ? { ...swipedItem, isSuper: true } : swipedItem;
      setLikedItems(prev => prev.find(i => i.id === enhancedItem.id) ? prev : [...prev, enhancedItem]);
    }
    setHistory(prev => [...prev, swipedItem]);
    setItems(prev => prev.slice(0, -1));
    setTriggerDir(null);
  }, [items, activeIndex]);

  const handleShare = async (product: Product | null = null) => {
    const itemToShare = product || items[activeIndex];
    if (!itemToShare) return;
    try { await navigator.share({ title: itemToShare.name, text: 'Check this on Nyem!', url: 'https://nyem.app' }); } catch (err) { alert('Link copied!'); }
  };

  const undoLast = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setItems(prev => [...prev, last]);
    setHistory(prev => prev.slice(0, -1));
    setLikedItems(prev => prev.filter(i => i.id !== last.id));
  };

  const refreshDrops = () => {
    if (activeCategory === "All" && currentCity === "All Locations") {
      setItems([...PRODUCTS]);
      setHistory([]);
    } else {
      setActiveCategory("All");
      setCurrentCity("All Locations");
    }
  };

  const removeFromWishlist = (id: number) => {
    setLikedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="h-screen bg-white flex flex-col font-sans select-none relative overflow-hidden">
      {activePage === 'discover' && (
        <DiscoverHeader 
          onFilter={() => setShowFilterDialog(true)} onLocation={() => setShowLocationDialog(true)}
          onWishlist={() => setShowWishlist(true)} activeCategory={activeCategory}
          setActiveTab={setActiveTab} activeTab={activeTab} wishlistCount={likedItems.length}
        />
      )}
      {activePage === 'upload' && <UploadHeader />}
      {activePage === 'matches' && !isChatOpen && (
        <header className="shrink-0 bg-white py-6 px-6 flex items-center justify-between">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase italic">Inbox</h2>
          <button 
            onClick={() => setShowWishlist(true)}
            className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center active:scale-90 transition-all"
          >
            <Zap size={20} fill="currentColor" />
          </button>
        </header>
      )}
      {activePage === 'profile' && (
        <header className="shrink-0 bg-white py-6 px-6 flex items-center justify-between">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase italic">Profile</h2>
          <button className="p-2.5 bg-neutral-100 rounded-2xl text-neutral-400 active:scale-90 transition-all">
            <Settings size={22} strokeWidth={2.5} />
          </button>
        </header>
      )}

      <div className="flex-1 relative z-10 flex flex-col items-center overflow-y-auto no-scrollbar">
        <main className="w-full max-w-[420px] flex flex-col items-center pt-2 pb-40 px-4 h-full">
          {activePage === 'discover' ? (
            <div className="relative w-full h-[76vh] mb-4">
              <AnimatePresence mode="popLayout">
                {activeTab === 'marketplace' ? (
                  items.length > 0 ? (
                    items.map((product: Product, idx: number) => (
                      <SwipeCard 
                        key={`${product.id}-${items.length}`} product={product} index={activeIndex - idx} isTop={idx === activeIndex}
                        onSwipe={handleSwipe} triggerDirection={idx === activeIndex ? triggerDir : null}
                        onShowDetail={setSelectedProduct}
                      />
                    ))
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center px-8">
                      <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100 shadow-inner">
                        <RotateCcw size={32} className="text-neutral-300" />
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter">End of the line</h3>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mt-2 mb-8">No more drops to show right now</p>
                      <button 
                        onClick={refreshDrops} 
                        className="px-10 py-5 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all"
                      >
                        Refresh Drops
                      </button>
                    </motion.div>
                  )
                ) : (
                  <ComingSoonState type={activeTab === 'services' ? 'services' : 'barter'} />
                )}
              </AnimatePresence>
              
              {activePage === 'discover' && activeTab === 'marketplace' && items.length > 0 && (
                <div className="absolute -bottom-28 left-0 right-0 z-[110]">
                  <SwipeControls 
                    onUndo={undoLast} onNope={() => setTriggerDir('left')}
                    onStar={() => setTriggerDir('up')} onLike={() => setTriggerDir('right')}
                    onShare={handleShare} canUndo={history.length > 0}
                  />
                </div>
              )}
            </div>
          ) : activePage === 'upload' ? (
            <UploadPage />
          ) : activePage === 'matches' ? (
            <MatchesPage onChatToggle={setIsChatOpen} />
          ) : (
            <ProfilePage />
          )}
        </main>
      </div>

      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Specifications" fullHeight>
        {selectedProduct && (
          <div className="flex flex-col gap-6">
            <div className="aspect-video rounded-3xl overflow-hidden border border-neutral-100"><img src={selectedProduct.images[0]} className="w-full h-full object-cover" /></div>
            <div className="px-1">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{selectedProduct.category}</span>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tighter mt-1">{selectedProduct.name}</h2>
              <p className="text-xl font-black text-[#15D491] mt-1.5">{selectedProduct.price}</p>
              <p className="text-neutral-500 text-sm font-medium mt-4 leading-relaxed">{selectedProduct.longDescription}</p>
            </div>
            <button className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] mt-4 shadow-xl">Start Chat</button>
          </div>
        )}
      </Modal>

      <Modal isOpen={showWishlist} onClose={() => setShowWishlist(false)} title="Your Wishlist" fullHeight>
        <div className="space-y-4">
          {likedItems.length > 0 ? (
            likedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 group">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200">
                  <img src={item.images[0]} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {item.isSuper && <Zap size={10} className="text-[#29B3F0]" fill="currentColor" />}
                    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h4 className="text-sm font-black text-neutral-900 truncate tracking-tight">{item.name}</h4>
                  <p className="text-xs font-black text-[#15D491] mt-0.5">{item.price}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => { setSelectedProduct(item); setShowWishlist(false); }}
                      className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1"
                    >
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                </div>
                <button className="p-3 bg-white rounded-xl shadow-sm border border-neutral-100 text-neutral-900 active:scale-90 transition-all">
                  <MessageSquare size={18} strokeWidth={2.5} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                <Heart size={32} className="text-neutral-200" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-neutral-900 uppercase tracking-tighter">No items yet</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Swipe right on items you want to buy!</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={showFilterDialog} onClose={() => setShowFilterDialog(false)} title="DISCOVERY FILTER">
        <div className="space-y-2">
          {CATEGORIES_DATA.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.name;
            return (
              <button key={cat.name} onClick={() => { setActiveCategory(cat.name); setShowFilterDialog(false); }} className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border-2 active:scale-[0.98] ${isSelected ? 'bg-indigo-600 border-indigo-600 shadow-md text-white' : 'bg-white border-neutral-50 hover:border-neutral-100'}`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-50 text-neutral-400'}`}><Icon size={20} /></div>
                  <div className="text-left">
                    <h4 className={`text-base font-black tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-neutral-900'}`}>{cat.name}</h4>
                    <p className={`text-[8px] font-black uppercase tracking-[0.15em] mt-0.5 ${isSelected ? 'text-white/70' : 'text-neutral-300'}`}>EXPLORE COLLECTION</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">{isSelected ? <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"><Check size={14} strokeWidth={4} className="text-indigo-600" /></div> : <ChevronRight size={18} className="text-neutral-200" />}</div>
              </button>
            );
          })}
        </div>
      </Modal>

      <Modal isOpen={showLocationDialog} onClose={() => setShowLocationDialog(false)} title="SELECT CITY">
        <div className="space-y-2">
          {NIGERIA_CITIES.map(cityObj => {
            const isSelected = currentCity === cityObj.city;
            const isAll = cityObj.city === "All Locations";
            return (
              <button key={cityObj.city} onClick={() => { setCurrentCity(cityObj.city); setShowLocationDialog(false); }} className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border-2 active:scale-[0.98] ${isSelected ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-white border-neutral-50 hover:border-neutral-100'}`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-50 text-neutral-400'}`}>{isAll ? <Globe size={20} /> : <MapPin size={20} />}</div>
                  <div className="text-left">
                    <h4 className={`text-base font-black tracking-tight leading-tight ${isSelected ? 'text-indigo-900' : 'text-neutral-900'}`}>{cityObj.city}</h4>
                    <p className="text-[8px] font-black text-neutral-300 uppercase tracking-[0.15em] mt-0.5">{isAll ? "NATIONWIDE COVERAGE" : "CITY-WIDE SEARCH"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">{isSelected ? <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm"><Check size={14} strokeWidth={4} className="text-white" /></div> : <ChevronRight size={18} className="text-neutral-200" />}</div>
              </button>
            );
          })}
        </div>
      </Modal>

      {!isChatOpen && (
        <nav className="fixed bottom-0 left-0 right-0 z-[120] bg-white border-t border-neutral-100 px-4 py-3 pb-safe flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
          {(['discover', 'upload', 'matches', 'profile'] as const).map((page) => {
            const isActive = activePage === page;
            const icons = { discover: Compass, upload: PlusCircle, matches: MessageSquare, profile: User };
            const Icon = icons[page];
            return (
              <button key={page} onClick={() => setActivePage(page)} className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative min-w-[70px] ${isActive ? 'text-indigo-600' : 'text-neutral-400'}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{page}</span>
                {isActive && <motion.div layoutId="navIndicator" className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </nav>
      )}

      <AnimatePresence>
        {showSellerToast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-neutral-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl flex items-center gap-2.5 z-[200] shadow-xl">
            <CheckCircle2 size={14} className="text-[#29B3F0]" />
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Request Sent</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        body { margin: 0; background-color: #ffffff; overflow: hidden; }
        .touch-none { touch-action: none; }
        ::-webkit-scrollbar { width: 0px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};
