'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Route protection logic
  const isAuthPage = pathname === '/auth';
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage || isAuthPage) return null;

  return (
    <footer className="relative p-4 sm:p-6 lg:p-8">
      {/* Outer Rounded Container */}
      <div className="relative mx-auto overflow-hidden bg-bg text-text p-4 md:p-8 lg:p-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column - Navigation, CTA, Contact Info, Newsletter & Socials */}
          <div className="flex flex-col justify-between space-y-12 lg:col-span-7">
            {/* 1. Header Navigation Links */}
            <nav className="flex flex-wrap gap-6 text-sm font-medium text-text/90 hover:text-text transition-colors">
              <Link href="/shop">Products</Link>
              <Link href="/technology">Technology</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/contact">Support</Link>
              <Link href="/about">About Us</Link>
            </nav>

            {/* 2. Main Title */}
            <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-tight text-text sm:text-4xl md:text-5xl lg:text-6xl">
              Ready to Experience the Future of Sound?
            </h2>

            {/* 3. Contact Information Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs tracking-wide">
              <div>
                <span className="block uppercase text-text font-medium mb-2">PHONE</span>
                <a href="tel:+18006802345" className="text-text hover:text-text transition-colors">
                  +1 800 680 2345
                </a>
              </div>
              <div>
                <span className="block uppercase text-text font-medium mb-2">E-MAIL</span>
                <a
                  href="mailto:support@sonos.com"
                  className="text-text hover:text-text transition-colors"
                >
                  support@sonos.com
                </a>
              </div>
              <div>
                <span className="block uppercase text-text font-medium mb-2">ADDRESS</span>
                <p className="text-text leading-relaxed">
                  614 Chapala Street,
                  <br />
                  Santa Barbara, CA 93101, USA
                </p>
              </div>
            </div>

            {/* 4. Newsletter Signup Form */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-end pt-4">
              <p className="text-base text-text font-medium leading-snug">
                Sign up for the latest updates
                <br className="hidden sm:inline" /> and exclusive offers
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full border-b border-border bg-transparent pb-2 text-sm text-text placeholder-gray-500 outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="rounded-full border border-border px-6 py-2 text-xs font-medium text-text transition-all hover:bg-bg hover:text-text"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* 5. Social Icons */}
            <div className="flex items-center gap-3 pt-4">
              {['instagram', 'x', 'facebook', 'youtube', 'linkedin'].map((platform, idx) => (
                <a
                  key={idx}
                  href={`#${platform}`}
                  aria-label={platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-text/10 text-xs font-medium uppercase text-text transition-all hover:bg-bg hover:text-text"
                >
                  {platform.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Hero Banner Image Card */}
          <div className="relative lg:col-span-5">
            <div className="relative h-[480px] w-full overflow-hidden rounded-0 sm:h-[560px] lg:h-full min-h-[480px]">
              {/* Main Image */}
              <Image
                src="/images/Man_interacting_with_consumer_robot_202608111350.jpeg"
                alt="Man interacting with consumer robot"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />

              {/* Overlay Top Product Info */}
              <div className="absolute left-6 top-6 z-10 text-white drop-shadow-md">
                <h3 className="text-xl font-medium sm:text-2xl">Sonos Ace</h3>
                <p className="text-xs text-gray-200">Premium Headphone</p>
              </div>

              {/* Overlay Bottom CTA Badge */}
              <Link
                href="/shop/sonos-ace"
                className="absolute bottom-6 right-6 z-10 flex items-center justify-between gap-4 rounded-0 bg-white p-4 text-black shadow-xl transition-transform hover:scale-[1.02]"
              >
                <div className="text-left">
                  <span className="block text-xs font-medium leading-tight">See the Product</span>
                  <span className="block text-xs font-medium leading-tight">Specification</span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
