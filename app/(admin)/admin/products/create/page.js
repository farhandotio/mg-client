'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, resetProductState } from '@/store/features/productSlice';
import { fetchCategories } from '@/store/features/categorySlice';
import { fetchBrands } from '@/store/features/brandSlice';
import { toast } from 'react-hot-toast';
import {
  X,
  Plus,
  Image as ImageIcon,
  Trash2,
  Zap,
  LayoutDashboard,
  Box,
  Settings2,
  BarChart3,
  Check,
  ChevronRight,
  Fingerprint,
  Cpu,
} from 'lucide-react';
import Button from '@/components/Button';

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const { btnLoading, success, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands.brands);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: { base: '' },
    offer: { percentage: 0, deadline: '' },
    stock: 1,
    category: '',
    brand: '',
    sku: '',
    productType: 'Regular',
    status: 'Published',
    tags: '',
    specifications: [{ key: '', value: '' }],
    images: [],
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const addImageUrl = (e) => {
    const url = e.target.value;
    if (e.key === 'Enter' && url) {
      e.preventDefault();
      if (formData.images.length >= 5) return toast.error('Neural storage limit reached');
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          { url, fileId: `id_${Date.now()}`, isPrimary: prev.images.length === 0 },
        ],
      }));
      e.target.value = '';
      toast.success('Asset Linked');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.brand) return toast.error('Entity Classification Required');
    if (formData.images.length === 0) return toast.error('Visual Identification Required');

    const finalData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      price: { base: Number(formData.price.base) },
      stock: Number(formData.stock),
      offer: {
        percentage: Number(formData.offer.percentage),
        deadline: formData.offer.deadline || null,
      },
    };
    dispatch(createProduct(finalData));
  };

  useEffect(() => {
    if (success) {
      toast.success('System Update: Product Synthesized');
      dispatch(resetProductState());
    }
    if (error) toast.error(error);
  }, [success, error, dispatch]);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto bg-bg min-h-screen text-text selection:bg-primary/20">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary mb-3">
            <div className="p-2 bg-primary/10 rounded-lg animate-pulse">
              <Cpu size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-70">
              Nexus / Production_Terminal
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Forge{' '}
            <span className="text-primary drop-shadow-[0_0_15px_rgba(255,111,92,0.3)]">
              Product
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-card/40 p-4 rounded-2xl border border-border/50 backdrop-blur-md">
          <div className="text-right border-r border-border/50 pr-4">
            <p className="text-[8px] font-black uppercase opacity-40">System_Status</p>
            <p className="text-[10px] font-bold text-primary">CORE_ACTIVE</p>
          </div>
          <Fingerprint size={32} className="text-primary opacity-20" />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section: General Info */}
          <section className="bg-card/40 p-6 md:p-10 rounded-[3rem] border border-border/80 shadow-xl backdrop-blur-sm relative overflow-hidden transition-all hover:border-primary/20">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 pointer-events-none">
              <LayoutDashboard size={250} />
            </div>

            <SectionHeader icon={<LayoutDashboard size={20} />} title="Neural_Data_Entry" />

            <div className="grid gap-6 relative z-10">
              <CustomInput
                label="Product Identification (Title)*"
                placeholder="Ex: Cyber-Link V3 Pro"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <CustomInput
                label="Encrypted Signal (Short Description)"
                placeholder="Brief technical summary..."
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-pText/60 ml-3">
                  Deep_Analysis_Protocol (Full Description)*
                </label>
                <textarea
                  className="w-full border border-border rounded-[2rem] p-6 h-56 bg-bg/50 focus:border-primary outline-none transition-all font-medium text-sm text-text shadow-inner resize-none"
                  required
                  placeholder="Enter complete product narrative..."
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Section: Classification (Categories & Brands) */}
          <section className="bg-card/40 p-6 md:p-10 rounded-[3rem] border border-border/80 space-y-10">
            <div>
              <SectionHeader icon={<Box size={20} />} title="Entity_Mapping" />
              <div className="flex items-center gap-2 mb-4 px-2">
                <ChevronRight size={12} className="text-primary" />
                <p className="text-[9px] font-black uppercase text-pText/50 tracking-widest">
                  Target_Classification:
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {categories?.map((cat) => (
                  <SelectionCard
                    key={cat._id}
                    item={cat}
                    isSelected={formData.category === cat._id}
                    onClick={() => setFormData({ ...formData, category: cat._id })}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center gap-2 mb-4 px-2">
                <ChevronRight size={12} className="text-primary" />
                <p className="text-[9px] font-black uppercase text-pText/50 tracking-widest">
                  Brand_Partner_Node:
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {brands?.map((brand) => (
                  <SelectionCard
                    key={brand._id}
                    item={brand}
                    isSelected={formData.brand === brand._id}
                    onClick={() => setFormData({ ...formData, brand: brand._id })}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Section: Specifications */}
          <section className="bg-card/40 p-6 md:p-10 rounded-[3rem] border border-border/80">
            <div className="flex justify-between items-center mb-8">
              <SectionHeader icon={<Settings2 size={20} />} title="Technical_Matrix" />
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    specifications: [...formData.specifications, { key: '', value: '' }],
                  })
                }
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20"
              >
                <Plus size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Add_Spec</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-bg/40 rounded-2xl border border-border/50 group animate-in slide-in-from-left duration-300"
                >
                  <input
                    placeholder="Field Name"
                    className="flex-1 bg-card border border-border rounded-xl p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-primary shadow-inner"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].key = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <input
                    placeholder="Value Data"
                    className="flex-1 bg-card border border-border rounded-xl p-4 text-xs font-bold outline-none focus:border-primary shadow-inner text-primary"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].value = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        specifications: formData.specifications.filter((_, i) => i !== index),
                      })
                    }
                    className="sm:self-center p-3 text-pText/20 hover:text-primary transition-colors bg-card sm:bg-transparent rounded-xl border border-border sm:border-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Controls & Assets */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-10">
          {/* Price & Stock */}
          <section className="bg-card/40 p-8 rounded-[3rem] border border-border space-y-8 shadow-xl">
            <SectionHeader icon={<BarChart3 size={20} />} title="Commerce_Core" />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Base_Price"
                type="number"
                placeholder="0.00"
                onChange={(e) => setFormData({ ...formData, price: { base: e.target.value } })}
                required
              />
              <CustomInput
                label="Initial_Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <CustomInput
                label="Offer (%)"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    offer: { ...formData.offer, percentage: e.target.value },
                  })
                }
              />
              <CustomInput
                label="Offer_Deadline"
                type="date"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    offer: { ...formData.offer, deadline: e.target.value },
                  })
                }
              />
            </div>
          </section>

          {/* Visual Assets */}
          <section className="bg-bg p-8 rounded-[3rem] border border-border/80 space-y-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ImageIcon size={100} />
            </div>
            <SectionHeader
              icon={<ImageIcon size={20} />}
              title={`Visual_Sync (${formData.images.length}/5)`}
            />

            <div className="relative group">
              <input
                placeholder="Asset URL + Press Enter"
                onKeyDown={addImageUrl}
                disabled={formData.images.length >= 5}
                className="w-full bg-card border border-border rounded-[1.2rem] p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary disabled:opacity-30 transition-all shadow-md pr-12"
              />
              <Plus
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-50 group-hover:scale-125 transition-transform"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border/50 group bg-card shadow-lg"
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    alt="p-preview"
                  />
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: formData.images.filter((_, idx) => idx !== i),
                        })
                      }
                      className="p-2 bg-white text-primary rounded-full shadow-xl active:scale-90 transition-transform"
                    >
                      <X size={16} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="col-span-3 h-40 border-2 border-dashed border-border/40 rounded-[2rem] flex flex-col items-center justify-center text-pText/10 bg-card/20 animate-pulse">
                  <ImageIcon size={40} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Link Visual Source
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Meta & Execution */}
          <section className="bg-card/60 p-8 rounded-[3rem] border-2 border-primary/20 space-y-6 shadow-2xl backdrop-blur-md">
            <SectionHeader icon={<Zap size={20} />} title="System_Registry" />

            <div className="grid gap-6">
              <CustomInput
                label="Neural SKU Identifier"
                placeholder="SKU-XXXX-XXXX"
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-pText/60 ml-3">
                  Market Classification
                </label>
                <select
                  className="w-full bg-bg/80 border border-border rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary text-primary cursor-pointer shadow-inner appearance-none"
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                >
                  {['Regular', 'FlashSale', 'HotDeals', 'Featured', 'BestSeller', 'NewArrival'].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                size="xl"
                disabled={btnLoading}
                className={`w-full py-8 rounded-[2rem] shadow-primary/20 shadow-xl active:scale-95 transition-all font-black text-xs tracking-[0.4em] italic 
                    ${btnLoading ? 'grayscale opacity-50' : 'hover:scale-[1.02]'}`}
                text={btnLoading ? <LoaderSpinner /> : 'Execute_Upload'}
              />
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

// --- Dynamic Sub-components ---

function SelectionCard({ item, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-2 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2 group
      ${
        isSelected
          ? 'bg-primary border-primary shadow-[0_10px_20px_rgba(255,111,92,0.2)] -translate-y-1'
          : 'bg-bg border-border/60 hover:border-primary/40 hover:bg-card/50'
      }`}
    >
      <div
        className={`w-12 h-10 shrink-0 rounded-lg overflow-hidden flex items-center justify-center border transition-all
        ${isSelected ? 'bg-white/20 border-white/30' : 'bg-card border-border shadow-inner'}`}
      >
        {item.image?.url ? (
          <img src={item?.image?.url} className="w-full h-full object-cover" alt={item.name} />
        ) : (
          <Box size={18} className={isSelected ? 'text-white' : 'text-pText/20'} />
        )}
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-tighter text-center leading-tight transition-colors px-1
        ${isSelected ? 'text-white' : 'text-pText/70'}`}
      >
        {item.name}
      </p>

      {isSelected && (
        <div className="absolute top-1 right-1 bg-white text-primary rounded-full p-0.5 shadow-md animate-in zoom-in">
          <Check size={10} strokeWidth={4} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-4 text-primary mb-6">
      <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-md backdrop-blur-sm">
        {icon}
      </div>
      <h2 className="text-xs font-black uppercase tracking-[0.4em] italic">{title}</h2>
    </div>
  );
}

function CustomInput({ label, ...props }) {
  return (
    <div className="space-y-3 flex-1">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-pText/60 ml-3">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-border rounded-2xl p-4 md:p-5 bg-bg/50 focus:border-primary outline-none transition-all font-bold text-xs text-text placeholder:text-pText/10 shadow-inner"
      />
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span className="animate-pulse">Synthesizing...</span>
    </div>
  );
}
