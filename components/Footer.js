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
} from 'lucide-react';

export default function Footer() {
  // ডাইনামিক ডেটা অবজেক্ট
  const footerData = {
    quickLinks: [
      { name: 'Shop All', href: '/shop' },
      { name: 'Smartphones', href: '/category/smartphones' },
      { name: 'Laptops', href: '/category/laptops' },
      { name: 'Headphones', href: '/category/headphones' },
      { name: 'Gaming', href: '/category/gaming' },
      { name: 'Smart Home', href: '/category/smart-home' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Order Tracking', href: '/track-order' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    features: [
      { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'On orders over $100' },
      {
        icon: <ShieldCheck size={24} />,
        title: 'Secure Payment',
        desc: '100% secure transactions',
      },
      { icon: <RotateCcw size={24} />, title: 'Easy Returns', desc: '30-day return policy' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-border">
          {footerData.features.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-xl text-[#00A3FF]">{item.icon}</div>
              <div>
                <h4 className="text-text font-bold">{item.title}</h4>
                <p className="text-pText text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12">
          {/* Logo & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#00A3FF] w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl">
                M
              </div>
              <span className="text-text font-bold text-xl">My Gadget</span>
            </Link>
            <p className="text-pText text-sm leading-relaxed">
              Your one-stop destination for premium electronics and cutting-edge gadgets. Quality
              products, exceptional service.
            </p>
            <div className="flex gap-4 text-pText">
              <Facebook size={18} className="hover:text-primary cursor-pointer transition" />
              <Twitter size={18} className="hover:text-primary cursor-pointer transition" />
              <Instagram size={18} className="hover:text-primary cursor-pointer transition" />
              <Youtube size={18} className="hover:text-primary cursor-pointer transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText text-sm hover:text-primary transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-text font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              {footerData.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-pText text-sm hover:text-primary transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated & Contact */}
          <div className="space-y-6">
            <h4 className="text-text font-bold">Stay Updated</h4>
            <p className="text-pText text-sm">Subscribe for exclusive deals and tech updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-bg border border-border rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-primary transition"
              />
              <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition">
                Subscribe
              </button>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-pText text-sm">
                <Phone size={16} className="text-[#00A3FF]" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-pText text-sm">
                <Mail size={16} className="text-[#00A3FF]" /> support@mygadget.com
              </div>
              <div className="flex items-center gap-3 text-pText text-sm">
                <MapPin size={16} className="text-[#00A3FF]" /> 123 Tech Street, CA 94102
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-pText text-xs">
          <p>© 2024 My Gadget. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
