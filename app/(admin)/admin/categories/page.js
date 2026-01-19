'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory, updateCategory } from '@/store/features/categorySlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Plus, Layers, X, Save, Loader2, Link as LinkIcon, Globe } from 'lucide-react';
import Button from '@/components/Button';
import Image from 'next/image';

export default function CategoriesPage() {
  const dispatch = useDispatch();

  // ১. Redux Store থেকে ক্যাটাগরি ডাটা নেওয়া
  const { categories = [], loading } = useSelector((state) => state.categories);

  // ২. Local States for Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ৩. এডিট বাটন ক্লিক হ্যান্ডলার
  const handleEditClick = (item) => {
    setSelectedCategory(item);
    setEditName(item.name || '');
    setEditImage(item.image?.url || '');
    setIsEditModalOpen(true);
  };

  // ৪. আপডেট সাবমিট হ্যান্ডলার
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return toast.error('Category name is required');

    setIsUpdating(true);
    try {
      await dispatch(
        updateCategory({
          id: selectedCategory._id,
          formData: {
            name: editName,
            image: { url: editImage },
          },
        })
      ).unwrap();
      setIsEditModalOpen(false);
    } catch (err) {
      // Error handled in slice
    } finally {
      setIsUpdating(false);
    }
  };

  // ৫. ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (confirm('Delete this category? This may affect linked products.')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
      } catch (err) {}
    }
  };

  const columns = [
    {
      label: 'Category Info',
      key: 'name',
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
            {item?.image?.url ? (
              <img
                src={item.image?.url || item.logo}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Layers size={16} className="text-primary" />
            )}
          </div>
          <div>
            <p className="font-black text-white text-[11px] uppercase tracking-tighter leading-none">
              {item?.name}
            </p>
            <p className="text-[7px] text-pText tracking-widest uppercase mt-1 opacity-50">
              ID: {item?._id.slice(-8)}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: 'Slug / URL',
      key: 'slug',
      render: (item) => (
        <span className="text-[10px] font-mono text-pText/70 italic">/{item.slug}</span>
      ),
    },
    {
      label: 'Added On',
      key: 'createdAt',
      render: (item) => (
        <span className="text-[10px] text-pText/60 font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Globe size={14} className="animate-spin-slow" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">
              Vault_Architecture
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">
            Data <span className="text-primary">Categories</span>
          </h1>
        </div>

        <div className="max-md:w-full">
          <Button
            aria-label="create category"
            url={'/admin/categories/create'}
            text={'Create Category'}
            icon={Plus}
          />
        </div>
      </div>

      {/* DataTable */}
      <div className="relative bg-card/20 backdrop-blur-md border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onView={(item) => window.open(`/category/${item.slug}`, '_blank')}
        />
      </div>

      {/* --- Inline Update Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

            <div className="flex justify-between items-center mb-8 relative">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-text">
                  Modify <span className="text-primary">Class</span>
                </h2>
                <p className="text-[8px] font-black uppercase tracking-widest text-pText opacity-50 mt-1">
                  Reference_ID: {selectedCategory?._id}
                </p>
              </div>
              <button
                aria-label="closs"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} className="text-pText" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Category_Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-xs font-bold text-text focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  placeholder="Class name..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  Image_URL <LinkIcon size={10} />
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-xs font-bold text-text focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  placeholder="https://vault.com/category-img.png"
                />
              </div>

              {editImage && (
                <div className="w-16 h-16 rounded-lg border border-border bg-white/5 p-2">
                  <img
                    src={editImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}

              <button
                aria-label="submit"
                type="submit"
                disabled={isUpdating}
                className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase italic py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs tracking-widest disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isUpdating ? 'Synchronizing...' : 'Commit Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-10 flex items-center gap-4 text-pText/40">
        <div className="h-0.5 flex-1 bg-linear-to-r from-transparent via-border/50 to-transparent"></div>
        <p className="text-[8px] font-black uppercase tracking-[0.5em] whitespace-nowrap">
          Total_Active_Classes: {categories.length}
        </p>
        <div className="h-0.5 flex-1 bg-linear-to-r from-transparent via-border/50 to-transparent"></div>
      </div>
    </div>
  );
}
