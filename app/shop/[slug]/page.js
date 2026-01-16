'use client';
import React, { useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
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

  // ১. স্লাগ পরিবর্তন হলে ডাটা ফেচ করা
  useEffect(() => {
    dispatch(clearSingleProduct());
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [slug, dispatch]);

  // ২. রিলেটেড প্রোডাক্ট ফেচ করা (ক্যাটাগরি আইডি পাওয়ার পর)
  useEffect(() => {
    if (product?._id && product?.category?._id) {
      dispatch(fetchRelatedProducts(product.category._id));
    }
  }, [product?._id, product?.category?._id, dispatch]);

  // সিংক্রোনাইজিং চেক
  const isSyncing = loading || !product || product.slug !== slug;

  if (isSyncing && !error) return <LoadingScreen />;
  if (error || (!product && !loading)) return <ErrorScreen />;

  // ৩. Structured Data JSON-LD
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        image: product.images?.map((img) => img.url) || [],
        description:
          product.shortDescription || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
        sku: product.sku || product._id,
        brand: { '@type': 'Brand', name: product.brand?.name || 'Gadget BDs' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BDT',
          price: product.price?.discounted || product.price?.base || 0,
          availability:
            product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `https://www.gadgetbds.com/shop/${product.slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gadgetbds.com/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.category?.name,
            item: `https://www.gadgetbds.com/shop?category=${product.category?.slug}`,
          },
          { '@type': 'ListItem', position: 3, name: product.title },
        ],
      },
    ],
  };

  return (
    <div className="bg-bg min-h-screen pt-6 pb-24 px-4 md:px-12 animate-in fade-in duration-700 overflow-x-hidden">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto">
        <Breadcrumbs category={product.category} title={product.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Product Gallery Section */}
          <div className="lg:col-span-6 md:sticky top-28 z-10">
            <div className="relative group">
              {/* Decorative Neon Glow */}
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

              <ProductGallery
                images={product.images}
                title={product.title}
                discount={product.offer?.percentage}
                price={product.price}
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Technical Specs & Reviews */}
        <div className="mt-24 space-y-24">
          <ProductTabs product={product} />

          <div className="border-t border-border/40 pt-16">
            <RelatedProducts products={relatedProducts} currentId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------- UI Helpers -------------------

const LoadingScreen = () => (
  <div className="fixed inset-0 z-9999 bg-bg flex flex-col items-center justify-center gap-8">
    <div className="relative">
      <div className="w-20 h-20 rounded-full border-[3px] border-primary/10 border-t-primary animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap size={24} className="text-primary animate-pulse" />
      </div>
    </div>
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-primary font-black uppercase tracking-[0.8em] text-[10px] ml-[0.8em]">
        Accessing_Vault
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
  <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
    <div className="relative mb-12">
      <h2 className="text-[15vw] font-black uppercase italic tracking-tighter text-white/30 leading-none select-none">
        404_VOID
      </h2>
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
        <span className="text-primary font-black uppercase tracking-[0.5em] text-xs">
          Signal_Interrupted
        </span>
        <p className="text-pText/60 text-[10px] uppercase font-bold tracking-widest">
          Hardware ID not found in current sector
        </p>
      </div>
    </div>

    <Link href="/shop" className="flex items-center gap-6 group">
      <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--color-primary),0.4)]">
        <ArrowLeft size={22} className="group-hover:text-bg transition-colors" />
      </div>
      <div className="text-left">
        <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-pText/40 mb-1">
          Return to Grid
        </span>
        <span className="block text-lg font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
          Initialize_Shop
        </span>
      </div>
    </Link>
  </div>
);
