'use client';
import React, { useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  clearSingleProduct,
} from '@/store/features/productSlice';

// সাব-কম্পোনেন্টস
import Breadcrumbs from './components/Breadcrumbs';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import { ArrowLeft, Zap } from 'lucide-react';

export default function ProductDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const dispatch = useDispatch();

  const {
    singleProduct: product,
    relatedProducts,
    loading,
    error,
  } = useSelector((state) => state.products);

  // ১. ডাটা ফেচিং লজিক
  useEffect(() => {
    dispatch(clearSingleProduct());
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [slug, dispatch]);

  // ২. রিলেটেড প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (product?._id && product?.category?._id) {
      dispatch(fetchRelatedProducts(product.category._id));
    }
  }, [product?._id, product?.category?._id, dispatch]);

  const isSyncing = loading || !product || product.slug !== slug;

  if (isSyncing && !error) return <LoadingScreen />;
  if (error || (!product && !loading)) return <ErrorScreen />;

  // SEO-র জন্য স্ট্রাকচার্ড ডাটা (কন্টেন্ট বাংলায় রাখা হয়েছে)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        image: product.images?.map((img) => img.url) || [],
        description:
          product.shortDescription || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
        brand: { '@type': 'Brand', name: product.brand?.name || 'My Gadget' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BDT',
          price: product.price?.discounted || product.price?.base || 0,
          availability:
            product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    ],
  };

  return (
    <div className="bg-bg min-h-screen pt-6 pb-24  animate-in fade-in duration-700 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Breadcrumbs category={product.category} title={product.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* গ্যালারি সেকশন */}
          <div className="lg:col-span-6 md:sticky top-4 z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

              <ProductGallery
                images={product.images}
                title={product.title}
                discount={product.offer?.percentage}
                price={product.price}
              />
            </div>
          </div>

          {/* তথ্য সেকশন */}
          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* স্পেসিফিকেশন এবং রিলেটেড আইটেমস */}
        <div className="mt-16 space-y-12">
          <ProductTabs product={product} />

          <div className="border-t border-border/40 pt-8">
            <RelatedProducts products={relatedProducts} currentId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------- বাংলায় UI হেল্পার্স -------------------

const LoadingScreen = () => (
  <div className="fixed inset-0 z-9999 bg-bg flex flex-col items-center justify-center gap-8">
    <div className="relative">
      <div className="w-20 h-20 rounded-full border-[3px] border-primary/10 border-t-primary animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap size={24} className="text-primary animate-pulse" />
      </div>
    </div>
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-primary font-medium uppercase tracking-tighter text-[12px] ml-[0.5em]">
        তথ্য লোড হচ্ছে...
      </h2>
      <div className="w-48 h-0.5 bg-white/5 overflow-hidden rounded-full">
        <div className="h-full bg-primary animate-progress-line" />
      </div>
    </div>
    <style jsx>{`
      @keyframes progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      .animate-progress-line {
        animation: progress 2s infinite ease-in-out;
      }
    `}</style>
  </div>
);

const ErrorScreen = () => (
  <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
    <div className="relative mb-12">
      <h2 className="text-[12vw] font-medium uppercase italic tracking-tighterer text-white/10 leading-none select-none">
        NOT_FOUND
      </h2>
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
        <span className="text-primary font-medium uppercase tracking-tighter text-xs">
          পণ্যটি খুঁজে পাওয়া যায়নি
        </span>
        <p className="text-pText/60 text-[12px] uppercase font-medium tracking-tighter">
          আপনার অনুরোধকৃত আইটেমটি আমাদের ডাটাবেজে নেই
        </p>
      </div>
    </div>

    <Link href="/shop" className="flex items-center gap-6 group">
      <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
        <ArrowLeft size={22} className="group-hover:text-bg transition-colors" />
      </div>
      <div className="text-left">
        <span className="block text-[11px] font-medium uppercase tracking-tighter text-pText/40 mb-1">
          পূর্বের পাতায় ফিরুন
        </span>
        <span className="block text-lg font-medium uppercase italic tracking-tighterer group-hover:text-primary transition-colors">
          শপ পেজে যান
        </span>
      </div>
    </Link>
  </div>
);
