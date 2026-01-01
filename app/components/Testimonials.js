'use client';
import React from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Testimonials() {
  // স্ক্রিনশট অনুযায়ী ডাইনামিক রিভিউ ডাটা
  const reviews = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Tech Enthusiast',
      initials: 'SC',
      comment:
        'My Gadget has the best selection of premium electronics. Fast shipping and amazing customer service!',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-text tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-pText text-lg font-medium">
            Join thousands of satisfied tech enthusiasts
          </p>
        </div>

        {/* Testimonial Card Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Card */}
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden group">
            {/* Background Quote Icon (Large) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Quote size={80} className="text-primary rotate-180 fill-primary" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              {/* Review Text */}
              <p className="text-text text-xl md:text-2xl font-medium leading-relaxed italic">
                "{reviews[0].comment}"
              </p>

              {/* User Profile Info */}
              <div className="flex flex-col items-center gap-4">
                {/* Avatar Circle with Initials */}
                <div className="w-16 h-16 rounded-full bg-[#00A3FF] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(0,163,255,0.3)]">
                  {reviews[0].initials}
                </div>

                <div>
                  <h4 className="text-text font-bold text-lg">{reviews[0].name}</h4>
                  <p className="text-pText text-sm font-bold uppercase tracking-widest opacity-60">
                    {reviews[0].role}
                  </p>
                </div>
              </div>

              {/* Star Rating (Neon Green) */}
              <div className="flex gap-1.5">
                {[...Array(reviews[0].rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-primary fill-primary drop-shadow-[0_0_8px_rgba(41,252,86,0.5)]"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Slider Controls & Pagination */}
          <div className="mt-12 flex flex-col items-center gap-8">
            {/* Dots */}
            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-[#00A3FF] shadow-[0_0_10px_rgba(0,163,255,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-border transition-colors hover:bg-pText/30 cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-border transition-colors hover:bg-pText/30 cursor-pointer"></div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-2xl border border-border bg-card flex items-center justify-center text-text hover:border-primary transition-all active:scale-90 shadow-xl">
                <ChevronLeft size={20} />
              </button>
              <button className="w-12 h-12 rounded-2xl border border-border bg-card flex items-center justify-center text-text hover:border-primary transition-all active:scale-90 shadow-xl">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
