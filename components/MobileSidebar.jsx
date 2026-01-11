'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

export default function MobileSidebar({ isOpen, onClose, isAuthenticated, categories, user }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-110 bg-bg/80 backdrop-blur-md lg:hidden"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
              type: 'tween',
            }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 w-[85%] max-w-xs h-full bg-card border-l border-border z-120 p-6 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <Logo width={140} height={40} />
              <button onClick={onClose} className="p-2 bg-primary/10 rounded-xl text-primary">
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-6 flex-1 overflow-y-auto no-scrollbar">
              <Link href="/" className="text-3xl font-black">
                Home
              </Link>
              <Link href="/shop" className="text-3xl font-black">
                Shop All
              </Link>
              <Link href="/shop?productType=HotDeals" className="text-3xl font-black text-primary">
                Hot Deals
              </Link>

              <div className="space-y-4 pt-4 border-t border-border">
                <p className="text-[10px] font-black uppercase text-pText tracking-widest">
                  Categories
                </p>
                <div className="grid gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-4 p-4 bg-bg rounded-2xl border border-border font-bold"
                    >
                      <span className="text-primary">{cat.icon}</span> {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={!isAuthenticated ? '/auth' : user?.role === 'admin' ? '/admin/dashboard' : '/profile'}
              className="mt-6 flex items-center gap-3 p-4 bg-primary text-bg rounded-2xl font-black justify-center shadow-lg uppercase text-xs tracking-widest"
            >
              <User size={20} />
              {!isAuthenticated ? 'Login Now' : user?.role === 'admin' ? 'Dashboard' : 'My Account'}
            </Link>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
