'use client';
import React, { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '@/store/features/orderSlice';
import {
  MapPin,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Loader2,
  QrCode,
  Fingerprint,
  Cpu,
  Zap,
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Button from '@/components/Button';
import Image from 'next/image';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const componentRef = useRef(null);

  const { orderDetails: order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) dispatch(getOrderDetails(id));
  }, [id, dispatch]);

  const handlePrintAction = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Protocol-X-${order?._id.slice(-8)}`,
  });

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text py-12 selection:bg-primary selection:text-bg">
      <div className="max-w-7xl px-5 md:px-6 mx-auto space-y-10">
        {/* --- Top Bar: Fully Rounded --- */}
        <div className="flex justify-between items-center">
          <button
          aria-label="access vault"
            onClick={() => router.back()}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-pText hover:text-primary transition-all"
          >
            <ArrowLeft size={16} /> Access Vault
          </button>

          <div className="md:w-fit">
            <Button
            arialabel="print protocol"
              size="sm"
              icon={Printer}
              onClick={() => handlePrintAction()}
              className=""
              text={'Print Protocol'}
            ></Button>
          </div>
        </div>

        {/* --- Main Printable Document --- */}
        <div ref={componentRef} className="print:p-10 print:bg-bg print:text-text">
          {/* Header Card */}
          <div className="bg-card/30 rounded-[3rem] p-8 md:p-16 border border-border/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-9 space-y-6">
                <div className="flex items-center gap-3 bg-primary/10 w-fit px-4 py-1 rounded-full text-primary border border-primary/20">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Order Active
                  </span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                  {order.orderStatus}
                  <span className="text-primary opacity-50">.</span>
                </h1>
                <div className="flex flex-wrap gap-6 text-[10px] font-bold text-pText uppercase tracking-widest bg-bg/40 p-4 rounded-2xl w-fit">
                  <p>
                    Hash:{' '}
                    <span className="text-text print:text-text font-mono">
                      #{order._id.slice(-12)}
                    </span>
                  </p>
                  <p>
                    Node:{' '}
                    <span className="text-text print:text-text">
                      {new Date(order.createdAt).toDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 flex md:justify-end">
                <div className="p-6 bg-white/5 print:bg-card rounded-3xl border border-white/10">
                  <QrCode
                    size={100}
                    className="text-text print:text-text opacity-80"
                    strokeWidth={1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Left: Product Stack Visual & List */}
            <div className="lg:col-span-7 bg-card/30 rounded-[3rem] p-8 md:p-12 border border-border/30 space-y-12">
              <div className="flex items-center gap-3 text-pText">
                <Cpu size={18} />
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">
                  Cargo Transmission
                </h3>
              </div>

              {/* Product Image Stack: One over another */}
              <div className="relative h-75 w-full flex justify-center items-center">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="absolute w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] border-4 border-bg bg-card overflow-hidden shadow-2xl transition-all duration-500 hover:z-50 hover:scale-110"
                    style={{
                      transform: `translateX(${idx * 40}px) translateY(${idx * -20}px) rotate(${
                        idx * 5
                      }deg)`,
                      zIndex: idx,
                      opacity: 1 - idx * 0.15,
                    }}
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                    <div className="absolute bottom-4 left-6 text-white font-black text-2xl opacity-20">
                      0{idx + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Item Details List */}
              <div className="space-y-4 pt-10">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-6 bg-bg/40 rounded-3xl border border-border/20 group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="group relative w-12 h-12 rounded-xl overflow-hidden bg-card">
                        <Image
                          src={item?.image}
                          alt={item?.name || 'Image'}
                          fill
                          loading="lazy"
                          sizes="48px"
                          className="object-cover transition-all duration-700 ease-in-out grayscale opacity-30 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase text-text print:text-text">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-pText uppercase font-bold">
                          Qty: {item?.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-black font-mono italic text-primary">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary Node */}
            <div className="lg:col-span-5 space-y-8">
              {/* Recipient Node */}
              <div className="bg-card/30 rounded-[3rem] p-8 md:p-10 border border-border/30 space-y-6">
                <div className="flex items-center gap-3 text-pText">
                  <Fingerprint size={18} />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Recipients Node</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-black uppercase text-text print:text-text leading-none italic">
                    {order.shippingAddress?.street}
                  </p>
                  <p className="text-[10px] font-black text-pText uppercase tracking-widest">
                    {order.shippingAddress?.city} // {order.shippingAddress?.zip}
                  </p>
                  <div className="pt-4">
                    <span className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20">
                      {order.shippingAddress?.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Node */}
              <div className="bg-primary text-text rounded-[3rem] p-8 md:p-10 space-y-8 shadow-xl shadow-primary/10 print:bg-card print:text-text">
                <div className="space-y-4 text-[10px] font-black uppercase tracking-widest opacity-80">
                  <div className="flex justify-between border-b border-text/10 pb-2">
                    <span>Baseline Sum</span>
                    <span>৳{order.pricing?.itemsPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-text/10 pb-2">
                    <span>Logistics</span>
                    <span>৳{order.pricing?.shippingPrice?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                    Total Transmission
                  </p>
                  <p className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none">
                    ৳{order.pricing?.totalPrice?.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 py-4 px-6 bg-text/10 rounded-2xl border border-text/20">
                  <ShieldCheck size={20} />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase opacity-60">
                      Secure Payment
                    </span>
                    <span className="text-[10px] font-black uppercase">
                      {order.payment?.method}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pb-10">
          <div className="bg-card/20 px-8 py-3 rounded-full border border-border/30 text-[8px] font-bold text-pText/40 uppercase tracking-[0.4em]">
            © 2026 CYBERSTORE.TERMINAL / SECURE_ACCESS_GRANTED
          </div>
        </div>
      </div>
    </div>
  );
}
