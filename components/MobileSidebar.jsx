'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Box, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

export default function MobileSidebar({ isOpen, onClose, isAuthenticated, categories, user }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-bg/80 backdrop-blur-md lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1], // Smooth professional transition
            }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-card border-l border-border/50 z-120 p-6 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <Logo width={120} height={35} />
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl text-primary active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar pb-6">
              <Link
                href="/"
                onClick={onClose}
                className="text-4xl font-black italic tracking-tighter uppercase leading-none"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-4xl font-black italic tracking-tighter uppercase leading-none"
              >
                Shop
              </Link>
              <Link
                href="/shop?productType=HotDeals"
                onClick={onClose}
                className="text-4xl font-black italic tracking-tighter uppercase leading-none text-primary"
              >
                Hot Deals
              </Link>

              {/* Dynamic Categories Section */}
              <div className="mt-6 space-y-4 pt-8 border-t border-border/50">
                <p className="text-[10px] font-black uppercase text-pText tracking-[0.3em]">
                  Module_Registry
                </p>
                <div className="grid gap-3">
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat._id || cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={onClose}
                        className="group flex items-center justify-between p-4 bg-bg/50 border border-border/50 rounded-2xl transition-all active:bg-primary/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center text-primary overflow-hidden">
                            {cat.image?.url ? (
                              <img
                                src={cat.image.url}
                                alt=""
                                className="w-full h-full object-cover p-1.5"
                              />
                            ) : (
                              <Box size={18} />
                            )}
                          </div>
                          <span className="font-bold text-sm uppercase tracking-tight">
                            {cat.name}
                          </span>
                        </div>
                        <ArrowRight
                          size={14}
                          className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        />
                      </Link>
                    ))
                  ) : (
                    <div className="py-4 text-[10px] font-black uppercase opacity-20 italic">
                      Scanning for sectors...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Action Button */}
            <div className="pt-6 border-t border-border/50">
              <Link
                href={
                  !isAuthenticated
                    ? '/auth'
                    : user?.role === 'admin'
                    ? '/admin/dashboard'
                    : '/profile'
                }
                onClick={onClose}
                className="flex items-center gap-3 p-5 bg-primary text-bg rounded-3xl font-black justify-center shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all"
              >
                <User size={18} />
                {!isAuthenticated
                  ? 'Initialize Login'
                  : user?.role === 'admin'
                  ? 'System Dashboard'
                  : 'User Account'}
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
