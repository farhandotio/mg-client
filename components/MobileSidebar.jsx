'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Box, ArrowRight, Zap } from 'lucide-react';
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
              ease: [0.22, 1, 0.36, 1],
            }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-card border-l border-border/50 z-120 p-6 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <Logo width={120} height={55} />
              <button
                aria-label="Close Mobile Sidebar"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-md text-primary active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-6 flex-1 overflow-y-auto no-scrollbar pb-2">
              <Link
                aria-label="View Home Page"
                href="/"
                onClick={onClose}
                className="text-2xl font-black italic tracking-tighter uppercase leading-none text-text"
              >
                হোম
              </Link>
              <Link
                aria-label="View Shop Page"
                href="/shop"
                onClick={onClose}
                className="text-2xl font-black italic tracking-tighter uppercase leading-none text-text"
              >
                শপ
              </Link>
              <Link
                aria-label="View Hot Deals Page"
                href="/shop?productType=HotDeals"
                onClick={onClose}
                className="text-2xl font-black italic tracking-tighter uppercase leading-none text-primary flex items-center gap-2"
              >
                ডিলস <Zap size={30} fill="currentColor" />
              </Link>

              {/* Dynamic Categories Section */}
              <div className="space-y-4 pt-3 border-t border-border/50">
                <p className="text-[12px] font-black uppercase text-pText/50 tracking-[0.3em]">
                  ক্যাটাগরি সমূহ
                </p>
                <div className="grid gap-3">
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        aria-label={`View ${cat.name} Category`}
                        key={cat._id || cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={onClose}
                        className="group flex items-center justify-between py-2 transition-all active:text-primary"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md bg-card border border-border/50 flex items-center justify-center text-primary overflow-hidden shadow-inner">
                            {cat.image?.url ? (
                              <img
                                src={cat.image.url}
                                alt={cat.name}
                                className="w-full h-full object-cover p-1.5"
                              />
                            ) : (
                              <Box size={18} />
                            )}
                          </div>
                          <span className="font-bold text-sm tracking-tight text-text whitespace-nowrap">
                            {cat.name}
                          </span>
                        </div>
                        <span className="w-full h-0.5 mx-4 bg-primary/10" />
                        <span>
                          <ArrowRight
                            size={14}
                            className="text-primary opacity-40 group-hover:opacity-100 transition-all"
                          />
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="py-4 text-[12px] font-black uppercase opacity-20 italic">
                      লোড হচ্ছে...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-6 border-t border-border/50">
              <Link
                aria-label="View Profile or Login"
                href={
                  !isAuthenticated
                    ? '/auth'
                    : user?.role === 'admin'
                      ? '/admin/dashboard'
                      : '/profile'
                }
                onClick={onClose}
                className="flex items-center gap-3 p-5 bg-primary text-bg rounded-md font-black justify-center shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] uppercase text-[11px] tracking-widest active:scale-95 transition-all"
              >
                <User size={18} />
                {!isAuthenticated
                  ? 'লগইন করুন'
                  : user?.role === 'admin'
                    ? 'অ্যাডমিন ড্যাশবোর্ড'
                    : 'প্রোফাইল দেখুন'}
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
