'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

export default function ProductGallery({ images = [], title, discount }) {
  const [activeImg, setActiveImg] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const nextImg = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

  // কী-বোর্ড সাপোর্ট (অ্যারো কি দিয়ে ইমেজ চেঞ্জ)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImg]);

  return (
    <div className="w-full">
      {/* --- Main Gallery Container --- */}
      <div className="relative aspect-4/5 sm:aspect-square w-full bg-card/30 border border-border/50 rounded-3xl sm:rounded-[3rem] overflow-hidden group backdrop-blur-sm shadow-2xl">
        {/* Top Overlay: Discount & Expand */}
        <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 z-20 flex justify-between items-start pointer-events-none">
          {discount > 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-primary text-bg text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl pointer-events-auto"
            >
              {discount}% OFF
            </motion.div>
          )}

          <button
            onClick={() => setIsFullScreen(true)}
            className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:bg-primary hover:text-bg transition-all duration-500 pointer-events-auto active:scale-90"
          >
            <Expand size={20} />
          </button>
        </div>

        {/* Desktop Only: Hover Visible Navigation Arrows */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 hidden md:flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={prevImg}
            className="p-5 bg-bg/60 backdrop-blur-xl rounded-2xl border border-border/50 hover:bg-primary hover:text-bg transition-all group/btn"
          >
            <ChevronLeft
              size={28}
              className="group-hover/btn:-translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={nextImg}
            className="p-5 bg-bg/60 backdrop-blur-xl rounded-2xl border border-border/50 hover:bg-primary hover:text-bg transition-all group/btn"
          >
            <ChevronRight
              size={28}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Main Image View */}
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              src={images[activeImg]?.url || '/placeholder.png'}
              alt={title}
              className="w-full h-full object-cover select-none"
              // সোয়াইপ লজিক
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) nextImg();
                if (info.offset.x > 50) prevImg();
              }}
            />
          </AnimatePresence>
        </div>

        {/* Bottom Indicators */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex flex-col items-center gap-4">
          <div className="flex gap-2 bg-bg/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImg(index)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  activeImg === index
                    ? 'w-8 bg-primary shadow-[0_0_10px_#29fc56]'
                    : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* --- Full-Screen Modal (Expand functionality) --- */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 bg-bg/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-red-500/20 rounded-full text-white transition-all z-1000"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl aspect-square md:aspect-auto md:h-[80vh] flex items-center justify-center">
              {/* Modal Nav */}
              <button
                onClick={prevImg}
                className="absolute left-0 p-4 text-white/50 hover:text-primary transition-all"
              >
                <ChevronLeft size={48} />
              </button>

              <motion.img
                key={activeImg}
                layoutId="expandImg"
                src={images[activeImg]?.url}
                className="max-w-full max-h-full object-contain rounded-3xl"
              />

              <button
                onClick={nextImg}
                className="absolute right-0 p-4 text-white/50 hover:text-primary transition-all"
              >
                <ChevronRight size={48} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
