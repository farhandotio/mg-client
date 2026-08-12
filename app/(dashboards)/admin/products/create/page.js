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
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { btnLoading, success, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: {
      base: '',
      discounted: '', // এটিই এখন Sell Price হিসেবে কাজ করবে
    },
    deadline: '', // সরাসরি তারিখ
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

    // ব্যাকএন্ড মডেল অনুযায়ী ডাটা ফরম্যাট করা
    const finalData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      price: {
        base: Number(formData.price.base),
        discounted: formData.price.discounted
          ? Number(formData.price.discounted)
          : Number(formData.price.base),
      },
      stock: Number(formData.stock),
      deadline: formData.deadline || null, // সরাসরি পাঠানো হচ্ছে, ব্যাকএন্ড offer.deadline এ সেট করে নিবে
    };

    dispatch(createProduct(finalData));
  };

  useEffect(() => {
    if (success) {
      toast.success('System Update: Product Synthesized');
      dispatch(resetProductState());
      router.push('/admin/products');
    }
    if (error) toast.error(error);
  }, [success, error, dispatch, router]);

  return (
    <div className="bg-bg min-h-screen text-text selection:bg-secondary/20">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-secondary mb-3">
            <div className="p-2 bg-secondary/10 rounded-0 animate-pulse">
              <Cpu size={18} />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-tighter opacity-70">
              Nexus / Production_Terminal
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-medium uppercase italic tracking-tighterer leading-none">
            Forge{' '}
            <span className="text-secondary drop-shadow-[0_0_15px_rgba(255,111,92,0.3)]">
              Product
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-card/40 p-4 rounded-0 border border-border/50 backdrop-blur-md">
          <div className="text-right border-r border-border/50 pr-4">
            <p className="text-[10px] font-medium uppercase opacity-40">System_Status</p>
            <p className="text-[12px] font-medium text-secondary">CORE_ACTIVE</p>
          </div>
          <Fingerprint size={32} className="text-secondary opacity-20" />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-card/40 p-5 rounded-0 border border-border/80 shadow-xl backdrop-blur-sm relative overflow-hidden transition-all hover:border-secondary/20">
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
                <label className="text-[12px] font-medium uppercase tracking-tighter text-pText/60 ml-3">
                  Deep_Analysis_Protocol (Full Description)*
                </label>
                <textarea
                  className="w-full border border-border rounded-0 p-6 h-56 bg-bg/50 focus:border-secondary outline-none transition-all font-medium text-sm text-text shadow-inner resize-none"
                  required
                  placeholder="Enter complete product narrative..."
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="bg-card/40 p-5 rounded-0 border border-border/80 space-y-10">
            <div>
              <SectionHeader icon={<Box size={20} />} title="Entity_Mapping" />
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

          {/* Specifications */}
          <section className="bg-card/40 p-5 rounded-0 border border-border/80">
            <div className="flex justify-between items-center mb-8">
              <SectionHeader icon={<Settings2 size={20} />} title="Specifications" />
              <button
                aria-label="add key value"
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    specifications: [...formData.specifications, { key: '', value: '' }],
                  })
                }
                className="group flex items-center gap-2 px-4 py-2 rounded-0 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all border border-secondary/20"
              >
                <Plus size={16} />
                <span className="text-[12px] hidden md:block font-medium uppercase tracking-tighter">
                  Add_Spec
                </span>
              </button>
            </div>
            <div className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-bg/40 rounded-0 border border-border/50 group animate-in slide-in-from-left duration-300"
                >
                  <input
                    placeholder="Field Name"
                    className="flex-1 bg-card border border-border rounded-0 p-4 text-xs font-medium uppercase tracking-tighter outline-none focus:border-secondary shadow-inner"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].key = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <input
                    placeholder="Value Data"
                    className="flex-1 bg-card border border-border rounded-0 p-4 text-xs font-medium outline-none focus:border-secondary shadow-inner text-secondary"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].value = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <button
                    aria-label="remove key"
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        specifications: formData.specifications.filter((_, i) => i !== index),
                      })
                    }
                    className="sm:self-center p-3 text-pText/20 hover:text-secondary transition-colors bg-card sm:bg-transparent rounded-0 border border-border sm:border-none"
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
          {/* Commerce Core: Updated for Base and Sell Price */}
          <section className="bg-card/40 p-5 rounded-0 border border-border space-y-8 shadow-xl">
            <SectionHeader icon={<BarChart3 size={20} />} title="Commerce_Core" />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Regular_Price*"
                type="number"
                placeholder="৳0.00"
                onChange={(e) =>
                  setFormData({ ...formData, price: { ...formData.price, base: e.target.value } })
                }
                required
              />
              <CustomInput
                label="Stock_Quantity"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <CustomInput
                label="Sell_Price"
                type="number"
                placeholder="৳0.00"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, discounted: e.target.value },
                  })
                }
              />
              <CustomInput
                label="Offer_Deadline"
                type="date"
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </section>

          {/* Visual Assets */}
          <section className="bg-bg p-5 rounded-0 border border-border/80 space-y-6 shadow-inner relative overflow-hidden">
            <SectionHeader
              icon={<ImageIcon size={20} />}
              title={`Visual_Sync (${formData.images.length}/5)`}
            />
            <div className="relative group">
              <input
                placeholder="Asset URL + Press Enter"
                onKeyDown={addImageUrl}
                disabled={formData.images.length >= 5}
                className="w-full bg-card border border-border rounded-0 p-4 text-[12px] font-medium uppercase tracking-tighter outline-none focus:border-secondary disabled:opacity-30 transition-all shadow-md pr-12"
              />
              <Plus
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary opacity-50 group-hover:scale-125 transition-transform"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-0 overflow-hidden border-2 border-border/50 group bg-card shadow-lg"
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    alt="p-preview"
                  />
                  <div className="absolute inset-0 bg-secondary/90 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      aria-label="closs image"
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: formData.images.filter((_, idx) => idx !== i),
                        })
                      }
                      className="p-2 bg-white text-secondary rounded-full shadow-xl active:scale-90 transition-transform"
                    >
                      <X size={16} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Meta & Execution */}
          <section className="bg-card/60 p-5 rounded-0 border-2 border-secondary/20 space-y-6  backdrop-blur-md">
            <SectionHeader icon={<Zap size={20} />} title="System_Registry" />
            <div className="grid gap-6">
              <CustomInput
                label="Neural SKU Identifier"
                placeholder="SKU-XXXX-XXXX"
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
              <div className="space-y-3">
                <label className="text-[12px] font-medium uppercase tracking-tighter text-pText/60 ml-3">
                  Market Classification
                </label>
                <select
                  className="w-full bg-bg/80 border border-border rounded-0 p-4 text-[12px] font-medium uppercase tracking-tighter outline-none focus:border-secondary text-secondary cursor-pointer shadow-inner appearance-none"
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
                arialabel="submit"
                type="submit"
                size="xl"
                disabled={btnLoading}
                className={`w-full py-8 rounded-0 shadow-secondary/20 shadow-xl active:scale-95 transition-all font-medium text-xs tracking-wide italic ${btnLoading ? 'grayscale opacity-50' : 'hover:scale-[1.02]'}`}
                text={btnLoading ? <LoaderSpinner /> : 'Execute_Upload'}
              />
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

