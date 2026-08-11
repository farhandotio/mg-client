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
  Loader2,
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
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-primary font-medium tracking-tighter text-[12px] animate-pulse uppercase">
            আপনার অর্ডার ডাটা লোড হচ্ছে...
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
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* সাকসেস হেডার */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-md bg-card border-2 border-primary rotate-12 mb-8 shadow-2xl">
              <CheckCircle2 size={48} className="text-primary -rotate-12" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium uppercase italic tracking-tighterer leading-none mb-4">
            অর্ডার <span className="text-primary">সম্পন্ন</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <p className="text-pText text-[12px] font-medium tracking-tighter uppercase italic">
              সফলভাবে গ্রহণ করা হয়েছে
            </p>
            <span className="h-px w-8 bg-border" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* মেইন ইনফো কার্ড */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card/50 backdrop-blur-xl border border-border rounded-lg overflow-hidden group">
              <div className="p-1 bg-linear-to-r from-primary/50 via-transparent to-transparent" />
              <div className="p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
                  <div>
                    <h3 className="text-pText text-[11px] font-medium uppercase tracking-tighter mb-2 flex items-center gap-2">
                      <Hash size={12} className="text-primary" /> ট্র্যাকিং আইডি
                    </h3>
                    <p className="text-sm font-medium font-mono tracking-tighterer text-text/80">
                      {orderDetails._id}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-pText text-[11px] font-medium uppercase tracking-tighter mb-2">
                      বর্তমান অবস্থা
                    </h3>
                    <span className="px-3 py-1 bg-primary text-bg text-[10px] font-medium rounded-full italic uppercase tracking-wider">
                      {orderDetails.orderStatus === 'Pending'
                        ? 'অপেক্ষমান'
                        : orderDetails.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <SectionLabel icon={MapPin} text="ডেলিভারি ঠিকানা" />
                    <div className="border-l-2 border-primary/20 pl-4 py-1">
                      <p className="text-sm font-medium text-text uppercase leading-tight mb-1">
                        {shipping.fullname || 'গ্রাহকের নাম'}
                      </p>
                      <p className="text-xs text-pText font-medium leading-relaxed italic">
                        {shipping.street}, {shipping.city}
                        <br />
                        {shipping.state}, {shipping.zip}
                      </p>
                      <p className="text-[12px] text-primary font-medium mt-3 font-mono">
                        {shipping.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionLabel icon={CreditCard} text="পেমেন্ট তথ্য" />
                    <div className="bg-bg/50 border border-border p-4 rounded-md">
                      <p className="text-[12px] font-medium text-pText uppercase mb-1">
                        পদ্ধতি: {payment.method === 'COD' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন'}
                      </p>
                      <p className="text-[12px] font-medium text-primary uppercase">
                        স্ট্যাটাস: {payment.status === 'Pending' ? 'বাকি' : 'পরিশোধিত'}
                      </p>
                      <p className="text-[11px] text-pText/40 mt-4 italic font-medium">
                        অর্ডার সময়: {new Date(orderDetails.createdAt).toLocaleString('bn-BD')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                arialabel="go to shop"
                size="xl"
                url="/shop"
                className="flex-1 rounded-md py-4"
                icon={ShoppingBag}
                text="শপে ফিরে যান"
              />
              <Button
                arialabel="go to order"
                size="xl"
                href={`/orders/${orderDetails._id}`}
                className="flex-1 rounded-md py-4"
                icon={Zap}
                text="বিস্তারিত দেখুন"
              />
            </div>
          </div>

          {/* প্রাইস সাইডবার */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-lg p-8 sticky top-24 shadow-2xl">
              <h3 className="text-pText text-[11px] font-medium uppercase tracking-tighter mb-8 border-b border-border/20 pb-4">
                অর্ডার লিস্ট
              </h3>

              <div className="space-y-4 mb-8">
                {orderDetails.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 group">
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-text leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase italic">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-pText font-medium mt-1 uppercase">
                        পরিমাণ: {item.quantity}
                      </p>
                    </div>
                    <p className="text-[11px] font-mono font-medium">
                      ৳{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-dashed border-border">
                <PriceRow label="মোট পণ্যের দাম" value={pricing.itemsPrice} />
                <PriceRow label="ডেলিভারি চার্জ" value={pricing.shippingPrice} />
                <div className="flex justify-between items-center pt-6 mt-2 border-t border-border">
                  <span className="text-[12px] font-medium uppercase text-pText">সর্বমোট</span>
                  <span className="text-3xl font-medium text-primary italic tracking-tighterer font-mono">
                    ৳{pricing.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-md border border-primary/10">
                <p className="text-[10px] text-primary font-medium text-center uppercase tracking-tighter leading-relaxed">
                  আপনার ইনভয়েস কপিটি ইমেইলে পাঠিয়ে দেওয়া হয়েছে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- হেল্পার কম্পোনেন্টস ---

function SectionLabel({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
        <Icon size={12} className="text-primary" />
      </div>
      <h3 className="text-pText text-[11px] font-medium uppercase tracking-tighter">{text}</h3>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider">
      <span className="text-pText">{label}</span>
      <span className="text-text font-mono">৳{value?.toLocaleString()}</span>
    </div>
  );
}
