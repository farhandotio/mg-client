'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersAdmin } from '@/store/features/orderSlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const dispatch = useDispatch();

  // ১. Redux Store থেকে ডাটা নেওয়া
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersAdmin());
  }, [dispatch]);

  // ২. স্ট্যাটাস কালার হ্যান্ডলার (Case Sensitive fix: 'Processing')
  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'SHIPPED':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-white/5 text-pText border-border';
    }
  };

  // ৩. টেবিল কলাম কনফিগারেশন (আপনার JSON অনুযায়ী ফিক্সড)
  const columns = [
    {
      label: 'Order ID / Customer',
      key: '_id',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">
            #{item._id?.slice(-8)}
          </span>
          <span className="text-[9px] text-pText font-bold uppercase tracking-widest mt-1">
            {item.shippingAddress?.fullname || 'Unknown User'}
          </span>
        </div>
      ),
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (item) => (
        <span className="text-xs text-pText font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}
        </span>
      ),
    },
    {
      label: 'Amount',
      key: 'totalPrice',
      render: (item) => (
        <span className="font-black text-white text-xs italic">
          ৳{item?.pricing?.totalPrice?.toLocaleString()}
        </span>
      ),
    },
    {
      label: 'Status',
      key: 'orderStatus',
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border ${getStatusStyle(
            item.orderStatus
          )}`}
        >
          {item.orderStatus || 'Pending'}
        </span>
      ),
    },
    {
      label: 'Payment',
      key: 'paymentStatus',
      render: (item) => (
        <div className="flex flex-col">
          <span
            className={`text-[9px] font-black uppercase ${
              item.payment?.status === 'PAID' ? 'text-green-400' : 'text-orange-400'
            }`}
          >
            {item.payment?.status || 'PENDING'}
          </span>
          <span className="text-[7px] text-pText uppercase tracking-widest">
            {item.paymentMethod}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">
            Transmission <span className="text-primary">Logs</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pText mt-2 opacity-60">
            Monitoring Neural Orders & Shipments
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-card border border-border px-6 py-3 rounded-2xl flex items-center gap-3">
            <Clock size={16} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white">{orders?.length || 0}</span>
              <span className="text-[7px] font-black text-pText uppercase tracking-widest">
                Captured Logs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        onEdit={(item) => toast(`Modifying Order #${item._id.slice(-6)}`)}
        onView={(item) => window.open(`/admin/orders/${item._id}`, '_self')}
        onDelete={(id) => toast.error('Logs cannot be deleted for security.')}
      />
    </div>
  );
}
