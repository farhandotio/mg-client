'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/store/features/categorySlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Plus, Layers } from 'lucide-react';

export default function CategoriesPage() {
  const dispatch = useDispatch();

  // ১. Redux Store থেকে ক্যাটাগরি ডাটা নেওয়া
  const { categories, loading } = useSelector((state) => state.categories);

  // ২. ডাটা ফেচ করা
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ৩. ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (confirm('Delete this category? This may affect linked products.')) {
      dispatch(deleteCategory(id));
    }
  };

  // ৪. টেবিল কলাম কনফিগারেশন
  const columns = [
    {
      label: 'Category Info',
      key: 'name',
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            {item?.image ? (
              <img src={item?.image?.url} alt={item?.name} className="w-full h-full object-cover" />
            ) : (
              <Layers size={16} className="text-primary" />
            )}
          </div>
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-tight">{item?.name}</p>
            <p className="text-[9px] text-pText tracking-widest uppercase">
              ID: {item?._id.slice(-6)}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: 'Slug / URL',
      key: 'slug',
      render: (item) => (
        <span className="text-[10px] font-medium text-pText bg-white/5 px-3 py-1 rounded-lg border border-border">
          /{item.slug}
        </span>
      ),
    },
    {
      label: 'Added On',
      key: 'createdAt',
      render: (item) => (
        <span className="text-xs text-pText">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter">
            Data <span className="text-primary">Categories</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pText mt-2 opacity-60">
            Organizing the Vault Architecture
          </p>
        </div>

        <button
          className="group bg-white text-black hover:bg-primary hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-primary/20"
          onClick={() => toast('Add Category Modal Coming Soon!')}
        >
          <Plus size={16} strokeWidth={3} />
          Create New Class
        </button>
      </div>

      {/* Table Section */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        onEdit={(item) => console.log('Edit Category:', item)}
        onDelete={handleDelete}
      />

      {/* Summary Footer */}
      <div className="mt-8 px-6 py-4 bg-card/30 border border-border rounded-2xl inline-block">
        <p className="text-[9px] font-black uppercase tracking-widest text-pText">
          Total Active Classes: <span className="text-primary ml-2">{categories.length}</span>
        </p>
      </div>
    </div>
  );
}
