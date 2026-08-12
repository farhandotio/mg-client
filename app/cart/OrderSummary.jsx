'use client';
import React from 'react';
import { ArrowRight, ChevronLeft, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

export default function OrderSummary({ subtotal = 0 }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth || {});
  const safeSubtotal = Number(subtotal) || 0;
  const shippingFee = safeSubtotal > 0 ? 150 : 0;
  const total = safeSubtotal + shippingFee;

  const handleCheckout = () => {
    if (!user) {
      toast.error('প্রবেশাধিকার সংরক্ষিত: অর্ডার নিশ্চিত করতে লগইন করুন।');
      router.push('/auth');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-0 md:rounded-0 p-6 md:p-10 shadow relative overflow-hidden">
      {/* হেডার ও প্রোটোকল */}
      <div className="flex flex-col gap-1 mb-8 relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck size={14} className="animate-pulse" />
          <span className="text-[12px] font-medium uppercase tracking-tighter">
            পেমেন্ট প্রোটোকল
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-medium text-text uppercase italic tracking-tighterer flex items-center gap-3">
          অর্ডার সামারি <div className="h-1 flex-1 bg-primary/10 rounded-full" />
        </h2>
      </div>

      {/* কন্টেন্ট লিস্ট */}
      <div className="space-y-5 mb-10 relative z-10 font-medium uppercase tracking-tighter text-xs md:text-sm">
        <div className="flex justify-between items-center group">
          <span className="text-pText/50 group-hover:text-pText transition-colors">
            পণ্যের মোট দাম
          </span>
          <span className="text-text font-mono text-base md:text-lg">
            ৳{safeSubtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center group">
          <div>
            <span className="text-pText/50 group-hover:text-pText">ডেলিভারি চার্জ</span>
            <span className="text-[10px] text-primary block tracking-tighterer mt-1">
              <Truck size={10} className="inline mr-1" /> স্ট্যান্ডার্ড কার্গো
            </span>
          </div>
          <span className="text-text font-mono text-base md:text-lg">
            ৳{shippingFee.toLocaleString()}
          </span>
        </div>
      </div>

      {/* সর্বমোট (Grand Total) */}
      <div className="pt-8 border-t-2 border-border/20 mb-10 relative z-10">
        <div className="absolute -top-0.5 left-0 w-16 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),1)]" />
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[12px] md:text-xs font-medium text-pText/40 uppercase">
              সর্বমোট প্রদেয়
            </span>
          </div>
          <div className="text-right">
            <span className="text-4xl md:text-5xl font-medium text-primary tracking-tighterer italic block">
              ৳{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* অ্যাকশন বাটনসমূহ */}
      <div className="space-y-5 relative z-10">
        <Button
          arialabel="checkout"
          text={safeSubtotal > 0 ? 'অর্ডার সম্পন্ন করুন' : 'ব্যাগ খালি'}
          icon={ArrowRight}
          disabled={safeSubtotal === 0}
          className="w-full py-5 text-sm md:text-base flex items-center justify-center shadow-lg shadow-primary/20"
          onClick={handleCheckout}
          size="lg"
        />

        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 text-pText/60 text-[11px] md:text-[12px] font-medium uppercase tracking-wide hover:text-primary transition-all group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          শপিংয়ে ফিরে যান
        </Link>
      </div>

      {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড এলিমেন্ট */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
}
