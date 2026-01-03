'use client';
import React, { useState } from 'react';

export default function ProductGallery({ images, title, discount }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden p-8 flex items-center justify-center relative aspect-square group">
        {discount > 0 && (
          <div className="absolute top-8 left-8 bg-primary text-bg text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(41,252,86,0.3)] z-10">
            -{discount}% OFF
          </div>
        )}
        <img
          src={images[activeImg]?.url || '/placeholder.png'}
          alt={title}
          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImg(index)}
            className={`w-24 h-24 rounded-2xl border-2 shrink-0 p-2 bg-card transition-all ${
              activeImg === index ? 'border-primary' : 'border-border opacity-50'
            }`}
          >
            <img src={img.url} className="w-full h-full object-contain rounded-lg" alt="thumb" />
          </button>
        ))}
      </div>
    </div>
  );
}
