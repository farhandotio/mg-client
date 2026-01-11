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
  MapPin,
  CreditCard,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) dispatch(getOrderDetails(id));
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-primary font-black tracking-[0.3em] text-[10px] animate-pulse uppercase">
            Syncing Neural Data...
          </p>
        </div>
      </div>
    );
  }

  if (!orderDetails) return null;

  const shipping = orderDetails.shippingAddress || {};
  const pricing = orderDetails.pricing || {};
  const payment = orderDetails.payment || {};

  return (
    <div className="min-h-screen bg-bg text-text py-16 px-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-card border-2 border-primary rotate-12 mb-8 shadow-2xl">
              <CheckCircle2 size={48} className="text-primary -rotate-12" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
            Order <span className="text-primary">Deployed</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <p className="text-pText text-[10px] font-black tracking-[0.4em] uppercase italic">
              Transmission Successful
            </p>
            <span className="h-px w-8 bg-border" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card/50 backdrop-blur-xl border border-border rounded-4xl overflow-hidden group">
              <div className="p-1 bg-linear-to-r from-primary/50 via-transparent to-transparent" />
              <div className="p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
                  <div>
                    <h3 className="text-pText text-[9px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Hash size={12} className="text-primary" /> Tracking ID
                    </h3>
                    <p className="text-sm font-bold font-mono tracking-tighter text-text/80">
                      {orderDetails._id}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-pText text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                      Status
                    </h3>
                    <span className="px-3 py-1 bg-primary text-bg text-[10px] font-black rounded-full italic uppercase">
                      {orderDetails.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <SectionLabel icon={MapPin} text="Delivery Node" />
                    <div className="border-l-2 border-primary/20 pl-4 py-1">
                      <p className="text-sm font-bold text-text uppercase leading-tight mb-1">
                        {shipping.fullname}
                      </p>
                      <p className="text-xs text-pText font-medium leading-relaxed italic">
                        {shipping.street}, {shipping.city}
                        <br />
                        {shipping.state}, {shipping.zip}
                      </p>
                      <p className="text-[10px] text-primary font-black mt-3 font-mono">
                        {shipping.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionLabel icon={CreditCard} text="Payment Signal" />
                    <div className="bg-bg/50 border border-border p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-pText uppercase mb-1">
                        Method: {payment.method}
                      </p>
                      <p className="text-[10px] font-black text-primary uppercase">
                        Status: {payment.status}
                      </p>
                      <p className="text-[9px] text-pText/40 mt-4 italic font-bold">
                        Processed at: {new Date(orderDetails.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex max-md:min-h-30 flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                url="/shop"
                className="flex-1 rounded-2xl"
                icon={ShoppingBag}
                text="Back to Shop"
              />
              <Button
                size="xl"
                href={`/user/orders/${orderDetails._id}`}
                className="flex-1 rounded-2xl"
                icon={Zap}
                text="View Full Protocol"
              />
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-4xl p-8 sticky top-24">
              <h3 className="text-pText text-[9px] font-black uppercase tracking-[0.2em] mb-8">
                Data Summary
              </h3>

              <div className="space-y-4 mb-8">
                {orderDetails.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 group">
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-text leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase italic">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-pText font-black mt-1">QTY: {item.quantity}</p>
                    </div>
                    <p className="text-[11px] font-mono font-bold">
                      ৳{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-dashed border-border">
                <PriceRow label="Subtotal" value={pricing.itemsPrice} />
                <PriceRow label="Shipping" value={pricing.shippingPrice} />
                <div className="flex justify-between items-center pt-6 mt-2 border-t border-border">
                  <span className="text-[10px] font-black uppercase text-pText">Total Payable</span>
                  <span className="text-3xl font-black text-primary italic tracking-tighter font-mono">
                    ৳{pricing.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[9px] text-primary font-bold text-center uppercase tracking-widest leading-relaxed">
                  A copy of your receipt has been transmitted to your encrypted email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
        <Icon size={12} className="text-primary" />
      </div>
      <h3 className="text-pText text-[9px] font-black uppercase tracking-[0.2em]">{text}</h3>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
      <span className="text-pText">{label}</span>
      <span className="text-text font-mono">৳{value?.toLocaleString()}</span>
    </div>
  );
}
