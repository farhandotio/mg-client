'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '@/store/features/orderSlice';
import {
  Package,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowLeft,
  Filter,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orders, loading } = useSelector((state) => state.order);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  // ফিল্টারিং লজিক
  const filteredOrders = orders?.filter((order) =>
    filter === 'ALL' ? true : order.orderStatus === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">
            অর্ডার ভল্ট অ্যাক্সেস করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ফিল্টার লেবেল ম্যাপিং
  const filterLabels = {
    ALL: 'সবগুলো',
    PENDING: 'অপেক্ষমান',
    CONFIRMED: 'নিশ্চিত',
    DELIVERED: 'ডেলিভারি',
    CANCELLED: 'বাতিল',
  };

  return (
    <div className="min-h-screen bg-bg text-text py-12">
      <div className="max-w-7xl px-4 md:px-6 mx-auto space-y-10">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-10">
          <div className="space-y-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-pText text-[12px] font-black uppercase tracking-widest hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={14} /> প্রোফাইলে ফিরে যান
            </Link>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              অর্ডার <span className="text-primary">লগ</span>
            </h1>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-card/30 border border-border/50 rounded-md">
            {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                aria-label="status filter"
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${
                  filter === status
                    ? 'bg-primary text-bg shadow-lg shadow-primary/20'
                    : 'text-pText hover:text-text'
                }`}
              >
                {filterLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders?.length > 0 ? (
            filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
          ) : (
            <div className="text-center py-32 bg-card/10 rounded-xl border-2 border-dashed border-border/50">
              <Package size={48} className="mx-auto text-pText/20 mb-4" />
              <h3 className="text-xl font-black italic text-pText uppercase">
                কোন তথ্য পাওয়া যায়নি
              </h3>
              <Link
                href="/shop"
                className="text-primary text-[12px] font-black uppercase tracking-widest mt-4 inline-block border-b border-primary/30 pb-1"
              >
                প্রথম কেনাকাটা শুরু করুন
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const statusColors = {
    PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    CONFIRMED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    PROCESSING: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    DELIVERED: 'text-primary bg-primary/10 border-primary/20',
    CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  const statusInBangla = {
    PENDING: 'অপেক্ষমান',
    CONFIRMED: 'নিশ্চিত',
    PROCESSING: 'প্রসেসিং',
    DELIVERED: 'ডেলিভারি সম্পন্ন',
    CANCELLED: 'বাতিল',
  };

  return (
    <div className="group relative bg-card/30 border border-border/50 rounded-lg p-6 md:p-8 hover:border-primary/40 transition-all duration-500">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* Left: Info */}
        <div className="space-y-6 flex-1">
          <div className="flex items-start justify-between md:justify-start md:gap-6">
            <div>
              <p className="text-[11px] font-black text-pText uppercase tracking-[0.2em] mb-1">
                ট্রানজিশন আইডি
              </p>
              <h4 className="text-sm font-black text-text font-mono">#{order._id.toUpperCase()}</h4>
            </div>
            <div
              className={`px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest ${
                statusColors[order.orderStatus]
              }`}
            >
              {statusInBangla[order.orderStatus] || order.orderStatus}
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-bg rounded-md text-primary border border-border">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-[11px] font-black text-pText uppercase">অর্ডার সময়</p>
                <p className="text-xs font-bold">
                  {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-bg rounded-md text-primary border border-border">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-[11px] font-black text-pText uppercase">পেমেন্ট</p>
                <p className="text-xs font-bold uppercase">
                  {order.payment?.method === 'COD' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন'} -{' '}
                  <span className="text-primary">
                    {order.payment?.status === 'Pending' ? 'বাকি' : 'পরিশোধিত'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Items Preview */}
        <div className="flex -space-x-4 items-center">
          {order.orderItems?.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="w-14 h-14 rounded-md border-2 border-bg overflow-hidden shadow-xl bg-card"
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
          {order.orderItems?.length > 3 && (
            <div className="w-14 h-14 rounded-md border-2 border-bg bg-border flex items-center justify-center text-[12px] font-black">
              +{order.orderItems.length - 3}
            </div>
          )}
        </div>

        {/* Right: Price & CTA */}
        <div className="flex flex-col md:flex-row lg:flex-col justify-between items-end gap-4 min-w-42.5">
          <div className="text-right">
            <p className="text-[11px] font-black text-pText uppercase tracking-widest mb-1">
              মোট প্রদেয়
            </p>
            <h3 className="text-3xl font-black text-primary font-mono tracking-tighter italic">
              ৳{order.pricing?.totalPrice?.toLocaleString()}
            </h3>
          </div>
          <Link
            href={`/orders/${order._id}`}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-md text-[12px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg transition-all group/btn"
          >
            বিস্তারিত দেখুন{' '}
            <ChevronRight
              size={14}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
