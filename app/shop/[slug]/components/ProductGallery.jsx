'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Box } from 'lucide-react';
import Image from 'next/image';

export default function ProductGallery({ images = [], title, discount }) {
  const [activeImg, setActiveImg] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // জুম ইফেক্টের জন্য স্টেট এবং রেফ
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (isFullScreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  // হোভার জুম লজিক
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const nextImg = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

  const onDragEnd = (e, { offset }) => {
    if (offset.x > 50) prevImg();
    else if (offset.x < -50) nextImg();
  };

  if (!images?.length)
    return (
      <div className="aspect-square bg-card/20 rounded-3xl animate-pulse border border-border/20" />
    );

  return (
    <div className="w-full space-y-4">
      {/* --- Main Display Area --- */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
        className="relative aspect-square w-full bg-card/40 border border-border/40 rounded-3xl overflow-hidden group/gallery shadow-2xl cursor-crosshair"
      >
        {/* Cyberpunk Decor Corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-3xl pointer-events-none z-10" />

        {/* --- Floating Badges --- */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-1.5"
            >
              <span className="bg-primary text-bg text-[10px] font-black px-3 py-1 rounded-md italic uppercase clip-path-tag-gallery shadow-[0_0_15px_rgba(41,252,86,0.3)]">
                -{discount}% OFF
              </span>
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 w-fit">
                <Box size={10} className="text-primary" /> SECURE_PACK
              </div>
            </motion.div>
          )}
        </div>

        {/* Fullscreen Trigger */}
        <button
          aria-label="zoom"
          onClick={() => setIsFullScreen(true)}
          className="absolute top-5 right-5 z-20 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white md:opacity-0 md:group-hover/gallery:opacity-100 transition-all active:scale-90"
        >
          <Maximize2 size={18} />
        </button>

        {/* Desktop Nav Buttons */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 hidden md:flex justify-between z-30 opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 pointer-events-none">
          <button
            aria-label="previous side"
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            className="p-3 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 text-white hover:bg-primary hover:text-bg transition-all shadow-xl pointer-events-auto"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="next side"
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            className="p-3 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 text-white hover:bg-primary hover:text-bg transition-all shadow-xl pointer-events-auto"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Main Image & Zoom Layer */}
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]?.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              className={`w-full h-full object-cover select-none transition-opacity duration-300 ${
                zoomPos.show ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </AnimatePresence>

          {/* Zoomed Image Layer (শুধুমাত্র হোভার করলে দেখাবে) */}
          {zoomPos.show && (
            <div
              className="absolute inset-0 pointer-events-none transition-transform duration-150 ease-out"
              style={{
                backgroundImage: `url(${images[activeImg]?.url})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '250%', // ২.৫ গুণ জুম
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Pagination Dots */}
        <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              aria-label="active image"
              key={index}
              onClick={() => setActiveImg(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeImg === index ? 'w-8 bg-primary' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- Thumbnails Area --- */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {images.map((img, index) => (
          <button
            aria-label="active image set"
            key={index}
            onClick={() => setActiveImg(index)}
            className={`relative min-w-17.5 h-17.5 md:min-w-21.5 md:h-21.5 rounded-xl overflow-hidden border-2 transition-all ${
              activeImg === index
                ? 'border-primary shadow-[0_0_10px_rgba(41,252,86,0.3)]'
                : 'border-white/5 opacity-50 hover:opacity-100'
            }`}
          >
            <Image
              src={img?.url}
              alt={'Product Image'}
              width={400}
              height={400}
              loading="lazy"
              className="w-full h-auto object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {activeImg === index && (
              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* --- Fullscreen Portal --- */}
      {mounted &&
        isFullScreen &&
        createPortal(
          <div className="fixed inset-0 z-9999 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
            <button
              aria-label="close full screen"
              onClick={() => setIsFullScreen(false)}
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-red-500 text-white rounded-full transition-all border border-white/10"
            >
              <X size={24} />
            </button>

            <div className="relative w-full max-w-4xl aspect-square">
              <img
                src={images[activeImg]?.url}
                className="w-full h-full object-contain rounded-2xl"
                alt="fullscreen"
              />

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                <button
                  aria-label="prev image"
                  onClick={prevImg}
                  className="p-4 text-white/40 hover:text-primary transition-all"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  aria-label="next image"
                  onClick={nextImg}
                  className="p-4 text-white/40 hover:text-primary transition-all"
                >
                  <ChevronRight size={40} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>{`
        .clip-path-tag-gallery {
          clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
