'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, deleteBrand, updateBrand } from '@/store/features/brandSlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Plus, Award, Globe, X, Save, Loader2, Link as LinkIcon } from 'lucide-react';
import Button from '@/components/Button';

export default function BrandsPage() {
  const dispatch = useDispatch();

  const { brands = [], loading } = useSelector((state) => state.brands);

  // Local States for Modal & Update
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(''); // ইমেজ ইউআরএল এর জন্য স্টেট
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEditClick = (item) => {
    setSelectedBrand(item);
    setEditName(item.name || '');
    setEditImage(item.image?.url || item.logo || ''); // বিদ্যমান ইমেজ ইউআরএল সেট করা
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return toast.error('Brand name is required');

    setIsUpdating(true);
    try {
      // স্লাইস অনুযায়ী { id, formData } পাঠানো হচ্ছে
      await dispatch(
        updateBrand({
          id: selectedBrand._id,
          formData: {
            name: editName,
            image: { url: editImage }, // আপনার অবজেক্ট স্ট্রাকচার অনুযায়ী
          },
        })
      ).unwrap();

      setIsEditModalOpen(false);
    } catch (err) {
      // Error handling is inside slice
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure? Removing this brand might affect associated products.')) {
      try {
        await dispatch(deleteBrand(id)).unwrap();
      } catch (err) {}
    }
  };

  const columns = [
    {
      label: 'Brand Identity',
      key: 'name',
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-0 bg-white/5 border border-border flex items-center justify-center overflow-hidden p-1.5 transition-transform group-hover:scale-110">
            {item.image?.url || item.logo ? (
              <img
                src={item.image?.url || item.logo}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Award size={18} className="text-primary/50" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-white text-[11px] uppercase tracking-tighterer leading-none">
              {item.name}
            </p>
            <p className="text-[10px] text-pText tracking-tighter uppercase font-medium mt-1 opacity-50">
              Verified_Partner
            </p>
          </div>
        </div>
      ),
    },
    {
      label: 'Slug_Node',
      key: 'slug',
      render: (item) => (
        <span className="text-[12px] font-medium text-pText/70 font-mono italic">/{item.slug}</span>
      ),
    },
    {
      label: 'Status',
      key: 'isActive',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-medium text-white uppercase tracking-tighter">
            Online
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Globe size={14} className="animate-spin-slow" />
            <span className="text-[11px] font-medium uppercase tracking-wide">
              Neural_Supply_Chain
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-medium uppercase italic tracking-tighterer leading-none text-text">
            Global <span className="text-primary">Brands</span>
          </h1>
        </div>
        <div className="max-md:w-full">
          <Button
            aria-label="go to create brands"
            url={'/admin/brands/create'}
            text={'Initialize Brand'}
            icon={Plus}
          />
        </div>
      </div>

      <div className="relative bg-card/20 backdrop-blur-md border border-border/40 rounded-0 overflow-hidden shadow-2xl">
        <DataTable
          columns={columns}
          data={brands}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onView={(item) => window.open(`/brands/${item.slug}`, '_blank')}
        />
      </div>

      {/* --- Inline Update Modal with Image URL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-border w-full max-w-md rounded-0 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

            <div className="flex justify-between items-center mb-8 relative">
              <div>
                <h2 className="text-2xl font-medium italic uppercase tracking-tighterer text-text">
                  Modify <span className="text-primary">Entity</span>
                </h2>
                <p className="text-[10px] font-medium uppercase tracking-tighter text-pText opacity-50 mt-1">
                  ID: {selectedBrand?._id}
                </p>
              </div>
              <button
                aria-label="closs modal"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} className="text-pText" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6 relative">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium uppercase tracking-tighter text-primary">
                  Brand_Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-0 px-4 py-3 text-xs font-medium text-text focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  placeholder="Brand identity..."
                />
              </div>

              {/* Image URL Input */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium uppercase tracking-tighter text-primary flex items-center gap-2">
                  Image_URL <LinkIcon size={10} />
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-0 px-4 py-3 text-xs font-medium text-text focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  placeholder="https://image-link.com/logo.png"
                />
              </div>

              {/* Preview */}
              {editImage && (
                <div className="w-16 h-16 rounded-0 border border-border bg-white/5 p-2 overflow-hidden">
                  <img
                    src={editImage}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}

              <button
                aria-label="submit"
                type="submit"
                disabled={isUpdating}
                className="w-full bg-primary hover:bg-primary/90 text-black font-medium uppercase italic py-4 rounded-0 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs tracking-tighter disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isUpdating ? 'Synchronizing...' : 'Commit Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center gap-4 text-pText/40">
        <div className="h-0.5 flex-1 bg-linear-to-r from-transparent via-border/50 to-transparent"></div>
        <p className="text-[10px] font-medium uppercase tracking-tighter whitespace-nowrap">
          Total_Entities_Captured: {brands?.length || 0}
        </p>
        <div className="h-0.5 flex-1 bg-linear-to-r from-transparent via-border/50 to-transparent"></div>
      </div>
    </div>
  );
}
