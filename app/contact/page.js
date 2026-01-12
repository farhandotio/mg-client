'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-text italic uppercase tracking-tighter">
            Get In <span className="text-primary">Touch.</span>
          </h1>
          <p className="text-pText text-xl max-w-2xl font-medium border-l-2 border-primary pl-6">
            Have a technical query or need support? Our engineering team is ready to assist you
            24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <ContactCard
            icon={<Phone />}
            title="Hotline"
            detail="+880 1XXX-XXXXXX"
            sub="Available 10AM - 10PM"
          />
          <ContactCard
            icon={<Mail />}
            title="Support Email"
            detail="support@mygadgetbd.com"
            sub="Fast response within 2h"
          />
          <ContactCard
            icon={<MapPin />}
            title="Base Location"
            detail="Multiplan Center, Level 9, Dhaka"
            sub="Physical Store & Service Center"
          />
        </div>

        {/* Support Section */}
        <div className="mt-12 p-12 bg-card/30 border border-white/5 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black italic uppercase text-text">Direct Message</h3>
            <p className="text-pText font-medium">
              Connect with our live agents via WhatsApp for instant support.
            </p>
          </div>
          <a
            href="https://wa.me/yournumber"
            className="bg-[#25D366] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <MessageSquare /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

function ContactCard({ icon, title, detail, sub }) {
  return (
    <div className="p-10 bg-card/20 border border-white/5 rounded-[2.5rem] hover:border-primary/50 transition-all group">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pText mb-2">{title}</p>
      <h4 className="text-2xl font-black text-text italic mb-1">{detail}</h4>
      <p className="text-sm text-pText/60 font-medium">{sub}</p>
    </div>
  );
}
