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
import Button from '@/components/Button';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-primary font-bold tracking-widest">
        DECRYPTING ORDER DATA...
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text">
        Order not found or still syncing.
      </div>
    );
  }

  // ডাটা শর্টকাট (আপনার স্কিমা অনুযায়ী)
  const shipping = orderDetails.shippingAddress || {};
  const pricing = orderDetails.pricing || {};
  const payment = orderDetails.payment || {};

  return (
    <div className="min-h-screen bg-bg text-text py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary mb-6 shadow-[0_0_30px_rgba(41,252,86,0.2)]">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-2">
            Order <span className="text-primary">Confirmed</span>
          </h1>
          <p className="text-text/40 text-xs font-bold tracking-widest uppercase">
            Transaction successful via {payment.method || 'N/A'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Order Details */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
              <h3 className="text-primary text-[10px] font-black uppercase tracking-widest mb-6">
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

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-[10px] font-black uppercase text-pText mb-3">Shipping To</p>
                <p className="text-sm font-bold text-pText leading-relaxed">
                  {shipping.fullname}
                  <br />
                  {shipping.address}, {shipping.city}
                  <br />
                  <span className="text-primary">{shipping.phoneNumber}</span>
                </p>
              </div>
            </div>

            <Button size='xl' url={'/shop'} className="" icon={ArrowRight} text={'Continue Shopping'} />
          </div>

          {/* Pricing Summary */}
          <div className="md:col-span-5">
            <div className="bg-card border border-border rounded-3xl p-8 h-full">
              <h3 className="text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                Price Summary
              </h3>
              <div className="space-y-4 mb-8">
                {orderDetails.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="text-pText truncate max-w-32.5">{item.title}</span>
                    <span className="text-primary">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border text-[10px] font-bold uppercase">
                <div className="flex justify-between text-pText">
                  <span>Subtotal</span>
                  <span className="text-text">৳{(pricing.itemsPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-pText">
                  <span>Shipping</span>
                  <span className="text-text">
                    ৳{(pricing.shippingPrice || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-border mt-4">
                  <span className="text-text">Grand Total</span>
                  <span className="text-2xl font-black text-primary">
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
      <div className="flex items-center gap-2 text-pText">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span
        className={`text-[11px] font-bold ${
          isStatus ? 'bg-primary/10 text-primary px-2 py-0.5 rounded uppercase' : 'text-pText'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
