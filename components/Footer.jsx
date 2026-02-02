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
        { name: 'সব পণ্য দেখুন', href: '/shop' },
        { name: 'স্মার্টফোন', href: '/shop?category=smartphones' },
        { name: 'ল্যাপটপ', href: '/shop?category=laptops' },
        { name: 'এক্সেসরিজ', href: '/shop?category=accessories' },
        { name: 'হট ডিলস', href: '/shop?productType=HotDeals' },
      ],
      support: [
        { name: 'যোগাযোগ', href: '/contact' },
        { name: 'ওয়ারেন্টি পলিসি', href: '/policies/warranty' },
        { name: 'রিটার্ন ও রিফান্ড', href: '/policies/refund' },
        { name: 'শিপিং তথ্য', href: '/policies/shipping' },
        { name: 'প্রাইভেসি পলিসি', href: '/policies/privacy' },
      ],
      features: [
        {
          icon: <Truck size={28} />,
          title: 'দ্রুত ডেলিভারি',
          desc: 'সারা বাংলাদেশে হোম ডেলিভারি',
        },
        {
          icon: <ShieldCheck size={28} />,
          title: 'নিরাপদ পেমেন্ট',
          desc: '১০০% পেমেন্ট সুরক্ষা',
        },
        {
          icon: <RotateCcw size={28} />,
          title: 'সহজ রিটার্ন',
          desc: '৭ দিনের রিটার্ন পলিসি',
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

  // --- কন্ডিশনাল রেন্ডারিং (Admin এবং Auth পেজে হাইড থাকবে) ---
  const isAuthPage = pathname === '/auth';
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage || isAuthPage) return null;

  return (
    <footer className="bg-card/500 backdrop-blur-3xl border-t border-border/50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-10 relative z-10">
        {/* ১. টপ ফিচারস - গ্লাস কার্ড ডিজাইন */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16">
          {footerData.features.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-6 p-6 bg-card/20 border border-border/50 rounded-lg hover:border-primary/20 transition-all duration-500 hover:bg-card/50"
            >
              <div className="text-primary bg-primary/10 p-4 rounded-md group-hover:scale-110 group-hover:bg-primary group-hover:text-bg transition-all duration-500 shadow-lg shadow-primary/5">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-text font-black text-lg tracking-tight leading-none">
                  {item.title}
                </h4>
                <p className="text-pText/50 text-[12px] font-black uppercase tracking-widest italic">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-card/5 to-transparent md:mb-12" />

        {/* ২. মেইন কন্টেন্ট গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-4 space-y-8">
            <Logo width={120} height={45} />
            <p className="text-pText/70 text-sm leading-relaxed max-w-sm font-medium italic">
              আমরা শুধু পণ্য বিক্রি করি না, আমরা আপনার জীবনকে আধুনিক প্রযুক্তির ছোঁয়ায় আরও সহজ এবং
              স্মার্ট করে তুলি।
            </p>
            <div className="flex gap-4">
              {footerData.socials.map(({ Icon, label }, i) => (
                <button
                  key={i}
                  aria-label={label}
                  className="w-11 h-11 rounded-md bg-card/50 border border-border/50 flex items-center justify-center text-pText hover:bg-primary hover:text-bg hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* কুইক লিঙ্কস */}
          <div className="lg:col-span-2">
            <h4 className="text-primary font-black uppercase text-[12px]  mb-8">লিঙ্কসমূহ</h4>
            <ul className="space-y-4">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText/60 text-[13px] font-bold hover:text-primary transition-all flex items-center gap-2 group italic"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* সহযোগিতা */}
          <div className="lg:col-span-2">
            <h4 className="text-primary font-black uppercase text-[12px]  mb-8">সহযোগিতা</h4>
            <ul className="space-y-4">
              {footerData.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText/60 text-[13px] font-bold hover:text-primary transition-all flex items-center gap-2 group italic"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* নিউজলেটার */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h4 className="text-primary font-black uppercase text-[12px] ">নিউজলেটার</h4>
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="ইমেইল অ্যাড্রেস লিখুন"
                  className="w-full bg-card/30 border-2 border-border/50 rounded-md px-6 py-4 text-xs outline-none focus:border-primary/30 transition-all font-bold pr-14 italic"
                />
                <button
                  aria-label="Submit Newsletter"
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-md flex items-center justify-center text-bg shadow-lg shadow-primary/20 active:scale-90 transition-transform"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </form>
            </div>

            <address className="not-italic space-y-4 bg-card/20 p-6 rounded-md border border-border/50">
              <div className="flex items-center gap-4 text-pText text-[11px] font-black italic">
                <Phone size={16} className="text-primary" />
                <a href="tel:+8801XXXXXXXXX" className="hover:text-primary transition-colors">
                  +৮৮০ ১XXX-XXXXXX
                </a>
              </div>
              <div className="flex items-center gap-4 text-pText text-[11px] font-black italic">
                <Mail size={16} className="text-primary" />
                <a
                  href="mailto:HQ@GADGETBD.TECH"
                  className="hover:text-primary transition-colors uppercase"
                >
                  HQ@GADGETBD.TECH
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* ৩. বটম বার */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-pText/30 text-[11px] font-black uppercase ">
            <span>কপিরাইট © ২০২৬</span>
            <span className="text-primary">●</span>
            <span>গ্যাজেট বিডিএস</span>
          </div>

          <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-primary fill-current animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest italic">
                পাওয়ারড বাই নেক্সট কোড
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
