'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
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
import { Loader2, ArrowLeft, Zap } from 'lucide-react';

export default function ProductDetailsPage({ params }) {
  const { slug } = params;
  const dispatch = useDispatch();

  const {
    singleProduct: product,
    relatedProducts,
    loading,
    error,
  } = useSelector((state) => state.products);

  // 1️⃣ Fetch product when slug changes
  useEffect(() => {
    dispatch(clearSingleProduct());
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [slug, dispatch]);

  // 2️⃣ Fetch related products when category available
  useEffect(() => {
    if (product?._id && product?.category?._id) {
      dispatch(fetchRelatedProducts(product.category._id));
    }
  }, [product?._id, product?.category?._id, dispatch]);

  const isSyncing = loading || !product || product.slug !== slug;

  if (isSyncing && !error) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!product && !loading) return <ErrorScreen />;

  // 3️⃣ Structured Data JSON-LD
  const productJSONLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images?.length ? product.images.map((img) => img.url) : ['/placeholder.png'],
    description: product.shortDescription || product.description,
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Gadget BDs',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.gadgetbds.com/shop/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price?.discounted || product.price?.base || 0,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const breadcrumbJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.gadgetbds.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category?.name || 'Shop',
        item: `https://www.gadgetbds.com/shop/category/${product.category?.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://www.gadgetbds.com/shop/${product.slug}`,
      },
    ],
  };

  return (
    <>
      {/* ================= SEO HEAD ================= */}
      <Head>
        <title>{product.title} Price in Bangladesh | Gadget BDs</title>
        <meta
          name="description"
          content={
            product.shortDescription ||
            `Buy ${product.title} at best price in Bangladesh from Gadget BDs.`
          }
        />
        <meta name="robots" content={product.stock > 0 ? 'index, follow' : 'noindex, follow'} />
        <link rel="canonical" href={`https://www.gadgetbds.com/shop/${product.slug}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJSONLD) }}
        />
      </Head>

      {/* ================= UI ================= */}
      <div className="bg-bg min-h-screen pt-6 pb-24 px-4 md:px-12 animate-in fade-in duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs category={product.category} title={product.title} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Product Gallery */}
            <div className="lg:col-span-6 md:sticky top-24 z-10">
              <ProductGallery
                images={product.images}
                title={product.title}
                discount={product.offer?.percentage}
                price={product.price}
              />
            </div>

            {/* Product Info */}
            <div className="lg:col-span-6">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Tabs + Related Products */}
          <div className="mt-20">
            <ProductTabs product={product} />
            <RelatedProducts products={relatedProducts} currentId={product._id} />
          </div>
        </div>
      </div>
    </>
  );
}

// ------------------- Loading & Error Screens -------------------
const LoadingScreen = () => (
  <div className="fixed inset-0 z-999 bg-bg flex flex-col items-center justify-center gap-6">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-primary/5 border-t-primary animate-spin" />
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
