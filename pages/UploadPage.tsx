
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronDown, 
  X, 
  Check, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Package, 
  Eye, 
  ArrowLeft, 
  Send, 
  ImageIcon, 
  LayoutGrid, 
  PlusSquare,
  Sparkles,
  Zap,
  Banknote
} from 'lucide-react';
import { CATEGORIES_DATA } from '../data';

const subtleTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 1
};

export const UploadPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collection' | 'new'>('collection');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Form States
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [showConditionList, setShowConditionList] = useState(false);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("Fixed");
  const [showPriceTypeDropdown, setShowPriceTypeDropdown] = useState(false);

  // Mock Active Listings
  const [myListings, setMyListings] = useState([
    {
      id: 1,
      name: "Vintage Film Camera",
      price: "₦115,000",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400",
      status: 'Active',
      views: 124,
      category: 'ELECTRONICS',
      condition: 'Used',
      description: 'Perfectly functional Canon AE-1 with 50mm f/1.8 lens.'
    },
    {
      id: 2,
      name: "Smart Coffee Scale",
      price: "₦42,000",
      image: "https://images.unsplash.com/photo-1544350285-1811bc3bb970?auto=format&fit=crop&q=80&w=400",
      status: 'Under Review',
      views: 12,
      category: 'HOME & DECOR',
      condition: 'New',
      description: 'High precision digital scale for perfect pour-overs.'
    },
    {
      id: 3,
      name: "Minimalist Watch",
      price: "₦85,000",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
      status: 'Active',
      views: 89,
      category: 'ACCESSORIES',
      condition: 'New',
      description: 'Clean design for any occasion.'
    },
    {
      id: 4,
      name: "Studio Headphones",
      price: "₦195,000",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      status: 'Sold',
      views: 245,
      category: 'ELECTRONICS',
      condition: 'Likely New',
      description: 'The best audio experience.'
    }
  ]);

  const addPhoto = () => {
    if (images.length < 4) {
      const mockImages = [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1602143399827-bd95968c471c?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400"
      ];
      setImages([...images, mockImages[images.length]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.name);
    setDesc(item.description);
    setImages([item.image]);
    setSelectedCategory(item.category);
    setSelectedCondition(item.condition);
    setPrice(item.price.replace('₦', '').replace(',', ''));
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingItem(null);
    setTitle("");
    setDesc("");
    setImages([]);
    setSelectedCategory("");
    setSelectedCondition("");
    setPrice("");
    setPriceType("Fixed");
  };

  const handleAction = () => {
    setActiveTab('collection');
    resetForm();
  };

  const deleteListing = (id: number) => {
    setMyListings(prev => prev.filter(l => l.id !== id));
  };

  const priceTypes = ["Fixed", "Negotiable"];
  const conditions = ["New", "Likely New", "Used"];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-2xl mx-auto flex flex-col gap-6 pb-40 px-2"
    >
      {/* Visual Navigation Tabs */}
      <div className="flex bg-neutral-100 p-1 rounded-3xl mb-4">
        <button 
          onClick={() => setActiveTab('collection')}
          className={`relative flex-1 py-3.5 flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'collection' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          <LayoutGrid size={16} strokeWidth={activeTab === 'collection' ? 3 : 2} />
          Your Collection
        </button>
        <button 
          onClick={() => { setActiveTab('new'); if (!editingItem) resetForm(); }}
          className={`relative flex-1 py-3.5 flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'new' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          <PlusSquare size={16} strokeWidth={activeTab === 'new' ? 3 : 2} />
          {editingItem ? 'Edit Drop' : 'New Drop'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'collection' ? (
          <motion.div 
            key="collection-grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={subtleTransition}
            className="grid grid-cols-2 gap-4"
          >
            {/* Direct Upload Shortcut in Grid */}
            <button 
              onClick={() => setActiveTab('new')}
              className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group shadow-sm"
            >
              <div className="p-4 bg-white rounded-3xl shadow-sm border border-neutral-100 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                <Plus size={28} className="text-neutral-400 group-hover:text-indigo-600" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Add New Drop</span>
            </button>

            {myListings.map((item) => (
              <motion.div 
                layout
                key={item.id} 
                className="group relative aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-md border border-neutral-100"
              >
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                
                {/* Visual Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border ${
                    item.status === 'Active' ? 'bg-emerald-500/90 text-white border-white/20' : 
                    item.status === 'Sold' ? 'bg-rose-500/90 text-white border-white/20' : 
                    'bg-neutral-900/90 text-white border-white/20'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Grid Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
                  <div className="text-center mb-2">
                    <h4 className="text-white text-xs font-black uppercase tracking-widest truncate max-w-[120px]">{item.name}</h4>
                    <p className="text-indigo-400 text-[10px] font-black mt-1 tracking-tighter">{item.price}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(item)}
                      className="p-3 bg-white text-neutral-900 rounded-2xl active:scale-90 transition-all shadow-xl"
                    >
                      <Edit3 size={18} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => deleteListing(item.id)}
                      className="p-3 bg-rose-500 text-white rounded-2xl active:scale-90 transition-all shadow-xl"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 flex items-center gap-3 text-white/60 text-[8px] font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1"><Eye size={10} /> {item.views}</span>
                    <span className="flex items-center gap-1"><Zap size={10} /> Nyem</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="new-drop-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={subtleTransition}
            className="space-y-8 px-1"
          >
            {/* Context Header for Edit Mode */}
            {editingItem && (
              <div className="flex items-center justify-between bg-neutral-900 rounded-[2rem] p-5 shadow-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20">
                    <img src={editingItem.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Editing Drop</span>
                    <h4 className="text-white text-xs font-black uppercase truncate max-w-[150px] tracking-tight">{editingItem.name}</h4>
                  </div>
                </div>
                <button onClick={resetForm} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all active:scale-90">
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
            )}

            {/* Media Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <label className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em]">Product Imagery</label>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{images.length}/4 Required</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
                
                {images.length < 4 && (
                  <button 
                    onClick={addPhoto}
                    className="aspect-square rounded-2xl bg-white border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-95 group shadow-sm"
                  >
                    <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                )}

                {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-neutral-50 border border-neutral-100 opacity-40" />
                ))}
              </div>
            </div>

            {/* Structured Form */}
            <div className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Listing Title</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., iPhone 15 Pro Max" 
                  className="w-full bg-white border border-neutral-300 rounded-[1.5rem] px-6 py-5 text-sm font-black text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all shadow-sm placeholder:text-neutral-200"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Description</label>
                <textarea 
                  value={desc} onChange={(e) => setDesc(e.target.value)}
                  placeholder="Tell buyers why they need this..." rows={4}
                  className="w-full bg-white border border-neutral-300 rounded-[1.5rem] px-6 py-5 text-sm font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all shadow-sm placeholder:text-neutral-200 resize-none"
                />
              </div>

              {/* Vertical Stack: Category & Condition */}
              <div className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Category</label>
                  <button 
                    onClick={() => { setShowCategoryList(!showCategoryList); setShowConditionList(false); }}
                    className="w-full bg-white border border-neutral-300 rounded-[1.5rem] px-6 py-5 flex items-center justify-between text-left transition-all hover:bg-neutral-50 shadow-sm"
                  >
                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedCategory ? 'text-neutral-900' : 'text-neutral-300'}`}>
                      {selectedCategory || "Select Category"}
                    </span>
                    <ChevronDown size={18} className={`text-neutral-400 transition-transform ${showCategoryList ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showCategoryList && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-[1.5rem] shadow-2xl max-h-60 overflow-y-auto p-3"
                      >
                        {CATEGORIES_DATA.filter(c => c.name !== "All").map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() => { setSelectedCategory(cat.name); setShowCategoryList(false); }}
                            className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-neutral-50 flex items-center gap-4 transition-colors group"
                          >
                            <div className="p-2 bg-neutral-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <cat.icon size={16} />
                            </div>
                            <span className="text-[10px] font-black text-neutral-800 uppercase tracking-widest">{cat.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Condition</label>
                  <button 
                    onClick={() => { setShowConditionList(!showConditionList); setShowCategoryList(false); }}
                    className="w-full bg-white border border-neutral-300 rounded-[1.5rem] px-6 py-5 flex items-center justify-between text-left transition-all hover:bg-neutral-50 shadow-sm"
                  >
                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedCondition ? 'text-neutral-900' : 'text-neutral-300'}`}>
                      {selectedCondition || "Item Condition"}
                    </span>
                    <ChevronDown size={18} className={`text-neutral-400 transition-transform ${showConditionList ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showConditionList && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-[1.5rem] shadow-2xl p-3"
                      >
                        {conditions.map((cond) => (
                          <button
                            key={cond}
                            onClick={() => { setSelectedCondition(cond); setShowConditionList(false); }}
                            className="w-full text-left px-4 py-4 rounded-xl hover:bg-neutral-50 flex items-center gap-4 transition-colors group"
                          >
                            <div className="p-2 bg-neutral-50 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <ShieldCheck size={16} />
                            </div>
                            <span className="text-[10px] font-black text-neutral-800 uppercase tracking-widest">{cond}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Redesigned Price Field with Integrated Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Asking Price</label>
                <div className="relative group">
                  <div className="flex bg-white border border-neutral-300 rounded-[1.5rem] focus-within:border-neutral-900 focus-within:ring-4 focus-within:ring-neutral-900/5 transition-all overflow-hidden shadow-sm items-stretch h-20">
                    {/* Currency Symbol Section */}
                    <div className="flex items-center justify-center pl-6 pr-4 bg-neutral-50/50 border-r border-neutral-100">
                      <span className="text-neutral-900 font-black text-2xl">₦</span>
                    </div>

                    {/* Numeric Input Area */}
                    <input 
                      type="text" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00" 
                      className="flex-1 bg-transparent border-none px-4 py-0 text-2xl font-black text-neutral-900 focus:ring-0 focus:outline-none placeholder:text-neutral-200" 
                    />

                    {/* Integrated Type Selector */}
                    <div className="relative flex items-center pr-3">
                      <button 
                        onClick={() => setShowPriceTypeDropdown(!showPriceTypeDropdown)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl shadow-md active:scale-95 transition-all"
                      >
                        <div className="flex flex-col items-start pr-1">
                          <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-0.5">TYPE</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] leading-none">{priceType}</span>
                        </div>
                        <ChevronDown size={14} className={`text-white transition-transform duration-300 ${showPriceTypeDropdown ? 'rotate-180' : ''}`} strokeWidth={3} />
                      </button>

                      {/* Perfect Select Dropdown */}
                      <AnimatePresence>
                        {showPriceTypeDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute z-50 bottom-full right-0 mb-3 w-44 bg-neutral-900 text-white border border-white/10 rounded-2xl shadow-2xl p-2.5 overflow-hidden"
                          >
                            <div className="px-2 pt-1 pb-2">
                              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Select Pricing Model</span>
                            </div>
                            {priceTypes.map((type) => (
                              <button
                                key={type}
                                onClick={() => { setPriceType(type); setShowPriceTypeDropdown(false); }}
                                className={`w-full text-left px-4 py-3.5 rounded-xl flex items-center justify-between transition-all group ${priceType === type ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-white/70'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg ${priceType === type ? 'bg-white/20' : 'bg-white/5'}`}>
                                    <Banknote size={14} />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                                </div>
                                {priceType === type && <Check size={14} strokeWidth={4} className="text-white" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleAction}
              className="w-full bg-neutral-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex items-center gap-3 relative z-10">
                {editingItem ? <Sparkles size={16} className="text-indigo-400" /> : <Send size={16} className="text-emerald-400" />}
                {editingItem ? 'Finalize Updates' : 'Publish to Marketplace'}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
