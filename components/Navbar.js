'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingCart, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categories = [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Watches', slug: 'watches' },
  ];

  // Redux থেকে ডেটা (যদি থাকে)
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-[#00A3FF] w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(0,163,255,0.3)] group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="text-text font-bold text-xl tracking-tight">My Gadget</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
          <Link href="/" className="text-text hover:text-primary transition-colors">
            Home
          </Link>

          {/* Dynamic Categories Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
              className="flex items-center gap-1 text-text hover:text-primary transition-colors"
            >
              Categories{' '}
              <ChevronDown
                size={14}
                className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCategoryOpen && (
              <div
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
                className="absolute top-full left-0 w-48 bg-card border border-border mt-2 rounded-xl shadow-2xl overflow-hidden py-2"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-2 text-pText hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/shop" className="text-text hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/deals" className="text-primary font-bold">
            Deals
          </Link>
          <Link href="/about" className="text-text hover:text-primary transition-colors">
            About
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-5 text-text">
          <button className="hover:text-primary transition-colors" title="Search">
            <Search size={22} />
          </button>
          <Link href="/wishlist" className="hover:text-primary transition-colors" title="Wishlist">
            <Heart size={22} />
          </Link>
          <Link href="/cart" className="relative hover:text-primary transition-colors" title="Cart">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-bg text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link href="/profile" className="hover:text-primary transition-colors" title="Account">
            <User size={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
