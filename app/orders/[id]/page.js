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
    documentTitle: `অর্ডার-রশিদ-${order?._id.slice(-8)}`,
  });

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-[12px] font-medium uppercase tracking-tighter text-primary animate-pulse">
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // অর্ডারের স্ট্যাটাস বাংলায় রূপান্তর
  const getStatusInBangla = (status) => {
    const statusMap = {
      Pending: 'অপেক্ষমান',
      Processing: 'প্রসেসিং',
      Shipped: 'পাঠানো হয়েছে',
      Delivered: 'ডেলিভারি সম্পন্ন',
      Cancelled: 'বাতিল করা হয়েছে',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-bg text-text py-12 selection:bg-primary selection:text-bg">
      <div className="max-w-7xl px-5 md:px-6 mx-auto space-y-10">
        {/* --- টপ বার --- */}
        <div className="flex  md:flex-row justify-between items-center gap-6">
          <button
            aria-label="পিছনে ফিরে যান"
            onClick={() => router.back()}
            className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-tighter text-pText hover:text-primary transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> ফিরে
            যান
          </button>

          <div className="md:w-fit">
            <Button
              arialabel="অর্ডার কপি প্রিন্ট করুন"
              size="sm"
              icon={Printer}
              onClick={() => handlePrintAction()}
              text={'রশিদ প্রিন্ট করুন'}
            />
          </div>
        </div>

        {/* --- প্রিন্টযোগ্য ডকুমেন্ট --- */}
        <div ref={componentRef} className="print:p-10 print:bg-white print:text-black">
          {/* হেডার কার্ড */}
          <div className="bg-card/30 rounded-2xl p-8 md:p-16 border border-border/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-9 space-y-6">
                <div className="flex items-center gap-3 bg-primary/10 w-fit px-4 py-1 rounded-full text-primary border border-primary/20">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] md:text-[12px] font-medium uppercase tracking-tighter">
                    অর্ডারটি এখন: {getStatusInBangla(order.orderStatus)}
                  </span>
                </div>
                <h1 className="text-5xl md:text-8xl font-medium uppercase tracking-tighterer leading-none italic">
                  {getStatusInBangla(order.orderStatus)}
                  <span className="text-primary opacity-50">.</span>
                </h1>
                <div className="flex flex-wrap gap-6 text-[11px] font-medium text-pText uppercase tracking-tighter bg-bg/40 p-4 rounded-md w-fit border border-white/5">
                  <p>
                    আইডি: <span className="text-text font-mono">#{order._id.slice(-12)}</span>
                  </p>
                  <p>
                    তারিখ:{' '}
                    <span className="text-text">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 flex md:justify-end">
                <div className="p-6 bg-white/5 print:bg-gray-100 rounded-md border border-white/10">
                  <QrCode
                    size={100}
                    className="text-text print:text-black opacity-80"
                    strokeWidth={1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* বাম পাশ: পণ্যের তালিকা */}
            <div className="lg:col-span-7 bg-card/30 rounded-2xl p-8 md:p-12 border border-border/30 space-y-12">
              <div className="flex items-center gap-3 text-pText">
                <Cpu size={18} />
                <h3 className="text-xs font-medium uppercase tracking-tighter">
                  অর্ডারকৃত পণ্যের তালিকা
                </h3>
              </div>

              {/* প্রোডাক্ট ইমেজ স্ট্যাক */}
              <div className="relative h-64 w-full flex justify-center items-center">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="absolute w-40 h-40 md:w-56 md:h-56 rounded-lg border-4 border-bg bg-card overflow-hidden shadow-2xl transition-all duration-500 hover:z-50 hover:scale-105"
                    style={{
                      transform: `translateX(${idx * 30}px) translateY(${idx * -15}px) rotate(${idx * 5}deg)`,
                      zIndex: idx,
                    }}
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* আইটেম ডিটেইলস */}
              <div className="space-y-4 pt-10">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-5 bg-bg/40 rounded-lg border border-border/20 group hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-card border border-white/5">
                        <Image
                          src={item?.image}
                          alt={item?.title}
                          fill
                          sizes="56px"
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-medium uppercase text-text">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-pText font-medium uppercase">
                          পরিমাণ: {item?.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-md font-medium font-mono text-primary italic">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ডান পাশ: ঠিকানা ও পেমেন্ট */}
            <div className="lg:col-span-5 space-y-8">
              {/* ডেলিভারি ঠিকানা */}
              <div className="bg-card/30 rounded-2xl p-8 md:p-10 border border-border/30 space-y-6">
                <div className="flex items-center gap-3 text-pText">
                  <Fingerprint size={18} />
                  <h3 className="text-xs font-medium uppercase tracking-tighter">
                    ডেলিভারি ঠিকানা
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-medium uppercase text-text leading-tight italic">
                    {order.shippingAddress?.street}
                  </p>
                  <p className="text-[12px] font-medium text-pText uppercase tracking-tighter">
                    শহর: {order.shippingAddress?.city} <br />
                    পোস্ট কোড: {order.shippingAddress?.zip} <br />
                    বিভাগ: {order.shippingAddress?.state || 'প্রদান করা হয়নি'}
                  </p>
                  <div className="pt-4">
                    <span className="px-4 py-2 bg-primary/10 text-primary text-[12px] font-medium rounded-full border border-primary/20">
                      {order.shippingAddress?.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* আর্থিক হিসাব */}
              <div className="bg-primary text-white rounded-2xl p-8 md:p-10 space-y-8 shadow-2xl shadow-primary/20 print:bg-black print:text-white">
                <div className="space-y-4 text-[12px] font-medium uppercase tracking-tighter opacity-90">
                  <div className="flex justify-between border-b border-bg/10 pb-2">
                    <span>পণ্যের মোট দাম</span>
                    <span>৳{order.pricing?.itemsPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-bg/10 pb-2">
                    <span>ডেলিভারি চার্জ</span>
                    <span>৳{order.pricing?.shippingPrice?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1 text-center py-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                    মোট পরিশোধযোগ্য
                  </p>
                  <p className="text-5xl md:text-6xl font-medium italic tracking-tighterer">
                    ৳{order.pricing?.totalPrice?.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 py-4 px-6 bg-bg/20 rounded-lg border border-bg/10">
                  <ShieldCheck size={20} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase opacity-70">
                      নিরাপদ পেমেন্ট পদ্ধতি
                    </span>
                    <span className="text-[12px] font-medium uppercase">
                      {order.payment?.method === 'COD' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন পেমেন্ট'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="flex justify-center pb-10">
          <div className="text-[9px] font-medium text-pText/70 uppercase tracking-wide text-center">
            © 2026 সাইবারস্টোর / নিরাপদ অ্যাক্সেস নিশ্চিত করা হয়েছে
          </div>
        </div>
      </div>
    </div>
  );
}
