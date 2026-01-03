'use client';
import React, { useState } from 'react';
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
          {product.brand?.name || 'Premium Brand'}
        </span>
        <h1 className="text-4xl lg:text-6xl font-black uppercase leading-none tracking-tighter italic">
          {product.title}
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-xl border border-border">
            <Star size={18} className="fill-primary text-primary" />
            <span className="font-bold">{product.ratings?.average || 0}</span>
          </div>
          <span className="text-pText font-medium italic opacity-60">
            | &nbsp; {product.ratings?.count || 0} Reviews
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-black text-text">${product.price?.base}</span>
        {product.offer?.percentage > 0 && (
          <span className="text-2xl text-pText line-through opacity-40">
            ${product.price?.discounted}
          </span>
        )}
      </div>

      <p className="text-pText text-lg leading-relaxed border-l-2 border-primary/30 pl-6 italic">
        {product.shortDescription || product.description?.substring(0, 150) + '...'}
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
        <button className="grow bg-primary text-bg font-black uppercase py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_10px_30px_-10px_rgba(41,252,86,0.5)] active:scale-95">
          <ShoppingCart size={22} strokeWidth={3} /> Add to Cart
        </button>
        <button className="p-5 bg-card border border-border rounded-2xl hover:border-red-500 group transition-all">
          <Heart size={22} className="group-hover:fill-red-500 group-hover:text-red-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border/50">
        <Badge icon={<Truck size={20} />} label="Delivery" sub="2-3 Days" />
        <Badge icon={<ShieldCheck size={20} />} label="Guarantee" sub="1 Year" />
        <Badge icon={<RotateCcw size={20} />} label="Returns" sub="30 Days" />
      </div>
    </div>
  );
}

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
