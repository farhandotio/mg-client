'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

export default function FeatureShowcaseSection() {
  const leftContentRef = useRef(null);
  const rightCardRef = useRef(null);
  const leftInView = useInView(leftContentRef, { once: true, amount: 0.25 });
  const rightInView = useInView(rightCardRef, { once: true, amount: 0.25 });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg">
      {/* Dark Outer Container */}
      <div className="relative w-full bg-pText p-4 md:p-8 lg:p-12 text-bg shadow-2xl">
        {/* Main Section Heading */}
        <h2 className="max-w-3xl text-3xl font-medium leading-tight tracking-tight text-bg sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          Unmatched quality, smart features, and innovative technologies
        </h2>

        {/* Content Layout Grid */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          {/* Left Column (Icon, Text, Controls & Small Image) */}
          <motion.div
            ref={leftContentRef}
            initial={{ opacity: 0, x: -40 }}
            animate={leftInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col justify-between space-y-8 lg:col-span-5"
          >
            <div className="space-y-6">
              {/* Speaker Icon & Subtitle */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-bg/20 bg-bg/5 text-bg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 010 12.728M16.463 8.287a5.25 5.25 0 010 7.426M11.25 5.048A1.5 1.5 0 009.228 3.705l-3.83 2.872A1.5 1.5 0 014.47 7 h-1.22A1.5 1.5 0 001.75 8.5v7A1.5 1.5 0 003.25 17h1.22a1.5 1.5 0 01.928.323l3.83 2.872a1.5 1.5 0 002.022-1.343V5.048z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-bg">Superior Sound Quality</h3>
              </div>

              {/* Description Paragraph */}
              <p className="max-w-md text-sm leading-relaxed text-bg sm:text-base">
                With high-resolution audio technology, Sonos delivers a rich, immersive sound
                experience that adapts to your room.
              </p>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  aria-label="Previous"
                  className="text-bg transition-colors hover:text-bg/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </button>
                <button aria-label="Next" className="text-bg transition-colors hover:text-bg/90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Left Small Image Card */}
            <div className="relative h-28 w-56 overflow-hidden rounded-0 border border-white/10 bg-white/5">
              <Image
                src="/images/Consumer_robot_standing_on_table_202608111343.jpeg"
                alt="Wireless earbuds charging case detail"
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>
          </motion.div>

          {/* Right Column (Large Hero Card) */}
          <motion.div
            ref={rightCardRef}
            initial={{ opacity: 0, x: 40 }}
            animate={rightInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="relative lg:col-span-7"
          >
            <div className="group relative h-[320px] w-full overflow-hidden rounded-0 sm:h-[400px]">
              {/* Main Image */}
              <Image
                src="/images/Technology_products_and_robotics…_202608111349.jpeg"
                alt="Smart soundbar room setup"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 650px"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Top Text Content Overlay */}
              <div className="absolute left-6 top-6 z-10 sm:left-8 sm:top-8">
                <h4 className="text-xl font-medium text-white sm:text-2xl">Arc Ultra</h4>
                <p className="text-xs text-gray-300 sm:text-sm">Premium Smart Soundbar</p>
              </div>

              {/* Bottom Right Pause / Action Button */}
              <button
                aria-label="Pause media"
                className="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 sm:bottom-8 sm:right-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
