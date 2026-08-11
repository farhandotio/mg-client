'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from '@/store/features/orderSlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Clock, Terminal, ShieldAlert, X, User, MapPin, Phone } from 'lucide-react';

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.order);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(getAllOrdersAdmin());
  }, [dispatch]);

  const handleUpdateClick = (item) => {
    setSelectedOrder(item);
    setNewStatus(item.orderStatus);
    setIsModalOpen(true);
  };

  // অর্ডার ডিলিট ফাংশন
  const handleDeleteOrder = async (id) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি ডিলিট করতে চান? এটি চিরতরে মুছে যাবে।')) {
      try {
        await dispatch(deleteOrderAdmin(id)).unwrap();
        toast.success('অর্ডার সাকসেসফুলি ডিলিট হয়েছে');
      } catch (error) {
        toast.error(error || 'ডিলিট করা সম্ভব হয়নি');
      }
    }
  };

  const submitStatusUpdate = async () => {
    try {
      await dispatch(updateOrderStatusAdmin({ id: selectedOrder._id, status: newStatus })).unwrap();
      toast.success('সিস্টেম স্ট্যাটাস আপডেট হয়েছে');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error || 'আপডেট ব্যর্থ হয়েছে');
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
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
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const columns = [
    {
      label: 'অর্ডার তথ্য',
      key: '_id',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-primary/70 font-medium uppercase">
            #{item._id?.slice(-8)}
          </span>
          <div className="flex items-center gap-1.5">
            <User size={10} className="text-pText" />
            <span className="text-[12px] font-medium text-text uppercase italic">
              {item.user?.fullname || 'অজানা গ্রাহক'}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'যোগাযোগ ও ঠিকানা',
      key: 'contact',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-pText">
            <Phone size={10} />
            <span className="text-[11px] font-medium">{item.shippingAddress?.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-pText/60 italic">
            <MapPin size={10} />
            <span className="text-[11px] font-medium uppercase truncate max-w-37.5">
              {item.shippingAddress?.city}, {item.shippingAddress?.state}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'তারিখ ও সময়',
      key: 'createdAt',
      render: (item) => (
        <span className="text-[11px] font-mono text-text/80">
          {new Date(item.createdAt).toLocaleDateString('bn-BD')}
        </span>
      ),
    },
    {
      label: 'মোট টাকা',
      key: 'totalPrice',
      render: (item) => (
        <span className="font-medium text-primary text-xs italic">
          ৳{item?.pricing?.totalPrice?.toLocaleString()}
        </span>
      ),
    },
    {
      label: 'স্ট্যাটাস',
      key: 'orderStatus',
      render: (item) => (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getStatusStyle(item.orderStatus)}`}
        >
          <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
          {item.orderStatus || 'Pending'}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* হেডার সেকশন */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Terminal size={14} />
            <span className="text-[11px] font-medium uppercase tracking-wide">
              Secure_Admin_Terminal
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-medium uppercase italic tracking-tighterer text-text leading-none mt-1">
            অর্ডার <span className="text-primary">তালিকা</span>
          </h1>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 px-6 py-4 rounded-md flex items-center gap-4">
          <Clock size={18} className="text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-medium text-text leading-none">
              {orders?.length || 0}
            </span>
            <span className="text-[10px] font-medium text-pText/60 uppercase tracking-tighter mt-1">
              Captured_Logs
            </span>
          </div>
        </div>
      </div>

      {/* ডাটা টেবিল */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-primary/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-card/20 backdrop-blur-md border border-border/40 rounded-md overflow-hidden shadow-2xl">
          <DataTable
            columns={columns}
            data={orders}
            loading={loading}
            onEdit={handleUpdateClick}
            onView={(item) => window.open(`/orders/${item._id}`, '_blank')}
            onDelete={handleDeleteOrder} // ডিলিট ফাংশন এখানে পাস করা হয়েছে
          />
        </div>
      </div>

      {/* স্ট্যাটাস আপডেট মোডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-border w-full max-w-md rounded-md p-8 shadow-2xl relative">
            <button
              aria-label="close"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-pText hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-medium italic uppercase tracking-tighterer mb-1">
              Update <span className="text-primary">Status</span>
            </h2>
            <p className="text-[12px] uppercase font-medium text-pText tracking-tighter mb-8">
              ID: #{selectedOrder?._id?.slice(-8)}
            </p>
            <div className="space-y-6">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-bg rounded-md border border-border px-4 py-3 text-xs font-medium text-text focus:border-primary outline-none appearance-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <button
                onClick={submitStatusUpdate}
                className="w-full bg-primary hover:bg-primary/80 text-black font-medium uppercase italic py-4 rounded-md transition-all text-xs tracking-tighter"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
