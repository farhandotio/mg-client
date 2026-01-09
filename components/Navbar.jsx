'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { logoutUser } from '@/store/features/authSlice';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
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
  LogIn,
} from 'lucide-react';

import Button from '@/components/Button';
import SearchOverlay from './SearchOverlay';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown বাইরে ক্লিক করলে বন্ধ করার জন্য Ref
  const categoryRef = useRef(null);
  const profileRef = useRef(null);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const { scrollY } = useScroll();

  const { user, isAuthenticated } = useSelector((state) => state.auth, shallowEqual);
  const cartItems = useSelector((state) => state.cart?.cartItems || [], shallowEqual);
  const allProducts = useSelector((state) => state.products?.products || [], shallowEqual);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        className="sticky top-0 z-100 w-full bg-card/80 backdrop-blur-2xl border-b border-border/50"
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="lg:hidden text-text p-1">
              <Menu size={26} />
            </button>
            <Link href="/" className="text-text font-black whitespace-nowrap text-2xl tracking-tighter">
              MY<span className="text-primary italic"> GADGET</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link
              href="/"
              className={
                pathname === '/' ? 'text-primary' : 'text-text transition-colors hover:text-primary'
              }
            >
              Home
            </Link>

            {/* Category Dropdown (Click Based) */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center gap-1.5 py-4 transition-colors ${
                  isCategoryOpen ? 'text-primary' : 'text-text'
                }`}
              >
                Categories{' '}
                <ChevronDown
                  size={14}
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
                    className="absolute top-[90%] left-0 w-64 bg-card border border-border rounded-3xl shadow-2xl p-2 z-50"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 hover:text-primary rounded-xl transition-all font-bold"
                      >
                        <span className="text-primary">{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
              href="/shop?productType=HotDeals"
              className="flex items-center gap-1.5 text-primary italic hover:opacity-80 transition-opacity"
            >
              <Zap size={15} fill="currentColor" /> Hot Deals
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-white/5 rounded-xl text-text hover:text-primary transition-all"
            >
              <Search size={22} />
            </button>

            <Link
              href="/cart"
              className="relative p-2.5 bg-white/5 rounded-xl text-text hover:text-primary transition-all"
            >
              <ShoppingCart size={22} />
              {mounted && cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-bg text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-card">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {!mounted ? (
              <div className="w-30 max-md:hidden h-11 border border-border bg-white/5 rounded-xl animate-pulse" />
            ) : !isAuthenticated ? (
              <div className="hidden md:block w-32">
                <Button text="Login" url="/auth" icon={LogIn} size="md" className="rounded-xl" />
              </div>
            ) : (
              <div className="relative hidden lg:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 p-1 bg-card border rounded-xl pr-4 transition-all ${
                    isProfileOpen ? 'border-primary' : 'border-primary/50'
                  }`}
                >
                  <div className="w-8 h-8 bg-primary text-bg rounded-lg flex items-center justify-center font-black text-xs">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-text">
                    {user?.fullname?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-pText transition-transform duration-300 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full right-0 w-60 bg-card border border-border mt-2 rounded-3xl shadow-2xl p-2 z-50"
                    >
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/5 rounded-xl font-bold text-[10px] uppercase mb-1"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-bold text-[10px] uppercase"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-bold text-[10px] uppercase"
                      >
                        <Package size={16} /> Orders
                      </Link>
                      <div className="my-1 border-t border-border/50" />
                      <button
                        onClick={() => dispatch(logoutUser())}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-[10px] uppercase transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </nav>
      </motion.header>

      {/* অন্যান্য মোডালগুলো */}
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
