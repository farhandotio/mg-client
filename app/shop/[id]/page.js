'use client';
import React, { useState, use } from 'react';
import { products } from '@/context/data';
import ProductCard from '@/components/ProductCard'; // আপনার কার্ড কম্পোনেন্ট
import {
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const product = products.find((p) => p._id === productId);

  // Related Products লজিক: একই ক্যাটাগরি কিন্তু বর্তমান প্রোডাক্ট নয়
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p._id !== productId)
    .slice(0, 3);

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');

  if (!product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text">
        <h2 className="text-2xl font-bold">Product not found!</h2>
      </div>
    );
  }

  const discount = product.price.original
    ? Math.round(((product.price.original - product.price.base) / product.price.original) * 100)
    : 0;

  return (
    <div className="bg-bg min-h-screen text-text pt-5 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-pText mb-5">
          <span className="hover:text-primary cursor-pointer">Home</span> <ChevronRight size={14} />
          <span className="hover:text-primary cursor-pointer">Shop</span> <ChevronRight size={14} />
          <span className="text-text font-medium">{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* --- Left: Image Gallery --- */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden p-8 flex items-center justify-center relative aspect-square">
              {discount > 0 && (
                <div className="absolute top-8 left-8 bg-primary text-bg text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(41,252,86,0.3)] z-10">
                  -{discount}% OFF
                </div>
              )}
              <img
                src={product.images[activeImg]?.url}
                alt={product.title}
                className="w-full h-full object-cover rounded-2xl transition-all duration-500"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(index)}
                  className={`w-24 h-24 rounded-2xl border-2 shrink-0 p-2 bg-card transition-all ${
                    activeImg === index ? 'border-primary' : 'border-border opacity-50'
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover rounded-lg" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* --- Right: Content --- */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
                {product.brand}
              </span>
              <h1 className="text-4xl lg:text-6xl font-black uppercase leading-none tracking-tighter">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-xl border border-border">
                  <Star size={18} className="fill-primary text-primary" />
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span className="text-pText font-medium italic">
                  | &nbsp; {product.numReviews} Reviews
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-text">${product.price.base}</span>
              {product.price.original && (
                <span className="text-2xl text-pText line-through opacity-50">
                  ${product.price.original}
                </span>
              )}
            </div>

            <p className="text-pText text-lg leading-relaxed border-l-2 border-primary/30 pl-6 italic">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <div className="flex items-center bg-card border border-border rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:text-primary transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-10 text-center font-black text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:text-primary transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button className="grow bg-primary text-bg font-black uppercase py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_-10px_rgba(41,252,86,0.5)] active:scale-95">
                <ShoppingCart size={22} strokeWidth={3} /> Add to Cart
              </button>
              <button className="p-5 bg-card border border-border rounded-2xl hover:border-red-500 group transition-all">
                <Heart size={22} className="group-hover:fill-red-500 group-hover:text-red-500" />
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border/50">
              <Badge icon={<Truck size={20} />} label="Delivery" sub="2-3 Days" />
              <Badge icon={<ShieldCheck size={20} />} label="Guarantee" sub="1 Year" />
              <Badge icon={<RotateCcw size={20} />} label="Returns" sub="30 Days" />
            </div>
          </div>
        </div>

        {/* --- Tabs Section --- */}
        <div className="mt-32">
          <div className="flex gap-12 border-b border-border mb-12 overflow-x-auto scrollbar-hide">
            {['specs', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 text-sm font-black uppercase tracking-widest relative whitespace-nowrap ${
                  activeTab === tab ? 'text-primary' : 'text-pText hover:text-text'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_#29fc56]" />
                )}
              </button>
            ))}
          </div>
          {/* Tab Content (Specs Example) */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 max-w-4xl animate-in fade-in duration-500">
              <SpecRow label="Category" val={product.category} />
              <SpecRow label="Brand" val={product.brand} />
              <SpecRow label="Stock" val={product.stock > 0 ? 'Available' : 'Out of Stock'} />
              <SpecRow label="SKU" val={`MG-${product._id.toUpperCase()}`} />
            </div>
          )}
          {/* Reviews & Shipping Content can be added here similarly */}
        </div>

        {/* --- Related Products Section --- */}
        <div className="mt-32 border-t border-border pt-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">You May Also Like</h2>
              <div className="w-20 h-1 bg-primary mt-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)
            ) : (
              <p className="text-pText italic">No related products found in this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components for Cleaner Code
function Badge({ icon, label, sub }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-pText">{label}</p>
        <p className="text-xs font-bold">{sub}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, val }) {
  return (
    <div className="flex justify-between py-5 border-b border-border/30">
      <span className="text-pText font-medium uppercase text-xs tracking-widest">{label}</span>
      <span className="font-bold">{val}</span>
    </div>
  );
}
