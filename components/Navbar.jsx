'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { logoutUser } from '@/store/features/authSlice';
import { fetchCategories } from '@/store/features/categorySlice';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
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
} from 'lucide-react';

import SearchOverlay from './SearchOverlay';
import MobileSidebar from './MobileSidebar';
import Logo from './Logo';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState('dark');
  const categoryRef = useRef(null);
  const profileRef = useRef(null);

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
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
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
      setIsProfileOpen(false);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
    setIsCategoryOpen(false);
  }, [pathname]);

  if (isAdminPage || isAuthPage) return null;

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="sticky top-0 z-50 w-full bg-bg md:pt-3"
      >
        <div className="relative mx-auto">
          {/* Main Desktop Angled Layout */}
          <div className="hidden lg:grid grid-cols-16 items-center relative">
            {/* Left Wing (Angled Polygon Cutout) */}
            <div
              className="col-span-7 flex items-center gap-8 pl-8 pr-12 h-full bg-secondary text-sm font-medium tracking-widest uppercase text-white pb-3 pt-3"
              style={{
                clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0% 100%)',
              }}
            >
              <Link href="/shop" className="hover:text-white/90 transition-colors">
                SHOP
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1 hover:text-white/90 transition-colors uppercase"
                >
                  CATEGORIES
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}
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
                              <img src={cat.image.url} alt="" className="w-4 h-4 object-contain" />
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

            {/* Center Logo Area */}
            <div className="col-span-2 flex justify-center items-center h-full z-10 px-2 pb-3 pt-2">
              <Link href="/" className="scale-110 transition-transform hover:scale-115">
                <Logo width={45} height={45} useLink={false} />
              </Link>
            </div>

            {/* Right Wing (Angled Polygon Cutout) */}
            <div
              className="col-span-7 flex items-center justify-end gap-6 pr-8 pl-12 h-full bg-secondary text-sm font-medium tracking-widest uppercase text-white pb-3 pt-3"
              style={{
                clipPath: 'polygon(0 100%, 12% 0, 100% 0, 100% 100%)',
              }}
            >
              <Link href="/shop?season=true" className="hover:text-white/90 transition-colors">
                SEASONAL
              </Link>

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1 hover:text-white/90 transition-colors"
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
                  className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs whitespace-nowrap font-medium text-white transition-all hover:bg-slate-800"
                >
                  SIGN IN / UP
                </Link>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs whitespace-nowrap font-medium text-white transition-all"
                  >
                    <span className="uppercase">{user?.fullname?.split(' ')[0]}</span>
                    <ChevronDown size={10} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-slate-800 normal-case"
                      >
                        {user?.role === 'admin' && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-100 rounded-lg"
                          >
                            <LayoutDashboard size={14} /> Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-100 rounded-lg"
                        >
                          <User size={14} /> Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-100 rounded-lg"
                        >
                          <Package size={14} /> Orders
                        </Link>
                        <button
                          onClick={() => dispatch(logoutUser())}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cart Rounded Button */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
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

          {/* Mobile Fallback Navigation */}
          <div className="flex lg:hidden items-center justify-between py-3 bg-bg px-4 text-text">
            <Logo width={40} height={40} />
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSearchOpen(true)} className="p-1">
                <Search size={18} />
              </button>
              <Link href="/cart" className="relative p-2 bg-text rounded-full text-bg">
                <ShoppingCart size={15} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger text-[9px] flex items-center justify-center rounded-full text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-1 font-medium text-2xl">
                ☰
              </button>
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

      <MobileSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isAuthenticated={isAuthenticated}
        categories={dynamicCategories}
        user={user}
        logout={() => dispatch(logoutUser())}
      />
    </>
  );
}
