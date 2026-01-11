'use client';
import React from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Send,
} from 'lucide-react';
import Button from '@/components/Button'; // আপনার কাস্টম বাটন

export default function Footer() {
  const footerData = {
    quickLinks: [
      { name: 'Shop All', href: '/shop' },
      { name: 'Smartphones', href: '/category/smartphones' },
      { name: 'Laptops', href: '/category/laptops' },
      { name: 'Headphones', href: '/category/headphones' },
      { name: 'Gaming', href: '/category/gaming' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Order Tracking', href: '/track-order' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    features: [
      {
        icon: <Truck size={28} />,
        title: 'Free Shipping',
        desc: 'Orders over $100',
        color: 'text-blue-500',
      },
      {
        icon: <ShieldCheck size={28} />,
        title: 'Secure Payment',
        desc: '100% encryption',
        color: 'text-green-500',
      },
      {
        icon: <RotateCcw size={28} />,
        title: 'Easy Returns',
        desc: '30-day window',
        color: 'text-orange-500',
      },
    ],
  };

  return (
    <footer className="bg-card backdrop-blur-xl border-t border-border/50 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* --- Top Features Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {footerData.features.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-5 p-6 bg-bg/40 border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div
                className={`${item.color} bg-white/5 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}
              >
                {item.icon}
              </div>
              <div>
                <h4 className="text-text font-black text-lg tracking-tight">{item.title}</h4>
                <p className="text-pText text-xs font-medium uppercase tracking-widest opacity-70">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent mb-16" />

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Identity (Col-4) */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-text font-black text-2xl tracking-tighter">
                Gadget <span className="text-primary italic">BDS</span>
              </span>
            </Link>
            <p className="text-pText text-sm leading-relaxed max-w-sm font-medium">
              We provide the latest and most advanced tech gadgets with a commitment to quality and
              innovation. Join our tech community today.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-border/50 flex items-center justify-center text-pText hover:bg-primary hover:text-bg transition-all duration-300"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Links (Col-2 each) */}
          <div className="lg:col-span-2">
            <h4 className="text-text font-black uppercase text-[10px] tracking-[0.3em] mb-8">
              Navigation
            </h4>
            <ul className="space-y-4">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText text-sm font-bold hover:text-primary transition-all flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-text font-black uppercase text-[10px] tracking-[0.3em] mb-8">
              Service
            </h4>
            <ul className="space-y-4">
              {footerData.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText text-sm font-bold hover:text-primary transition-all flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (Col-4) */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-text font-black uppercase text-[10px] tracking-[0.3em]">
              Join Newsletter
            </h4>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-bg/50 border-2 border-border/50 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 transition-all font-bold pr-14"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-bg hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                <Send size={18} />
              </button>
            </div>

            <div className="space-y-4 bg-bg/40 p-6 rounded-3xl border border-border/50">
              <div className="flex items-center gap-4 text-pText text-sm font-bold">
                <Phone size={18} className="text-primary" /> <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-4 text-pText text-sm font-bold">
                <Mail size={18} className="text-primary" /> <span>hello@mygadget.tech</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Footer Bar --- */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-pText text-[10px] font-black uppercase tracking-widest">
            <span>© 2026</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>Gadget BDS Global</span>
          </div>

          <div className="flex gap-8">
            {['Terms', 'Privacy', 'Cookies'].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase()}`}
                className="text-pText text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors"
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
