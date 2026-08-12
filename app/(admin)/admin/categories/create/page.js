'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/store/features/categorySlice';
import { toast } from 'react-hot-toast';
import {
  Zap,
  Layers,
  Image as ImageIcon,
  Plus,
  Loader2,
  ArrowLeft,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function CreateCategoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    image: { url: '', fileId: '' },
  });

  const handleImageUrl = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      setFormData({
        ...formData,
        image: {
          url: e.target.value,
          fileId: `cat_${Date.now()}`,
        },
      });
      e.target.value = '';
      toast.success('Neural Link Established');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) return toast.error('Identification label missing');
    if (!formData.image?.url) return toast.error('Visual data required');

    try {
      const resultAction = await dispatch(createCategory(formData));

      if (createCategory.fulfilled.match(resultAction)) {
        router.push('/admin/categories');
      }
    } catch (err) {
      toast.error(
        typeof err === 'string' ? err : err?.message || 'System Failure: Overload Detected'
      );
    }
  };

  return (
    <div className="bg-bg min-h-screen text-text selection:bg-primary/30">
      {/* Top Navigation & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 border-b border-border/60 pb-10">
        <div className="space-y-4">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 text-pText/40 hover:text-primary transition-all group px-3 py-1 bg-card/30 rounded-full border border-border/40"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-medium uppercase tracking-tighter">
              Esc / Terminal
            </span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-5xl lg:text-7xl font-medium uppercase italic tracking-tighterer leading-none">
              New{' '}
              <span className="text-primary drop-shadow-[0_4px_10px_rgba(255,111,92,0.2)]">
                Class
              </span>
            </h1>
            <div className="flex items-center gap-2 text-primary/60">
              <Activity size={14} />
              <span className="text-[12px] font-medium uppercase tracking-tighter">
                System_Initialization_v2
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-card/50 p-4 rounded-0 border border-border/50 backdrop-blur-sm shadow-inner">
          <div className="text-right border-r border-border/50 pr-4">
            <p className="text-[10px] font-medium text-pText uppercase tracking-tighter opacity-40">
              Security_Level
            </p>
            <p className="text-[12px] font-medium text-primary italic">Admin_Restricted</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-0 text-primary animate-pulse">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Visual Asset Holder */}
        <div className="lg:col-span-5 xl:col-span-5 group">
          <section className="bg-card/40 p-5 md:p-8 rounded-0 border border-border/80 shadow-sm space-y-6 h-full flex flex-col relative overflow-hidden transition-all group-hover:border-primary/30 group-hover:shadow-lg">
            {/* Background Tech Accent */}
            <div className="absolute -bottom-10 -left-10 text-primary opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <ImageIcon size={250} />
            </div>

            <SectionHeader icon={<ImageIcon size={18} />} title="Entity_Visual" />

            <div className="space-y-6 grow flex flex-col relative z-10">
              <div className="relative group/input">
                <input
                  type="text"
                  placeholder="Insert Asset URL & Enter"
                  onKeyDown={handleImageUrl}
                  className="w-full border border-border/80 rounded-0 p-4 bg-bg/60 text-[12px] font-medium uppercase tracking-tighter outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-primary/10 rounded-0 group-hover/input:bg-primary transition-colors">
                  <Plus size={14} className="group-hover/input:text-white" />
                </div>
              </div>

              <div className="grow min-h-75 lg:min-h-0 relative rounded-0 border-2 border-dashed border-border flex flex-col items-center justify-center bg-bg/40 backdrop-blur-sm overflow-hidden shadow-inner group-hover:border-primary/50 transition-colors">
                {formData.image.url ? (
                  <div className="relative w-full h-full p-8 flex items-center justify-center">
                    <img
                      src={formData.image.url}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500 hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      aria-label="check image"
                      type="button"
                      onClick={() => setFormData({ ...formData, image: { url: '', fileId: '' } })}
                      className="absolute bottom-6 right-6 bg-primary text-white p-3 rounded-0 shadow-xl hover:bg-text transition-all active:scale-90 z-20"
                    >
                      <Layers size={18} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                      <ImageIcon size={28} className="text-primary/20" />
                    </div>
                    <p className="text-[12px] font-medium uppercase tracking-tighter text-pText/30">
                      Waiting_for_Signal
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-bg/60 p-3 rounded-0 border border-border/50 flex justify-between items-center">
                <span className="text-[10px] font-medium uppercase text-pText/40 tracking-tighter">
                  Asset_ID
                </span>
                <span className="text-[11px] font-medium text-primary font-mono">
                  {formData.image.fileId || 'NULL'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Metadata Input */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-8">
          <section className="bg-card/40 p-5 md:p-8 rounded-0 border border-border/80 shadow-sm relative overflow-hidden h-full flex flex-col justify-center transition-all hover:border-primary/30">
            {/* Background Layers Accent */}
            <div className="absolute top-0 right-0 p-10 text-primary opacity-[0.02] -rotate-12">
              <Layers size={300} />
            </div>

            <SectionHeader icon={<Layers size={18} />} title="Metadata_Processing" />

            <div className="space-y-10 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-2">
                  <label className="text-[12px] font-medium uppercase tracking-tighter text-pText/60">
                    Classification_Label
                  </label>
                  <span className="text-[10px] font-medium text-primary/40 uppercase tracking-tighter">
                    Required*
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical_Nodes"
                  className="w-full border border-border rounded-0 p-6 bg-bg/60 focus:border-primary outline-none transition-all font-medium text-lg text-text placeholder:text-pText/10 shadow-inner"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[12px] font-medium uppercase tracking-tighter text-pText/60 px-2">
                  Broadcast_Signal
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['active', 'inactive'].map((status) => (
                    <button
                      aria-label="status select"
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`group relative overflow-hidden py-5 rounded-0 border-2 font-medium text-[12px] uppercase tracking-tighter transition-all 
                      ${
                        formData.status === status
                          ? 'bg-primary border-primary text-white shadow-[0_10px_20px_rgba(255,111,92,0.3)]'
                          : 'bg-bg border-border/60 text-pText hover:border-primary/40'
                      }`}
                    >
                      <span className="relative z-10">
                        {status === 'active' ? 'Live Node' : 'Suspended'}
                      </span>
                      {formData.status === status && (
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  aria-label="submit"
                  type="submit"
                  size="xl"
                  disabled={loading}
                  className={`w-full py-8 rounded-0 shadow-2xl active:scale-[0.97] transition-all font-medium text-sm tracking-wide italic
                    ${loading ? 'opacity-50 grayscale' : 'hover:shadow-primary/30'}
                  `}
                  text={
                    loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      'Execute_Initialization'
                    )
                  }
                />
                <p className="text-center text-[10px] font-medium uppercase tracking-tighter text-pText/30 mt-6">
                  Warning: System entry is permanent until manual override
                </p>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

// জেনেরিক সেকশন হেডার
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-4 text-primary mb-8">
      <div className="p-3 bg-primary/10 rounded-0 border border-primary/20 shadow-sm backdrop-blur-md">
        {icon}
      </div>
      <h2 className="text-xs font-medium uppercase tracking-wide">{title}</h2>
    </div>
  );
}
