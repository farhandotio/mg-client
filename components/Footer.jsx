'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  RotateCcw,
  Send,
  Zap,
} from 'lucide-react';
import Logo from './Logo';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const footerData = useMemo(
    () => ({
      quickLinks: [
        { name: 'Shop All Units', href: '/shop' },
        { name: 'Smartphones', href: '/shop?category=smartphones' },
        { name: 'Laptops', href: '/shop?category=laptops' },
        { name: 'Accessories', href: '/shop?category=accessories' },
        { name: 'Hot Deals', href: '/shop?productType=HotDeals' },
      ],
      support: [
        { name: 'Command Center', href: '/contact' },
        { name: 'Warranty Protocols', href: '/policies/warranty' },
        { name: 'Return & Refund', href: '/policies/refund' },
        { name: 'Shipping Info', href: '/policies/shipping' },
        { name: 'Privacy Shield', href: '/policies/privacy' },
      ],
      features: [
        {
          icon: <Truck size={28} />,
          title: 'Rapid Dispatch',
          desc: 'Zone-wide Delivery',
        },
        {
          icon: <ShieldCheck size={28} />,
          title: 'Secure Vault',
          desc: '256-bit Encryption',
        },
        {
          icon: <RotateCcw size={28} />,
          title: 'Hardware Reset',
          desc: '7-Day Return Policy',
        },
      ],
      socials: [
        { Icon: Facebook, label: 'Facebook' },
        { Icon: Twitter, label: 'Twitter' },
        { Icon: Instagram, label: 'Instagram' },
        { Icon: Youtube, label: 'Youtube' },
      ],
    }),
    []
  );

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-card backdrop-blur-xl border-t border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        {/* --- Top Features Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {footerData.features.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-5 p-6 bg-bg/20 border border-white/5 rounded-3xl hover:border-primary/30 transition-colors duration-500 hover:bg-bg/40"
            >
              <div className="text-primary bg-primary/10 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-bg transition-transform duration-500">
                {item.icon}
              </div>
              <div>
                <h4 className="text-text font-black text-lg tracking-tighter uppercase italic">
                  {item.title}
                </h4>
                <p className="text-pText text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent mb-16" />

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <Logo width={140} height={40} />
            <p className="text-pText text-base leading-relaxed max-w-sm font-medium">
              Engineering the next generation of gadget retail. We provide high-performance hardware
              with a focus on reliability and future-proof technology.
            </p>
            <div className="flex gap-3">
              {footerData.socials.map(({ Icon, label }, i) => (
                <button
                  key={i}
                  aria-label={label} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-border/50 flex items-center justify-center text-pText hover:bg-primary hover:text-bg transition-all duration-300 active:scale-90"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-8">
              Sectors
            </h4>
            <ul className="space-y-4">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText text-sm tracking-tighter hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <div
                      className="w-0 h-0.5 bg-primary group-hover:w-3 transition-all"
                      aria-hidden="true"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service & Policy Links */}
          <div className="lg:col-span-2">
            <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-8">
              Protocols
            </h4>
            <ul className="space-y-4">
              {footerData.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText text-sm tracking-tighter hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <div
                      className="w-0 h-0.5 bg-primary group-hover:w-3 transition-all"
                      aria-hidden="true"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em]">
              Signal_Subscription
            </h4>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter Neural ID (Email)"
                className="w-full bg-bg/50 border-2 border-border/30 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 transition-all font-bold pr-14 italic"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter" // Fix: Accessibility name added
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-bg hover:scale-105 transition-transform shadow-lg shadow-primary/20"
              >
                <Send size={18} />
              </button>
            </form>

            <address className="not-italic space-y-4 bg-bg/20 p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 text-pText text-[11px] font-black uppercase tracking-widest">
                <Phone size={16} className="text-primary" aria-hidden="true" />
                <a href="tel:+8801XXXXXXXXX">+880 1XXX-XXXXXX</a>
              </div>
              <div className="flex items-center gap-4 text-pText text-[11px] font-black uppercase tracking-widest">
                <Mail size={16} className="text-primary" aria-hidden="true" />
                <a href="mailto:HQ@GADGETBD.TECH">HQ@GADGETBD.TECH</a>
              </div>
            </address>
          </div>
        </div>

        {/* --- Bottom Footer Bar --- */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-pText/40 text-[9px] font-black uppercase tracking-[0.3em]">
            <span>System_Run: 2026</span>
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span>Gadget BDs Global Node</span>
          </div>

          <div className="flex items-center gap-8 grayscale opacity-50 hover:opacity-100 transition-all duration-700">
            <Zap size={16} className="text-primary" aria-hidden="true" />
            <div className="h-3 w-px bg-white/10" aria-hidden="true" />
            <span className="text-[9px] font-black uppercase tracking-widest italic">
              Encryption: Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
