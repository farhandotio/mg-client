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

  // জুম লজিক
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
    <div className="w-full flex flex-col-reverse md:flex-row gap-4">
      <div
        className={`
        flex md:flex-col gap-2 
        overflow-x-auto md:overflow-y-auto no-scrollbar 
        w-full md:w-18 lg:w-23 
        h-auto md:h-100 lg:h-125 
        shrink-0
      `}
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImg(index)}
            className={`
              relative shrink-0 
              w-15 h-15 md:w-full md:h-auto md:aspect-square 
              rounded-xl overflow-hidden border-2 transition-all duration-300
              ${
                activeImg === index
                  ? 'border-primary opacity-100 ring-2 ring-primary/20'
                  : 'border-bg/5 opacity-60 hover:opacity-100 hover:border-bg/20'
              }
            `}
          >
            <Image
              src={img?.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 120px"
            />
          </button>
        ))}
      </div>

      {/* --- ২. মেইন ডিসপ্লে এরিয়া (Right Side) --- */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
        className={`
          flex-1 relative aspect-square md:aspect-auto md:h-110 lg:h-123 
          bg-card/40 border border-border/40 rounded-2xl overflow-hidden 
          group/gallery shadow-2xl cursor-crosshair
        `}
      >
        {/* ডেকোরেশন কর্নার */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl pointer-events-none z-10" />

        {/* ব্যাজসমূহ */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-1.5"
            >
              <span className="bg-primary text-bg text-[10px] font-black px-3 py-1 rounded-md italic uppercase clip-path-tag-gallery shadow-[0_0_15px_rgba(41,252,86,0.3)]">
                {discount}% ছাড়
              </span>
              <div className="bg-text/60 backdrop-blur-md border border-bg/10 text-bg text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 w-fit">
                <Box size={10} className="text-primary" /> নিরাপদ প্যাকিং
              </div>
            </motion.div>
          )}
        </div>

        {/* ফুলস্ক্রিন বাটন */}
        <button
          aria-label="Full Screen"
          onClick={() => setIsFullScreen(true)}
          className="absolute top-5 right-5 z-20 p-3 bg-text/40 backdrop-blur-md border border-bg/10 rounded-xl text-bg md:opacity-0 md:group-hover/gallery:opacity-100 transition-all active:scale-90 hover:bg-bg/10"
        >
          <Maximize2 size={18} />
        </button>

        {/* নেভিগেশন এরোজ (ডেস্কটপে ইমেজের উপর) */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-30 opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            className="p-3 bg-text/60 backdrop-blur-xl rounded-xl border border-bg/10 text-bg hover:bg-primary hover:text-bg transition-all shadow-xl pointer-events-auto active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            className="p-3 bg-text/60 backdrop-blur-xl rounded-xl border border-bg/10 text-bg hover:bg-primary hover:text-bg transition-all shadow-xl pointer-events-auto active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* মেইন ইমেজ */}
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]?.url}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
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

          {/* জুম ইফেক্ট লেয়ার */}
          {zoomPos.show && (
            <div
              className="absolute inset-0 pointer-events-none transition-transform duration-150 ease-out"
              style={{
                backgroundImage: `url(${images[activeImg]?.url})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>

        {/* গ্রেডিয়েন্ট শ্যাডো */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* --- ফুলস্ক্রিন পোর্টাল --- */}
      {mounted &&
        isFullScreen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-text/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-6 right-6 p-3 bg-bg/5 hover:bg-red-500 text-bg rounded-full transition-all border border-bg/10"
            >
              <X size={24} />
            </button>

            <div className="relative w-full max-w-5xl aspect-square md:aspect-video h-[80vh]">
              <img
                src={images[activeImg]?.url}
                className="w-full h-full object-contain"
                alt="Full View"
              />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                <button
                  onClick={prevImg}
                  className="p-4 bg-text/50 rounded-full text-bg hover:bg-primary hover:text-black transition-all"
                >
                  <ChevronLeft size={30} />
                </button>
                <button
                  onClick={nextImg}
                  className="p-4 bg-text/50 rounded-full text-bg hover:bg-primary hover:text-black transition-all"
                >
                  <ChevronRight size={30} />
                </button>
              </div>
            </div>

            {/* ফুলস্ক্রিন মোডে নিচে থাম্বনেইল */}
            <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-full px-4 no-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImg === index
                      ? 'border-primary opacity-100'
                      : 'border-bg/20 opacity-50'
                  }`}
                >
                  <Image src={img?.url} fill className="object-cover" alt="thumb" />
                </button>
              ))}
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
