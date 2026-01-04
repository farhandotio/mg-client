'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X, Tag } from 'lucide-react';

export default function ProductGallery({ images = [], title, discount, price }) {
  const [activeImg, setActiveImg] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const nextImg = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

  // Swipe handling for mobile
  const onDragEnd = (e, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) > 50;
    if (swipe && offset.x > 0) prevImg();
    else if (swipe && offset.x < 0) nextImg();
  };

  if (!images?.length)
    return (
      <div className="aspect-square bg-card/20 rounded-[2.5rem] animate-pulse border border-border/20" />
    );

  return (
    <div className="w-full group/gallery">
      {/* --- Main Display --- */}
      <div className="relative aspect-4/5 sm:aspect-square w-full bg-card/30 border border-border/40 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        {/* Advanced Discount Badge */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none">
          {discount > 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col gap-1"
            >
              <div className="bg-primary text-bg text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-[0_0_20px_rgba(41,252,86,0.4)] flex items-center gap-2">
                <Tag size={12} strokeWidth={3} /> SAVE {discount}%
              </div>
              <div className="bg-bg/40 backdrop-blur-md border border-white/5 text-white text-[11px] font-bold px-3 py-1 rounded-lg italic text-center">
                ONLY ${price?.discounted}
              </div>
            </motion.div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
          <button
            onClick={() => setIsFullScreen(true)}
            className="p-3.5 bg-bg/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-primary hover:text-bg transition-all active:scale-90 shadow-2xl"
          >
            <Expand size={20} />
          </button>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 hidden md:flex justify-between z-30 opacity-0 group-hover/gallery:opacity-100 transition-all duration-500">
          <button
            onClick={prevImg}
            className="p-4 bg-bg/60 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-primary hover:text-bg transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImg}
            className="p-4 bg-bg/60 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-primary hover:text-bg transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Main Image with Drag/Swipe support */}
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]?.url}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              className="w-full h-full object-cover select-none"
            />
          </AnimatePresence>
        </div>

        {/* Minimal Bullet Pagination (Replacement for Thumbnails) */}
        <div className="absolute bottom-8 inset-x-0 z-30 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImg(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeImg === index
                  ? 'w-8 bg-primary shadow-[0_0_10px_#29fc56]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Dark linear Bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* --- Fullscreen Portal --- */}
      {mounted &&
        isFullScreen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-1000 bg-bg/95 backdrop-blur-3xl flex items-center justify-center p-4"
            >
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute top-6 right-6 p-4 bg-white/5 hover:bg-red-500 text-white rounded-full transition-all z-1010 border border-white/10"
              >
                <X size={30} />
              </button>

              <div className="relative w-full h-full flex items-center justify-center">
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  src={images[activeImg]?.url}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />

                {/* Fullscreen Nav */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button
                    onClick={prevImg}
                    className="p-4 text-white/20 hover:text-primary transition-all pointer-events-auto"
                  >
                    <ChevronLeft size={50} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="p-4 text-white/20 hover:text-primary transition-all pointer-events-auto"
                  >
                    <ChevronRight size={50} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
