'use client';
import React from 'react';
import { Smartphone, Laptop, Headphones, Gamepad2, Watch, Home } from 'lucide-react';

export default function Category() {
  // ডাইনামিক ক্যাটাগরি ডেটা
  const categories = [
    {
      name: 'Smartphones',
      count: 156,
      icon: <Smartphone size={28} />,
      href: '/category/smartphones',
    },
    { name: 'Laptops', count: 89, icon: <Laptop size={28} />, href: '/category/laptops' },
    {
      name: 'Headphones',
      count: 234,
      icon: <Headphones size={28} />,
      href: '/category/headphones',
    },
    { name: 'Gaming', count: 178, icon: <Gamepad2 size={28} />, href: '/category/gaming' },
    { name: 'Smartwatches', count: 67, icon: <Watch size={28} />, href: '/category/smartwatches' },
    { name: 'Smart Home', count: 112, icon: <Home size={28} />, href: '/category/smart-home' },
  ];

  return (
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-text tracking-tight">
            Shop by Category
          </h2>
          <p className="text-pText text-lg max-w-2xl mx-auto font-medium">
            Explore our wide range of premium electronics and gadgets
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_40px_-10px_rgba(41,252,86,0.1)] hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center text-pText group-hover:text-primary group-hover:bg-primary/5 transition-all duration-500">
                {item.icon}
              </div>

              {/* Text Info */}
              <div className="text-center space-y-1">
                <h3 className="text-text font-bold text-lg group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-pText text-xs font-bold uppercase tracking-widest opacity-60">
                  {item.count} Products
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
