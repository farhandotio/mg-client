'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { logoutUser } from '@/store/features/authSlice';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Zap,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
} from 'lucide-react';

// Sub-components
import SearchOverlay from './SearchOverlay';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pathname = usePathname();
  const dispatch = useDispatch();
  const { scrollY } = useScroll();

  // --- Optimized Redux Selection ---
  // shallowEqual ব্যবহার করলে অবজেক্টের ভেতরের ডাটা না বদলালে রি-রেন্ডার হবে না
  const { user, isAuthenticated } = useSelector((state) => state.auth, shallowEqual);

  // আলাদাভাবে সিলেক্ট করা ভালো যাতে একটির পরিবর্তনে অন্যটি অকারণে রেন্ডার না হয়
  const cartItems = useSelector((state) => state.cart?.cartItems || [], shallowEqual);
  const allProducts = useSelector((state) => state.products?.products || [], shallowEqual);

  // --- Memoized Search Results ---
  // এটি useSelector এর বাইরে useMemo দিয়ে করা উচিত যাতে পারফরম্যান্স ভালো থাকে
  const filteredProducts = useMemo(() => {
    if (!searchQuery || !allProducts.length) return [];
    return allProducts
      .filter((p) => p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, allProducts]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsCategoryOpen(false);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    // pathname বদলালে সব মেনু বন্ধ হবে
    setIsOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const categories = [
    { name: 'Smartphones', slug: 'smartphones', icon: <Smartphone size={18} /> },
    { name: 'Laptops', slug: 'laptops', icon: <Laptop size={18} /> },
    { name: 'Accessories', slug: 'accessories', icon: <Headphones size={18} /> },
    { name: 'Watches', slug: 'watches', icon: <Watch size={18} /> },
  ];

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-[100] w-full bg-card/80 backdrop-blur-2xl border-b border-border/50"
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="lg:hidden text-text p-1">
              <Menu size={26} />
            </button>
            <Link href="/" className="text-text font-black text-2xl tracking-tighter">
              MY<span className="text-primary italic"> GADGET</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link
              href="/"
              className={
                pathname === '/' ? 'text-primary' : 'text-text transition-colors hover:text-primary'
              }
            >
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 py-4 transition-colors ${
                  isCategoryOpen ? 'text-primary' : 'text-text'
                }`}
              >
                Categories{' '}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isCategoryOpen && (
                <div className="absolute top-[90%] left-0 w-64 bg-card border border-border rounded-3xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 hover:text-primary rounded-2xl transition-all font-bold"
                    >
                      <span className="text-primary">{cat.icon}</span> {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/shop"
              className={
                pathname === '/shop'
                  ? 'text-primary'
                  : 'text-text transition-colors hover:text-primary'
              }
            >
              Shop
            </Link>
            <Link
              href="/deals"
              className="flex items-center gap-1.5 text-primary italic hover:opacity-80 transition-opacity"
            >
              <Zap size={15} fill="currentColor" /> Hot Deals
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-white/5 rounded-2xl text-text hover:text-primary transition-all"
            >
              <Search size={22} />
            </button>

            <Link
              href="/cart"
              className="relative p-2.5 bg-white/5 rounded-2xl text-text hover:text-primary transition-all"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-bg text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-card">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link
                href="/auth"
                className="px-6 py-3 bg-primary max-md:hidden text-bg font-black text-xs uppercase rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
              >
                Login
              </Link>
            ) : (
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button className="flex items-center gap-2 p-1 bg-bg border border-border rounded-2xl pr-4 transition-all">
                  <div className="w-9 h-9 bg-primary text-bg rounded-xl flex items-center justify-center font-black">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} />
                </button>
                {isProfileOpen && (
                  <div className="absolute top-full right-0 w-60 bg-card border border-border mt-2 rounded-3xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/5 rounded-2xl font-bold text-[10px] uppercase mb-1"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl font-bold text-[10px] uppercase"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl font-bold text-[10px] uppercase"
                    >
                      <Package size={16} /> Orders
                    </Link>
                    <div className="my-1 border-t border-border/50" />
                    <button
                      onClick={() => dispatch(logoutUser())}
                      className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-2xl font-bold text-[10px] uppercase transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </motion.header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
        results={filteredProducts}
      />

      <MobileSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isAuthenticated={isAuthenticated}
        categories={categories}
        user={user}
        logout={() => dispatch(logoutUser())}
      />
    </>
  );
}
