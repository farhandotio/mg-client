'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, deleteBrand } from '@/store/features/brandSlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Plus, Award } from 'lucide-react';
import Button from '@/components/Button';

export default function BrandsPage() {
  const dispatch = useDispatch();

  // ১. Redux Store থেকে ব্র্যান্ড ডাটা নেওয়া
  const { brands, isLoading } = useSelector((state) => state.brands.brands);

  // ২. পেজ লোড হলে ডাটা নিয়ে আসা
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  // ৩. ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (confirm('Are you sure? Removing this brand might affect associated products.')) {
      try {
        await dispatch(deleteBrand(id)).unwrap();
        toast.success('Brand identity purged.');
      } catch (err) {
        toast.error('Failed to delete brand');
      }
    }
  };

  // ৪. টেবিল কলাম কনফিগারেশন
  const columns = [
    {
      label: 'Brand Identity',
      key: 'name',
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-border flex items-center justify-center overflow-hidden p-2">
            {item.image || item.logo ? (
              <img
                src={item.image.url || item.logo}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Award size={20} className="text-primary/50" />
            )}
          </div>
          <div>
            <p className="font-black text-white text-xs uppercase tracking-tighter">{item.name}</p>
            <p className="text-[8px] text-pText tracking-[0.2em] uppercase font-bold">
              Verified Partner
            </p>
          </div>
        </div>
      ),
    },
    {
      label: 'Slug',
      key: 'slug',
      render: (item) => (
        <span className="text-[10px] font-bold text-pText/80 font-mono italic">
          {item.slug || item.name?.toLowerCase().replace(/ /g, '-')}
        </span>
      ),
    },
    {
      label: 'Status',
      key: 'isActive',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            Active
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter">
            Global <span className="text-primary">Brands</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pText mt-2 opacity-60">
            Managing the Neural Supply Chain
          </p>
        </div>

        <div className="max-md:w-full">
          <Button
            url={'/admin/brands/create'}
            className=""
            text={'Create Brand'}
            icon={Plus}
          ></Button>
        </div>
      </div>

      {/* Generic Table Component */}
      <DataTable
        columns={columns}
        data={brands}
        loading={isLoading}
        onEdit={(item) => console.log('Edit Brand:', item)}
        onDelete={handleDelete}
      />

      {/* Footer Info */}
      <div className="mt-8 flex items-center gap-4 text-pText">
        <div className="h-0.5 flex-1 bg-border/50"></div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">
          Total Registered Entities: {brands?.length || 0}
        </p>
        <div className="h-0.5 flex-1 bg-border/50"></div>
      </div>
    </div>
  );
}
