'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { logoutUser } from '@/store/features/authSlice';
import { fetchCategories } from '@/store/features/categorySlice';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Home,
  ShoppingCart,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  LogIn,
  Box,
  Sun,
  Moon,
  Lock,
  User2Icon,
  
} from 'lucide-react';

import SearchOverlay from './SearchOverlay';
import Logo from './Logo';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState('dark');
  const categoryRef = useRef(null);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const { scrollY } = useScroll();

  const { user, isAuthenticated } = useSelector((state) => state.auth, shallowEqual);
  const cartItems = useSelector((state) => state.cart?.cartItems || [], shallowEqual);
  const allProducts = useSelector((state) => state.products?.products || [], shallowEqual);
  const { categories: dynamicCategories } = useSelector((state) => state.categories);

  const isAuthPage = pathname === '/auth';
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    if (!dynamicCategories?.length) {
      dispatch(fetchCategories());
    }

    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target))
        setIsCategoryOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch, dynamicCategories?.length]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery || !allProducts.length) return [];
    return allProducts
      .filter((p) => p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, allProducts]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsCategoryOpen(false);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    setIsSearchOpen(false);
    setIsCategoryOpen(false);
  }, [pathname]);

  if (isAdminPage || isAuthPage) return null;

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 z-50 w-full bg-bg pt-2 md:pt-3"
      >
        <div className="relative mx-auto">
          {/* Main Angled Layout (Desktop and Mobile) */}
          <div className="grid grid-cols-12 lg:grid-cols-16 items-center relative z-20">
            {/* Left Wing (Angled Polygon Cutout) */}
            <div
              className="col-span-0 lg:col-span-7 flex items-center gap-8 pl-4 lg:pl-8 pr-6 lg:pr-12 h-14 md:h-14 bg-secondary text-sm font-medium tracking-widest uppercase text-white py-3"
              style={{
                clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0% 100%)',
              }}
            >
              <div className="hidden lg:flex items-center gap-8">
                <Link href="/shop" className="hover:text-white/90 transition-colors">
                  SHOP
                </Link>

                {/* Categories Dropdown */}
                <div className="relative z-30" ref={categoryRef}>
                  <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex items-center gap-1 hover:text-white/90 transition-colors uppercase"
                  >
                    CATEGORIES
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${
                        isCategoryOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 left-0 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 normal-case"
                      >
                        <div className="max-h-72 overflow-y-auto">
                          {dynamicCategories?.map((cat) => (
                            <Link
                              key={cat._id}
                              href={`/shop?category=${cat.slug}`}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-all"
                            >
                              {cat.image?.url ? (
                                <img
                                  src={cat.image.url}
                                  alt=""
                                  className="w-4 h-4 object-contain"
                                />
                              ) : (
                                <Box size={14} className="text-slate-500" />
                              )}
                              <span className="text-xs font-medium text-slate-800">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/shop?gender=men" className="hover:text-white/90 transition-colors">
                  MEN
                </Link>
                <Link href="/shop?gender=women" className="hover:text-white/90 transition-colors">
                  WOMEN
                </Link>
                <Link
                  href="/shop?productType=HotDeals"
                  className="hover:text-white/90 transition-colors"
                >
                  TRENDING
                </Link>
              </div>
            </div>

            {/* Center Logo Area */}
            <div className="col-span-3 lg:col-span-2 flex justify-center items-center h-full z-30">
              <Link
                href="/"
                className="scale-100 md:scale-110 transition-transform hover:scale-115"
              >
                <Logo width={40} height={40} useLink={false} />
              </Link>
            </div>

            {/* Right Wing (Angled Polygon Cutout) */}
            <div
              className="col-span-8 lg:col-span-7 flex items-center justify-end gap-3 lg:gap-6 pr-4 lg:pr-8 pl-6 lg:pl-12 h-14 md:h-14 bg-secondary text-sm font-medium tracking-widest uppercase text-white z-30 py-3"
              style={{
                clipPath: 'polygon(0 100%, 12% 0, 100% 0, 100% 100%)',
              }}
            >
              {/* Desktop Menu */}
              <div className="flex items-center gap-3 lg:gap-6">
                <Link
                  href="/shop?season=true"
                  className="max-md:hidden hover:text-white/90 transition-colors"
                >
                  SEASONAL
                </Link>

                {/* Search Toggle */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 hover:text-white/90 transition-colors max-md:hidden"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>

                {/* Theme Toggle */}
                <button
                  aria-label="Switch theme"
                  onClick={toggleTheme}
                  className="p-1 hover:text-white/90 transition-colors"
                >
                  {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
                </button>

                {/* Auth / Profile Pill */}
                {!mounted ? (
                  <div className="w-20 h-8 rounded-full bg-slate-300 animate-pulse" />
                ) : !isAuthenticated ? (
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs whitespace-nowrap font-medium text-white transition-all hover:bg-black/95"
                  >
                    SIGN IN / UP
                  </Link>
                ) : (
                  <Link
                    href={user?.role === 'admin' ? '/admin/dashboard' : '/profile'}
                    className="flex items-center gap-2 rounded-full bg-black md:px-5 p-3 text-xs whitespace-nowrap font-medium text-white transition-all hover:bg-black/95"
                  >
                    <span className="uppercase max-md:hidden">{user?.fullname?.split(' ')[0]}</span>
                    <User2Icon size={15} />
                  </Link>
                )}

                {/* Cart Rounded Button */}
                <Link
                  href="/cart"
                  aria-label="Shopping Cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105 max-md:hidden"
                >
                  <Lock size={13} />
                  {mounted && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[9px] font-medium text-white">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
        results={filteredProducts}
      />

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <Link href="/" className="flex flex-col items-center gap-1 text-[11px] text-text">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center gap-1 text-[11px] text-text">
            <Package size={20} />
            <span>Shop</span>
          </Link>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 text-[11px] text-text"
          >
            <Search size={20} />
            <span>Search</span>
          </button>
          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1 text-[11px] text-text"
          >
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] text-white">
                {cartItems.length}
              </span>
            )}
            <span>Cart</span>
          </Link>
          <Link
            href={
              isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/profile') : '/auth'
            }
            className="flex flex-col items-center gap-1 text-[11px] text-text"
          >
            <User size={20} />
            <span>
              {isAuthenticated ? (user?.role === 'admin' ? 'Admin' : 'Profile') : 'Login'}
            </span>
          </Link>
        </div>
      </div>
      <div className="h-17" aria-hidden="true" />
    </>
  );
}
