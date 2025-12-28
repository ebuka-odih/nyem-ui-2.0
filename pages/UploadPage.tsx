
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Plus, ChevronDown, X, Check, ShieldCheck } from 'lucide-react';
import { CATEGORIES_DATA } from '../data';

export const UploadPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [showConditionList, setShowConditionList] = useState(false);
  const [priceType, setPriceType] = useState("Fixed");
  const [showPriceTypeDropdown, setShowPriceTypeDropdown] = useState(false);

  // Mock function to "add" a photo
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

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const priceTypes = ["Fixed", "Negotiable"];
  const conditions = ["New", "Likely New", "Used"];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-2xl mx-auto flex flex-col gap-8 pb-40 px-2"
    >
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Upload Item</h1>
        <p className="text-sm font-medium text-neutral-400">What would you like to sell?</p>
      </div>

      {/* Photos Section */}
      <div className="space-y-4">
        <label className="block text-[13px] font-black text-neutral-900 uppercase tracking-wide">
          Photos (Select from Gallery)
        </label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
              <img src={img} className="w-full h-full object-cover" alt={`Upload ${idx}`} />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full backdrop-blur-sm"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          {images.length < 4 && (
            <button 
              onClick={addPhoto}
              className="w-28 h-28 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center gap-1.5 text-neutral-400 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all active:scale-95"
            >
              <div className="p-2 bg-white rounded-xl shadow-sm border border-neutral-100">
                <ImageIcon size={20} className="text-neutral-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Add Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-[13px] font-black text-neutral-900 uppercase tracking-wide">
            Title *
          </label>
          <input 
            type="text" 
            placeholder="e.g., iPhone 13 Pro" 
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 text-base font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-300"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-[13px] font-black text-neutral-900 uppercase tracking-wide">
            Description
          </label>
          <textarea 
            placeholder="Describe your item..." 
            rows={4}
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 text-base font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2 relative">
            <label className="block text-[13px] font-black text-neutral-900 uppercase tracking-wide">
              Category *
            </label>
            <button 
              onClick={() => { setShowCategoryList(!showCategoryList); setShowConditionList(false); }}
              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 flex items-center justify-between text-left transition-all hover:border-neutral-300"
            >
              <span className={`text-base font-medium truncate ${selectedCategory ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {selectedCategory || "Select category"}
              </span>
              <ChevronDown size={20} className={`text-neutral-300 transition-transform flex-shrink-0 ${showCategoryList ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showCategoryList && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 grid grid-cols-1 gap-1"
                >
                  {CATEGORIES_DATA.filter(c => c.name !== "All").map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setShowCategoryList(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                    >
                      <cat.icon size={16} className="text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-800">{cat.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Condition */}
          <div className="space-y-2 relative">
            <label className="block text-[13px] font-black text-neutral-900 uppercase tracking-wide">
              Condition *
            </label>
            <button 
              onClick={() => { setShowConditionList(!showConditionList); setShowCategoryList(false); }}
              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 flex items-center justify-between text-left transition-all hover:border-neutral-300"
            >
              <span className={`text-base font-medium truncate ${selectedCondition ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {selectedCondition || "Select condition"}
              </span>
              <ChevronDown size={20} className={`text-neutral-300 transition-transform flex-shrink-0 ${showConditionList ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showConditionList && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-2xl shadow-2xl p-2 grid grid-cols-1 gap-1"
                >
                  {conditions.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => {
                        setSelectedCondition(cond);
                        setShowConditionList(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                    >
                      <ShieldCheck size={16} className="text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-800">{cond}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-[13px] font-black text-neutral-900 uppercase tracking-wide">
            Price *
          </label>
          <div className="flex gap-3 relative">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-900 font-black text-base">₦</span>
              <input 
                type="text" 
                placeholder="0.00" 
                className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-4 text-base font-black text-neutral-900 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-200" 
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowPriceTypeDropdown(!showPriceTypeDropdown)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-4 flex items-center justify-between text-neutral-900 min-w-[145px] transition-colors hover:bg-neutral-100"
              >
                <span className="text-[11px] font-black uppercase tracking-widest">{priceType}</span>
                <ChevronDown size={16} className={`text-neutral-400 transition-transform ${showPriceTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showPriceTypeDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 top-full right-0 mt-2 bg-white border border-neutral-100 rounded-xl shadow-2xl p-1.5 min-w-[145px] space-y-1"
                  >
                    {priceTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setPriceType(type);
                          setShowPriceTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${priceType === type ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-neutral-50 text-neutral-700'}`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                        {priceType === type && <Check size={14} strokeWidth={3} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-[0.98] transition-all">
          Live Drop
        </button>
      </div>
    </motion.div>
  );
};
