'use client';
import React, { useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  clearSingleProduct,
} from '@/store/features/productSlice';

// Sub-components
import Breadcrumbs from './components/Breadcrumbs';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import { Loader2, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage({ params }) {
  const { slug } = use(params);
  const dispatch = useDispatch();

  const {
    singleProduct: product,
    relatedProducts,
    loading,
    error,
  } = useSelector((state) => state.products);

  // ১. স্লাগ চেঞ্জ হলে আগের প্রোডাক্ট ক্লিয়ার করে নতুনটি ফেচ করা
  useEffect(() => {
    if (slug) {
      dispatch(clearSingleProduct()); // আগে ক্লিয়ার করা জরুরি
      dispatch(fetchProductBySlug(slug));
    }
    return () => dispatch(clearSingleProduct());
  }, [slug, dispatch]);

  // ২. ক্যাটাগরি আইডি পাওয়ার পর রিলেটেড প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (product?._id && product?.category?._id) {
      dispatch(fetchRelatedProducts(product.category._id));
    }
  }, [product?._id, product?.category?._id, dispatch]);

  // লোডিং হ্যান্ডলিং: যদি লোডিং ট্রু হয় অথবা প্রোডাক্টের স্লাগ বর্তমান স্লাগের সাথে না মিলে
  const isSyncing = loading || !product || product.slug !== slug;

  if (isSyncing && !error) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!product && !loading) return <ErrorScreen />;

  return (
    <div className="bg-bg min-h-screen pt-6 pb-24 px-4 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs category={product.category} title={product.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-6 md:sticky top-24 z-10">
            <ProductGallery
              images={product.images}
              title={product.title}
              discount={product.offer?.percentage}
              price={product.price}
            />
          </div>

          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        <div className="mt-20">
          <ProductTabs product={product} />
          <RelatedProducts products={relatedProducts} currentId={product._id} />
        </div>
      </div>
    </div>
  );
}

// --- Loading Screen Component (Enhanced) ---
const LoadingScreen = () => (
  <div className="fixed inset-0 z-999 bg-bg flex flex-col items-center justify-center gap-6">
    <div className="relative">
      {/* Outer spinning ring */}
      <div className="w-16 h-16 rounded-full border-2 border-primary/5 border-t-primary animate-spin" />
      {/* Inner pulsing icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap size={20} className="text-primary animate-pulse" />
      </div>
    </div>

    <div className="space-y-2 text-center">
      <h2 className="text-primary font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">
        Syncing_Hardware
      </h2>
      <div className="w-32 h-1 bg-primary/10 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-primary -translate-x-full animate-shimmer"
          style={{ animation: 'shimmer 1.5s infinite' }}
        />
      </div>
    </div>

    <style jsx>{`
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    `}</style>
  </div>
);

// --- Error Screen Component ---
const ErrorScreen = () => (
  <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
    <div className="relative mb-8">
      <h2 className="text-[12vw] font-black uppercase italic tracking-tighter text-white/5 leading-none">
        VOID_ERR
      </h2>
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-pText/40 font-black uppercase tracking-[0.4em] text-[10px]">
        Signal Lost / Data Corrupted
      </p>
    </div>

    <Link href="/shop" className="group flex items-center gap-4 text-primary transition-all">
      <div className="p-4 rounded-full border border-primary/20 group-hover:bg-primary group-hover:text-bg transition-all">
        <ArrowLeft size={20} />
      </div>
      <div className="text-left">
        <span className="block text-[10px] font-black uppercase tracking-widest opacity-50">
          Back to Terminal
        </span>
        <span className="block text-sm font-black uppercase tracking-widest">
          Re-Initialize Shop
        </span>
      </div>
    </Link>
  </div>
);
