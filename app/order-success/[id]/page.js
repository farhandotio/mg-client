'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '@/store/features/orderSlice';
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
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-primary font-black uppercase tracking-[0.5em] animate-pulse">
          Decrypting Order Data...
        </div>
      </div>
    );
  }

  if (!orderDetails) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-16 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary mb-6 shadow-[0_0_50px_rgba(41,252,86,0.2)]">
            <CheckCircle2 size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            Order <span className="text-primary">Confirmed</span>
          </h1>
          <p className="text-white/40 uppercase text-xs font-black tracking-[0.3em]">
            Transaction Synced Successfully to Central Grid
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Order Info Card */}
          <div className="md:col-span-7 space-y-6 animate-in slide-in-from-left duration-700">
            <div className="bg-[#111111] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Package size={120} />
              </div>

              <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Order Intelligence
              </h3>

              <div className="space-y-4">
                <InfoRow icon={Hash} label="Order ID" value={orderDetails._id} isMono />
                <InfoRow
                  icon={Calendar}
                  label="Timestamp"
                  value={new Date(orderDetails.createdAt).toLocaleString()}
                />
                <InfoRow icon={Truck} label="Status" value={orderDetails.orderStatus} isStatus />
                <InfoRow icon={ShoppingBag} label="Payment" value={orderDetails.paymentMethod} />
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-white/20 mb-4 tracking-widest">
                  Delivery Node
                </p>
                <p className="text-sm font-bold text-white/80 leading-relaxed">
                  {orderDetails.shippingAddress.fullname}
                  <br />
                  {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}
                  <br />
                  <span className="text-primary font-mono">
                    {orderDetails.shippingAddress.phoneNumber}
                  </span>
                </p>
              </div>
            </div>

            <Link href="/shop" className="block">
              <button className="w-full py-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                Continue Exploration <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {/* Items Summary Card */}
          <div className="md:col-span-5 animate-in slide-in-from-right duration-700">
            <div className="bg-[#111111] border border-white/5 rounded-[2rem] p-8 h-full">
              <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                Data Payload
              </h3>

              <div className="space-y-4 mb-8">
                {orderDetails.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 border border-white/10 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-primary italic">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5 font-black uppercase text-[10px]">
                <div className="flex justify-between text-white/20">
                  <span>Subtotal</span>
                  <span className="text-white">৳{orderDetails.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/20">
                  <span>Shipping</span>
                  <span className="text-primary">৳{orderDetails.shippingPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-white text-xs">Total Charge</span>
                  <span className="text-3xl font-black text-primary italic tracking-tighter">
                    ৳{orderDetails.totalPrice.toLocaleString()}
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

// Helper Components
function InfoRow({ icon: Icon, label, value, isMono, isStatus }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <Icon size={14} className="text-white/20 group-hover:text-primary transition-colors" />
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">
          {label}
        </span>
      </div>
      <span
        className={`text-xs font-bold ${
          isMono ? 'font-mono text-primary/60 truncate max-w-[150px]' : ''
        } ${
          isStatus
            ? 'bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] uppercase'
            : 'text-white/80'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
