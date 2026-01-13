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
} from 'lucide-react';
import Button from '@/components/Button';

export default function CreateProductPage() {
  const dispatch = useDispatch();

  // Redux States
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
      if (formData.images.length >= 5) return toast.error('Storage full (Max 5 images)');
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          { url, fileId: `id_${Date.now()}`, isPrimary: prev.images.length === 0 },
        ],
      }));
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.brand) return toast.error('Select Category & Brand');
    if (formData.images.length === 0) return toast.error('Add at least one image');

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
      toast.success('Product Entry Synthesized!');
      dispatch(resetProductState());
    }
    if (error) toast.error(error);
  }, [success, error, dispatch]);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto bg-bg min-h-screen text-text animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-12 flex justify-between items-end border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Zap size={18} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Logistics / Terminal
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter">
            Initialize <span className="text-primary">Product</span>
          </h1>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-pText opacity-40 italic">
            v2.0.26_build
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* General Information */}
          <section className="bg-card/40 p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
            <SectionHeader icon={<LayoutDashboard size={18} />} title="Neural_Data" />
            <div className="space-y-4">
              <CustomInput
                label="Identification (Title)*"
                placeholder="Ex: Neural Link G-Series"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <CustomInput
                label="Brief Signal (Short Desc)"
                placeholder="High-speed data relay..."
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">
                  Deep_Core_Analysis (Full Desc)*
                </label>
                <textarea
                  className="w-full border border-border rounded-2xl p-5 h-48 bg-bg focus:border-primary outline-none transition-all font-medium text-sm text-text"
                  required
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Dynamic Selection: Category & Brand */}
          <section className="bg-card/40 p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8">
            <div>
              <SectionHeader icon={<Box size={18} />} title="System_Classification" />
              <p className="text-[9px] font-bold uppercase text-pText mb-4 opacity-60">
                Select Category Entity:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

            <div>
              <p className="text-[9px] font-bold uppercase text-pText mb-4 opacity-60">
                Select Brand Partner:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

          {/* Specifications */}
          <section className="bg-card/40 p-8 rounded-[2.5rem] border border-border">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader icon={<Settings2 size={18} />} title="Technical_Specs" />
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    specifications: [...formData.specifications, { key: '', value: '' }],
                  })
                }
                className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 group animate-in slide-in-from-left-2">
                  <input
                    placeholder="Attribute"
                    className="flex-1 bg-bg border border-border rounded-xl p-3 text-xs outline-none focus:border-primary font-bold"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].key = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <input
                    placeholder="Value"
                    className="flex-1 bg-bg border border-border rounded-xl p-3 text-xs outline-none focus:border-primary font-bold"
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
                    className="p-3 text-pText/40 hover:text-primary transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-card/40 p-8 rounded-[2.5rem] border border-border space-y-6 shadow-sm">
            <SectionHeader icon={<BarChart3 size={18} />} title="Commerce_Unit" />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Base Price"
                type="number"
                onChange={(e) => setFormData({ ...formData, price: { base: e.target.value } })}
                required
              />
              <CustomInput
                label="Stock Units"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Offer %"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    offer: { ...formData.offer, percentage: e.target.value },
                  })
                }
              />
              <CustomInput
                label="Deadline"
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

          <section className="bg-bg p-8 rounded-[2.5rem] border border-border space-y-6">
            <SectionHeader
              icon={<ImageIcon size={18} />}
              title={`Assets (${formData.images.length}/5)`}
            />
            <input
              placeholder="Paste URL & Press Enter"
              onKeyDown={addImageUrl}
              disabled={formData.images.length >= 5}
              className="w-full bg-card border border-border rounded-xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary"
            />

            <div className="grid grid-cols-3 gap-3 mt-4">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-border group shadow-inner"
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    alt="product"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="col-span-3 h-32 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-pText/20 bg-card">
                  <ImageIcon size={30} />
                </div>
              )}
            </div>
          </section>

          <section className="bg-card/40 p-8 rounded-[2.5rem] border border-border space-y-5 shadow-sm">
            <SectionHeader icon={<Zap size={18} />} title="Final_Registry" />
            <CustomInput
              label="Neural SKU Code"
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-pText opacity-50 ml-2">
                Market Type
              </label>
              <select
                className="w-full bg-bg border border-border rounded-xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary text-text cursor-pointer"
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

            <Button
              type="submit"
              disabled={btnLoading}
              className="w-full active:scale-95 transition-transform"
              text={btnLoading ? 'Synthesizing...' : 'Execute_Upload'}
            />
          </section>
        </div>
      </form>
    </div>
  );
}

// --- Sub-components ---

function SelectionCard({ item, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-2 rounded-2xl border transition-all cursor-pointer overflow-hidden flex items-center gap-2 group hover:shadow-md
      ${isSelected ? 'bg-primary border-primary' : 'bg-bg border-border hover:border-primary/50'}`}
    >
      <div className="w-9 h-7 shrink-0 rounded-lg overflow-hidden bg-card flex items-center justify-center border border-border/20 shadow-inner">
        {item.image?.url ? (
          <img src={item.image.url} className="w-full h-full object-cover" />
        ) : (
          <Box size={16} className="text-pText/30" />
        )}
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-tighter text-center leading-none
      ${isSelected ? 'text-white' : 'text-pText'}`}
      >
        {item.name}
      </p>

      {isSelected && (
        <div className="absolute -top-1 -right-1 bg-white text-primary rounded-full p-0.5 shadow-sm">
          <Check size={10} strokeWidth={4} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 text-primary mb-4">
      <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shadow-sm">
        {icon}
      </div>
      <h2 className="text-xs font-black uppercase tracking-[0.3em]">{title}</h2>
    </div>
  );
}

function CustomInput({ label, ...props }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-pText opacity-50 ml-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-border rounded-xl p-3.5 bg-bg focus:border-primary outline-none transition-all font-bold text-xs text-text placeholder:text-pText/20 shadow-inner"
      />
    </div>
  );
}
