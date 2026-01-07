'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, clearOrderDetails } from '@/store/features/orderSlice';
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  Hash,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
    // পেজ থেকে চলে যাওয়ার সময় স্টেট ক্লিয়ার করা
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-green-500 font-bold tracking-widest">
        DECRYPTING ORDER DATA...
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Order not found or still syncing.
      </div>
    );
  }

  // ডাটা শর্টকাট (আপনার স্কিমা অনুযায়ী)
  const shipping = orderDetails.shippingAddress || {};
  const pricing = orderDetails.pricing || {};
  const payment = orderDetails.payment || {};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500 mb-6 shadow-[0_0_30px_rgba(41,252,86,0.2)]">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-2">
            Order <span className="text-green-500">Confirmed</span>
          </h1>
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase">
            Transaction successful via {payment.method || 'N/A'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Order Details */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <h3 className="text-green-500 text-[10px] font-black uppercase tracking-widest mb-6">
                Order Details
              </h3>
              <div className="space-y-4">
                <InfoRow icon={Hash} label="Order ID" value={orderDetails._id} />
                <InfoRow
                  icon={Calendar}
                  label="Date"
                  value={new Date(orderDetails.createdAt).toLocaleDateString()}
                />
                <InfoRow icon={Truck} label="Status" value={orderDetails.orderStatus} isStatus />
                <InfoRow icon={ShoppingBag} label="Method" value={payment.method} />
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-white/20 mb-3">Shipping To</p>
                <p className="text-sm font-bold text-white/80 leading-relaxed">
                  {shipping.fullname}
                  <br />
                  {shipping.address}, {shipping.city}
                  <br />
                  <span className="text-green-500">{shipping.phoneNumber}</span>
                </p>
              </div>
            </div>

            <Link href="/shop" className="block">
              <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                Continue Shopping <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {/* Pricing Summary */}
          <div className="md:col-span-5">
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 h-full">
              <h3 className="text-green-500 text-[10px] font-black uppercase tracking-widest mb-6">
                Price Summary
              </h3>
              <div className="space-y-4 mb-8">
                {orderDetails.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="text-white/60 truncate max-w-[150px]">{item.title}</span>
                    <span className="text-green-500">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5 text-[10px] font-bold uppercase">
                <div className="flex justify-between text-white/30">
                  <span>Subtotal</span>
                  <span className="text-white">৳{(pricing.itemsPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/30">
                  <span>Shipping</span>
                  <span className="text-white">
                    ৳{(pricing.shippingPrice || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-4">
                  <span className="text-white">Grand Total</span>
                  <span className="text-2xl font-black text-green-500">
                    ৳{(pricing.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, isStatus }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/30">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span
        className={`text-[11px] font-bold ${
          isStatus
            ? 'bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase'
            : 'text-white/80'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
