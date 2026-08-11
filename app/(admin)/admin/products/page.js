'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, deleteProduct } from '@/store/features/productSlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';
import { Plus } from 'lucide-react';

export default function AdminProducts() {
  const dispatch = useDispatch();

  // ১. Redux Store থেকে ডাটা এবং লোডিং স্টেট নেওয়া
  const { products, loading, pagination } = useSelector((state) => state.products);

  // ২. কম্পোনেন্ট মাউন্ট হলে ডাটা ফেচ করা
  useEffect(() => {
    dispatch(fetchAllProducts('limit=100')); // অ্যাডমিনের জন্য বেশি ডাটা ফেচ করা ভালো
  }, [dispatch]);

  // ৩. ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to purge this unit from the vault?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Unit removed from inventory');
      } catch (err) {
        toast.error(err || 'Operation failed');
      }
    }
  };

  const columns = [
    {
      label: 'Unit Details',
      key: 'title',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-white/5 border border-border overflow-hidden shrink-0">
            <img
              src={
                Array.isArray(item.images) ? item.images[0]?.url : item.image || '/placeholder.png'
              }
              className="w-full h-full object-cover"
              alt={item.title}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-white text-xs uppercase tracking-tighter line-clamp-1">
              {item.title}
            </span>
            <span className="text-[11px] text-pText uppercase tracking-tighter">
              {item.category?.name || 'No Category'}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'Pricing',
      key: 'price',
      render: (item) => {
        const price = item.price?.discounted || item.price?.base || item.price || 0;
        return <span className="font-medium text-primary italic">৳{price.toLocaleString()}</span>;
      },
    },
    {
      label: 'Stock Status',
      key: 'stock',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-white">{item.stock} Units</span>
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${item.stock > 0 ? 'bg-primary' : 'bg-red-600'}`}
              style={{ width: `${Math.min(item.stock, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      label: 'Inventory Status',
      key: 'status',
      render: (item) => (
        <span
          className={`px-3 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-tighterer ${
            item.stock > 0
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}
        >
          {item.stock > 0 ? 'Active' : 'Depleted'}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-medium uppercase italic tracking-tighterer leading-none">
            Product <span className="text-primary">Inventory</span>
          </h1>
          <p className="text-pText text-[12px] font-medium uppercase tracking-tighter mt-2 opacity-60">
            Total Tracked Units: {pagination?.totalProducts || products.length}
          </p>
        </div>

        <div className="w-fit">
          <Button
            arialabel="Create product"
            icon={Plus}
            url={'/admin/products/create'}
            text={'Create Product'}
            className=""
          />
        </div>
      </div>

      {/* Table Section */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        onEdit={(item) => console.log('Edit Request:', item)}
        onDelete={handleDelete}
        onView={(item) => window.open(`/shop/${item.slug}`, '_blank')}
      />
    </div>
  );
}
