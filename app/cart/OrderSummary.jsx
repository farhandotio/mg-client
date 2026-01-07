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
      toast.error('Access Denied: Please login to confirm order.');
      router.push('/auth');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col gap-1 mb-8 relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck size={14} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Billing Protocol</span>
        </div>
        <h2 className="text-3xl font-black text-text uppercase italic tracking-tighter flex items-center gap-3">
          Summary <div className="h-1 flex-1 bg-primary/10 rounded-full" />
        </h2>
      </div>

      <div className="space-y-5 mb-10 relative z-10 font-bold uppercase tracking-widest text-sm">
        <div className="flex justify-between items-center group">
          <span className="text-pText/50 group-hover:text-pText transition-colors">
            Total Items
          </span>
          <span className="text-text font-mono text-lg">৳{safeSubtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center group">
          <div>
            <span className="text-pText/50 group-hover:text-pText">Delivery Fee</span>
            <span className="text-[8px] text-primary block tracking-tighter">
              <Truck size={8} className="inline mr-1" /> Standard Cargo
            </span>
          </div>
          <span className="text-text font-mono text-lg">৳{shippingFee.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-8 border-t-2 border-border/20 mb-10 relative z-10">
        <div className="absolute -top-0.5 left-0 w-12 h-0.5 bg-primary shadow-[0_0_10px_#29fc56]" />
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs font-black text-pText/40 uppercase">Grand Total</span>
          </div>
          <div className="text-right">
            <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter italic block drop-shadow-[0_0_8px_rgba(41,252,86,0.3)]">
              ৳{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5 relative z-10">
        <Button
          text={safeSubtotal > 0 ? 'Initialize Checkout' : 'Cart Empty'}
          icon={ArrowRight}
          disabled={safeSubtotal === 0}
          className="w-full py-4 text-sm md:text-base flex items-center justify-center"
          onClick={handleCheckout}
          size='lg'
        />
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 text-pText/60 text-[10px] font-black uppercase tracking-[0.4em] hover:text-primary transition-all"
        >
          <ChevronLeft size={14} /> Back to Armory
        </Link>
      </div>
    </div>
  );
}
