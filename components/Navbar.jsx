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
  Menu,
  Zap,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  LogIn,
  Box,
  Sun,
  Moon,
} from 'lucide-react';

import Button from '@/components/Button';
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
    const previous = scrollY.getPrevious();
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

  // কন্ডিশনাল রেন্ডারিং
  if (isAdminPage || isAuthPage) return null;

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="sticky top-0 z-100 w-full bg-card/60 backdrop-blur-3xl border-b max-md:py-2 border-bg/5 shadow-lg shadow-black/5"
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Logo width={110} height={40} />

            {/* --- ডেস্কটপ মেনু --- */}
            <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
              <Link
                href="/"
                className={`transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-text'}`}
              >
                হোম
              </Link>

              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`flex items-center gap-1.5 transition-colors hover:text-primary ${isCategoryOpen ? 'text-primary' : 'text-text'}`}
                >
                  ক্যাটাগরি
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-500 ${isCategoryOpen ? 'rotate-180' : '0'}`}
                  />
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute top-[120%] left-0 w-72 bg-card border border-bg/10 rounded-lg shadow-2xl p-3 z-50"
                    >
                      <div className="grid grid-cols-1 gap-1 max-h-100 overflow-y-auto no-scrollbar">
                        {dynamicCategories?.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/shop?category=${cat.slug}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-md transition-all group"
                          >
                            <div className="w-9 h-9 rounded-md bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-primary/10">
                              {cat.image?.url ? (
                                <img
                                  src={cat.image.url}
                                  alt=""
                                  className="w-5 h-5 object-contain"
                                />
                              ) : (
                                <Box size={18} />
                              )}
                            </div>
                            <span className="text-[12px] font-bold text-text group-hover:text-primary">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/shop"
                aria-label="View Shopping Page"
                className={`transition-colors hover:text-primary ${pathname === '/shop' ? 'text-primary' : 'text-text'}`}
              >
                শপ
              </Link>

              <Link
                aria-label="View Hot Deals Page"
                href="/shop?productType=HotDeals"
                className="flex items-center gap-1.5 text-secondary font-black italic hover:scale-105 transition-transform"
              >
                <Zap size={14} fill="currentColor" className="animate-pulse" /> হট ডিলস
              </Link>
            </div>
          </div>

          {/* --- ডানদিকের অ্যাকশন বাটনসমূহ --- */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              aria-label="Switch theme"
              onClick={toggleTheme}
              className="p-2 rounded-md text-text hover:bg-bg/10 transition-all"
            >
              {mounted &&
                (theme === 'dark' ? (
                  <Sun aria-label="Switch to Light Theme" size={18} className="text-yellow-500" />
                ) : (
                  <Moon aria-label="Switch to Dark Theme" size={18} className="text-primary" />
                ))}
            </button>

            <button
              aria-label="Search Products"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-md text-text hover:text-primary transition-all"
            >
              <Search size={18} />
            </button>

            <Link
              aria-label="View Shopping Cart"
              href="/cart"
              className="relative p-3 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-bg transition-all duration-300 group"
            >
              <ShoppingCart size={20} className="group-active:scale-75 transition-transform" />
              {mounted && cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-bg text-[12px] font-black w-5 h-5 rounded-full flex items-center justify-center ">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              aria-label="View Mobile Menu"
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 text-text ml-1"
            >
              <Menu size={24} />
            </button>

            {/* --- প্রোফাইল মেনু --- */}
            {!mounted ? (
              <div className="w-24 h-10 bg-bg/5 rounded-md animate-pulse hidden md:block" />
            ) : !isAuthenticated ? (
              <div className="hidden md:block">
                <Button
                  arialabel="login"
                  text="প্রবেশ করুন"
                  url="/auth"
                  icon={LogIn}
                  size="md"
                  className="rounded-md font-bold"
                />
              </div>
            ) : (
              <div className="relative hidden lg:block" ref={profileRef}>
                <button
                  aria-label="View Profile Menu"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 bg-bg/5 border border-bg/5 rounded-md hover:border-primary/30 transition-all pl-2 pr-3"
                >
                  <div className="w-8 h-8 bg-primary text-bg rounded-md flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-widest text-text">
                    {user?.fullname?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : '0'}`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute top-[120%] right-0 w-60 bg-card/95 backdrop-blur-3xl border border-bg/10 rounded-lg shadow-2xl p-2 z-50"
                    >
                      {user?.role === 'admin' && (
                        <Link
                          aria-label="View Admin Dashboard"
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/5 rounded-md font-black text-[12px] uppercase mb-1"
                        >
                          <LayoutDashboard size={16} /> ড্যাশবোর্ড
                        </Link>
                      )}
                      <Link
                        aria-label="View Profile Page"
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-bg/5 rounded-md font-black text-[12px] uppercase"
                      >
                        <User size={16} /> প্রোফাইল
                      </Link>
                      <Link
                        aria-label="View orders Page"
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-bg/5 rounded-md font-black text-[12px] uppercase"
                      >
                        <Package size={16} /> অর্ডারসমূহ
                      </Link>
                      <div className="my-2 border-t border-bg/5" />
                      <button
                        aria-label="Logout"
                        onClick={() => dispatch(logoutUser())}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-md font-black text-[12px] uppercase transition-colors"
                      >
                        <LogOut size={16} /> লগআউট
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        categories={dynamicCategories}
        user={user}
        logout={() => dispatch(logoutUser())}
      />
    </>
  );
}