// --- Helper Components ---
function SelectionCard({ item, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-2 rounded-0 border-2 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2 group
      ${isSelected ? 'bg-secondary border-secondary shadow-[0_10px_20px_rgba(255,111,92,0.2)] -translate-y-1' : 'bg-bg border-border/60 hover:border-secondary/40 hover:bg-card/50'}`}
    >
      <div
        className={`w-12 h-10 shrink-0 rounded-0 overflow-hidden flex items-center justify-center border transition-all ${isSelected ? 'bg-white/20 border-white/30' : 'bg-card border-border shadow-inner'}`}
      >
        {item.image?.url ? (
          <Image
            src={item?.image?.url}
            fill
            loading="lazy"
            className="w-full h-full object-cover"
            alt={item?.name}
          />
        ) : (
          <Box size={18} className={isSelected ? 'text-white' : 'text-pText/20'} />
        )}
      </div>
      <p
        className={`text-[12px] font-medium uppercase tracking-tighterer text-center leading-tight transition-colors px-1 ${isSelected ? 'text-white' : 'text-pText/70'}`}
      >
        {item.name}
      </p>
      {isSelected && (
        <div className="absolute top-1 right-1 bg-white text-secondary rounded-full p-0.5 shadow-md animate-in zoom-in">
          <Check size={10} strokeWidth={4} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-4 text-secondary mb-6">
      <div className="p-3 bg-secondary/10 rounded-0 border border-secondary/20 shadow-md backdrop-blur-sm">
        {icon}
      </div>
      <h2 className="text-xs font-medium uppercase tracking-wide italic">{title}</h2>
    </div>
  );
}

function CustomInput({ label, ...props }) {
  return (
    <div className="space-y-3 flex-1">
      <label className="text-[12px] font-medium uppercase tracking-tighter text-pText/60 ml-3">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-border rounded-0 p-4 md:p-5 bg-bg/50 focus:border-secondary outline-none transition-all font-medium text-xs text-text placeholder:text-pText/10 shadow-inner"
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
