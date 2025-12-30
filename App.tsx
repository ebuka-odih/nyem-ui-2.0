import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Compass, 
  PlusCircle, 
  MessageSquare, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  Share2, 
  Globe, 
  MapPin, 
  Check, 
  ChevronRight, 
  Zap, 
  Trash2, 
  Heart, 
  Settings, 
  Sparkles,
  BadgeCheck,
  Star,
  Info
} from 'lucide-react';
import { Product, Vendor } from './types';
import { PRODUCTS, CATEGORIES_DATA, NIGERIA_CITIES } from './data';
import { DiscoverHeader } from './components/DiscoverHeader';
import { UploadHeader } from './components/UploadHeader';
import { SwipeCard } from './components/SwipeCard';
import { SwipeControls } from './components/SwipeControls';
import { Modal } from './components/Modal';
import { UploadPage } from './pages/UploadPage';
import { MatchesPage } from './pages/MatchesPage';
import { ProfilePage } from './pages/ProfilePage';
import { WelcomePage } from './pages/WelcomePage';
import { ComingSoonState } from './components/ComingSoonState';
import { RatingStars } from './components/RatingStars';
import { SellerProfileView } from './components/SellerProfileView';

export const App = () => {
  const [items, setItems] = useState<Product[]>(PRODUCTS);
  const [history, setHistory] = useState<Product[]>([]);
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewingSeller, setViewingSeller] = useState<Vendor | null>(null);
  const [triggerDir, setTriggerDir] = useState<'left' | 'right' | 'up' | null>(null);
  const [showSellerToast, setShowSellerToast] = useState(false);
  const [lastSparkedItem, setLastSparkedItem] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentCity, setCurrentCity] = useState("All Locations");

  const [activeTab, setActiveTab] = useState<'marketplace' | 'services' | 'barter'>('marketplace');
  const [activePage, setActivePage] = useState<'discover' | 'upload' | 'matches' | 'profile'>('discover');
  const [showWelcome, setShowWelcome] = useState(true);
  
  const [forceProfileSettings, setForceProfileSettings] = useState(0);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const sendNativeNotification = (title: string, body: string, icon?: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { 
        body, 
        icon: icon || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=100'
      });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (activeCategory !== "All") result = result.filter(p => p.category.toUpperCase() === activeCategory.toUpperCase());
    if (currentCity !== "All Locations") result = result.filter(p => p.vendor.location.toLowerCase().includes(currentCity.toLowerCase()));
    return result;
  }, [activeCategory, currentCity]);

  useEffect(() => {
    setItems([...filteredProducts]);
    setHistory([]);
  }, [filteredProducts]);

  const activeIndex = items.length - 1;

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    const swipedItem = items[activeIndex];
    if (!swipedItem) return;
    
    if (direction === 'up') {
      setLastSparkedItem(swipedItem);
      setShowSellerToast(true);
      sendNativeNotification(
        "New Super Interest! ⚡️",
        `A buyer is highly interested in your "${swipedItem.name}". Open Nyem to chat!`,
        swipedItem.images[0]
      );
      setTimeout(() => setShowSellerToast(false), 3500);
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
    const itemToShare = product || items[activeIndex] || selectedProduct;
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

  const openSellerProfile = (vendor: Vendor) => {
    setViewingSeller(vendor);
  };

  const handleProfileSettingsClick = () => {
    setForceProfileSettings(prev => prev + 1);
  };

  return (
    <div className="h-screen bg-white flex flex-col font-sans select-none relative overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <WelcomePage onStart={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          {activePage === 'discover' && (
            <DiscoverHeader 
              onFilter={() => setShowFilterDialog(true)} onLocation={() => setShowLocationDialog(true)}
              onWishlist={() => setShowWishlist(true)} activeCategory={activeCategory}
              setActiveTab={setActiveTab} activeTab={activeTab} wishlistCount={likedItems.length}
            />
          )}
          
          {activePage !== 'discover' && (
             <header className="shrink-0 bg-white pt-4 pb-3 px-6 flex flex-col gap-2 border-b border-neutral-50">
                <div className="flex items-center gap-1.5 opacity-60">
                  <div className="w-5 h-5 bg-neutral-900 rounded flex items-center justify-center text-white">
                    <Zap size={10} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-black tracking-tighter uppercase italic text-neutral-900">Nyem</span>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase italic">
                    {activePage === 'upload' ? 'Studio' : activePage === 'matches' ? 'Inbox' : 'Account'}
                  </h2>
                  <button 
                    onClick={activePage === 'profile' ? handleProfileSettingsClick : undefined}
                    className="p-2.5 bg-neutral-100 rounded-2xl text-neutral-400 active:scale-90 transition-all hover:bg-neutral-200 hover:text-neutral-900"
                  >
                    {activePage === 'profile' ? <Settings size={20} strokeWidth={2.5} /> : <Sparkles size={20} strokeWidth={2.5} />}
                  </button>
                </div>
             </header>
          )}

          <div className={`flex-1 relative z-10 no-scrollbar ${activePage === 'discover' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className="flex flex-col items-center w-full h-full">
              {/* pt-0 helps pull content higher up */}
              <main className={`w-full h-full max-w-[420px] relative ${activePage === 'discover' ? 'px-3 pt-0 pb-[42px]' : 'px-4 pt-4 pb-40'}`}>
                {activePage === 'discover' ? (
                  <div className="relative w-full h-full flex flex-col">
                    {/* -mt-1 pushes the label into the gap below the header, saving vertical space for cards */}
                    <div className="flex items-center justify-center gap-2 mb-1.5 -mt-1 shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50/50 rounded-full border border-indigo-100/50">
                        <MapPin size={9} className="text-indigo-600" />
                        <span className="text-[8px] font-black uppercase tracking-[0.15em] text-neutral-900/50">
                          Discovery in <span className="text-indigo-600 italic">{currentCity}</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative flex-1 w-full">
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
                    </div>
                    
                    {activePage === 'discover' && activeTab === 'marketplace' && items.length > 0 && (
                      <div className="absolute bottom-[6px] left-0 right-0 z-[110]">
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
                  <ProfilePage key={`profile-${forceProfileSettings}`} forceSettingsTab={forceProfileSettings > 0} />
                )}
              </main>
            </div>
          </div>

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
        </>
      )}

      {/* Modals and other logic remain unchanged */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Item Details" fullHeight>
        {selectedProduct && (
          <div className="flex flex-col gap-6 pb-20">
            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-2">
              {selectedProduct.images.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-full snap-center aspect-video rounded-3xl overflow-hidden border border-neutral-100 bg-neutral-50 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="px-1 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">{selectedProduct.category}</span>
                <h2 className="text-3xl font-black text-neutral-900 tracking-tighter mt-1 leading-none">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-2xl font-black text-indigo-600 tracking-tighter">{selectedProduct.price}</span>
                  <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded-lg">Negotiable</span>
                </div>
              </div>
              <button 
                onClick={() => handleShare(selectedProduct)}
                className="p-3 bg-neutral-100 rounded-2xl text-neutral-900 active:scale-90 transition-all"
              >
                <Share2 size={20} />
              </button>
            </div>
            <div className="h-px bg-neutral-100 w-full" />
            <div className="px-1">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">The Story</h4>
              <p className="text-neutral-600 text-sm font-medium leading-relaxed">{selectedProduct.longDescription}</p>
            </div>
            <div className="px-1 space-y-4">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Verified Seller</h4>
              <div 
                onClick={() => openSellerProfile(selectedProduct.vendor)}
                className="bg-neutral-50 rounded-[2rem] p-4 flex items-center justify-between border border-neutral-100 cursor-pointer active:scale-[0.98] transition-all hover:bg-neutral-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={selectedProduct.vendor.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    {selectedProduct.vendor.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full text-indigo-600 shadow-sm">
                        <BadgeCheck size={14} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight">{selectedProduct.vendor.name}</h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <RatingStars rating={selectedProduct.vendor.rating} />
                      <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} /> {selectedProduct.vendor.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl text-neutral-400 group-hover:text-neutral-900 transition-colors shadow-sm">
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
              <button className="w-full bg-neutral-900 text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                Start Chat Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!viewingSeller} onClose={() => setViewingSeller(null)} title="Seller Profile" fullHeight showBack onBack={() => setViewingSeller(null)}>
        {viewingSeller && <SellerProfileView vendor={viewingSeller} onClose={() => setViewingSeller(null)} onProductClick={(p) => { setViewingSeller(null); setSelectedProduct(p); }} />}
      </Modal>

      <Modal isOpen={showWishlist} onClose={() => setShowWishlist(false)} title="Your Wishlist" fullHeight>
        <div className="space-y-4 pb-10">
          {likedItems.length > 0 ? likedItems.map((item) => (
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
                <p className="text-xs font-black text-indigo-600 mt-0.5">{item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => { setSelectedProduct(item); setShowWishlist(false); }} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">Details</button>
                  <button onClick={() => removeFromWishlist(item.id)} className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1"><Trash2 size={10} /> Remove</button>
                </div>
              </div>
              <button onClick={() => { setShowWishlist(false); setSelectedProduct(item); }} className="p-3 bg-white rounded-xl shadow-sm border border-neutral-100 text-neutral-900 active:scale-90 transition-all"><MessageSquare size={18} strokeWidth={2.5} /></button>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100"><Heart size={32} className="text-neutral-200" /></div>
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
          {CATEGORIES_DATA.map(cat => (
            <button key={cat.name} onClick={() => { setActiveCategory(cat.name); setShowFilterDialog(false); }} className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border-2 active:scale-[0.98] ${activeCategory === cat.name ? 'bg-indigo-600 border-indigo-600 shadow-md text-white' : 'bg-white border-neutral-50 hover:border-neutral-100'}`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-neutral-50 text-neutral-400'}`}><cat.icon size={20} /></div>
                <div className="text-left">
                  <h4 className={`text-base font-black tracking-tight leading-tight ${activeCategory === cat.name ? 'text-white' : 'text-neutral-900'}`}>{cat.name}</h4>
                  <p className={`text-[8px] font-black uppercase tracking-[0.15em] mt-0.5 ${activeCategory === cat.name ? 'text-white/70' : 'text-neutral-300'}`}>EXPLORE COLLECTION</p>
                </div>
              </div>
              <div className="flex items-center justify-center">{activeCategory === cat.name ? <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"><Check size={14} strokeWidth={4} className="text-indigo-600" /></div> : <ChevronRight size={18} className="text-neutral-200" />}</div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={showLocationDialog} onClose={() => setShowLocationDialog(false)} title="SELECT CITY">
        <div className="space-y-2">
          {NIGERIA_CITIES.map(cityObj => (
            <button key={cityObj.city} onClick={() => { setCurrentCity(cityObj.city); setShowLocationDialog(false); }} className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border-2 active:scale-[0.98] ${currentCity === cityObj.city ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-white border-neutral-50 hover:border-neutral-100'}`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${currentCity === cityObj.city ? 'bg-indigo-600 text-white' : 'bg-neutral-50 text-neutral-400'}`}>{cityObj.city === "All Locations" ? <Globe size={20} /> : <MapPin size={20} />}</div>
                <div className="text-left">
                  <h4 className={`text-base font-black tracking-tight leading-tight ${currentCity === cityObj.city ? 'text-indigo-900' : 'text-neutral-900'}`}>{cityObj.city}</h4>
                  <p className="text-[8px] font-black text-neutral-300 uppercase tracking-[0.15em] mt-0.5">{cityObj.city === "All Locations" ? "NATIONWIDE COVERAGE" : "CITY-WIDE SEARCH"}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">{currentCity === cityObj.city ? <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm"><Check size={14} strokeWidth={4} className="text-white" /></div> : <ChevronRight size={18} className="text-neutral-200" />}</div>
            </button>
          ))}
        </div>
      </Modal>

      <AnimatePresence>
        {showSellerToast && lastSparkedItem && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }} animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }} exit={{ opacity: 0, y: 40, x: '-50%', scale: 0.9 }} className="fixed bottom-36 left-1/2 -translate-x-1/2 w-[85%] max-w-[340px] bg-white/20 backdrop-blur-[40px] px-5 py-4 rounded-[2.5rem] flex items-center gap-4 z-[200] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.12)] border border-white/40 ring-1 ring-black/5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-white/50"><img src={lastSparkedItem.images[0]} className="w-full h-full object-cover" /></div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1"><Zap size={10} className="text-[#29B3F0]" fill="currentColor" /><span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#29B3F0] leading-none">Super Interest Sent!</span></div>
              <span className="text-[11px] font-black uppercase tracking-tight text-neutral-900 truncate">Request sent for {lastSparkedItem.name}</span>
            </div>
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
