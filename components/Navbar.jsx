'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
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
  const router = useRouter();
  const dispatch = useDispatch();
  const { scrollY } = useScroll();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { allProducts = [] } = useSelector((state) => state.products || {});

  const filteredProducts = searchQuery
    ? allProducts
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

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
    window.scrollTo(0, 0);
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
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          type: 'tween',
        }}
        className="sticky top-0 z-100 w-full bg-card/80 backdrop-blur-2xl border-b border-border/50"
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="lg:hidden text-text">
              <Menu size={26} />
            </button>
            <Link
              href="/"
              className="text-text font-black text-2xl md:text-2xl tracking-tighter mt-1"
            >
              MY<span className="text-primary italic"> GADGET</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link href="/" className={pathname === '/' ? 'text-primary' : 'text-text'}>
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 py-4 ${isCategoryOpen ? 'text-primary' : ''}`}
              >
                Categories <ChevronDown size={14} />
              </button>
              {isCategoryOpen && (
                <div className="absolute top-[80%] left-0 w-64 bg-card border border-border rounded-3xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-4 px-4 py-4 hover:bg-card hover:text-primary rounded-2xl transition-all font-bold"
                    >
                      <span className="text-primary">{cat.icon}</span> {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/shop" className={pathname === '/shop' ? 'text-primary' : 'text-text'}>
              Shop
            </Link>
            <Link href="/deals" className="flex items-center gap-1.5 text-primary italic">
              <Zap size={15} fill="currentColor" /> Hot Deals
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-white/5 rounded-2xl text-text hover:text-primary transition-all"
            >
              <ShoppingCart size={22} className="hidden invisible" />
              <Smartphone size={22} className="hidden invisible" />
              <Watch size={22} className="hidden invisible" />
              <Search size={22} />
            </button>

            <Link href="/cart" className="relative p-2.5 bg-white/5 rounded-2xl text-text">
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
                className="px-4 py-3 bg-primary max-md:hidden text-bg font-black text-xs uppercase rounded-2xl shadow-lg"
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
                  <div className="w-9 h-9 bg-card rounded-xl flex items-center justify-center text-text font-black">
                    {user?.fullname?.charAt(0)}
                  </div>
                  <ChevronDown size={14} />
                </button>
                {isProfileOpen && (
                  <div className="absolute top-full right-0 w-60 bg-card border border-border mt-1 rounded-3xl shadow-2xl p-2">
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 bg-card text-primary rounded-2xl font-bold text-[10px] uppercase mb-1"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 rounded-2xl font-bold text-[10px] uppercase"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 rounded-2xl font-bold text-[10px] uppercase"
                    >
                      <Package size={16} /> Orders
                    </Link>
                    <button
                      onClick={() => dispatch(logoutUser())}
                      className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-2xl font-bold text-[10px] uppercase"
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
      />
    </>
  );
}
