'use client';
import React, { useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  clearSingleProduct,
  resetProductState,
} from '@/store/features/productSlice';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage({ params }) {
  // ১. স্লাগ আনর্যাপ করা (Next.js 15 এর নিয়ম)
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const dispatch = useDispatch();

  // ২. রিডাক্স স্টেট
  const {
    singleProduct: product,
    relatedProducts,
    loading,
    error,
  } = useSelector((state) => state.products);

  // ৩. মেইন প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }

    // ক্লিনআপ: পেজ থেকে বেরিয়ে গেলে স্টেট ক্লিয়ার হবে
    return () => {
      dispatch(clearSingleProduct());
      dispatch(resetProductState());
    };
  }, [slug, dispatch]);

  // ৪. রিলেটেড প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (product?.category?._id) {
      dispatch(fetchRelatedProducts(product.category._id));
    }
  }, [product?.category?._id, dispatch]);

  // ৫. লোডিং ভিউ
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-pText font-black uppercase tracking-widest text-xs animate-pulse">
          Loading Hardware Details...
        </p>
      </div>
    );
  }

  // ৬. এরর বা নট ফাউন্ড ভিউ
  if (error || (!product && !loading)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-4xl font-black uppercase italic">Product Not Found</h2>
        <Link href="/shop" className="flex items-center gap-2 text-primary font-bold">
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-text pt-8 pb-24 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-pText mb-12">
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-primary">{product.category?.name}</span>
          <ChevronRight className={product.category?.name ? 'block' : 'hidden'} size={12} />
          <span className="opacity-50 truncate max-w-37">{product.title}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-6">
            <ProductGallery images={product.images || []} title={product.title} />
          </div>
          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Specs */}
        <div className="mt-32 border-t border-border/50 pt-20">
          <h3 className="text-4xl font-black uppercase italic mb-12">Technical Specs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
            {product.specifications?.map((spec, i) => (
              <div key={i} className="flex justify-between py-6 border-b border-border/20">
                <span className="text-pText font-black uppercase text-[10px]">{spec.key}</span>
                <span className="font-bold text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {relatedProducts?.length > 1 && (
          <div className="mt-32">
            <h2 className="text-4xl font-black uppercase italic mb-12">Related Gadgets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts
                .filter((p) => p._id !== product._id)
                .slice(0, 4)
                .map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
