'use client';
import React from 'react';
import { ShieldCheck, Cpu, Share2, Star, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    id: 1,
    user: 'তানভীর আহমেদ',
    role: 'সফটওয়্যার ইঞ্জিনিয়ার',
    comment: 'প্রোডাক্টের কোয়ালিটি অসাধারন। ডেলিভারিও পেয়েছি একদম সঠিক সময়ে।',
    rating: 5,
    grid: 'md:col-span-2 md:row-span-1',
  },
  {
    id: 2,
    user: 'আরিফ রায়হান',
    role: 'গেমার',
    comment: 'স্মার্টওয়াচটি অরিজিনাল ছিল। প্যাকেজিং দেখে মন ভরে গেছে।',
    rating: 5,
    grid: 'md:col-span-1 md:row-span-2',
  },
  {
    id: 3,
    user: 'নুসরাত জাহান',
    role: 'আর্কিটেক্ট',
    comment: 'খুবই ক্লিন ডিজাইন এবং বিল্ড কোয়ালিটি প্রিমিয়াম।',
    rating: 4,
    grid: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 4,
    user: 'সাব্বির হোসেন',
    role: 'কন্টেন্ট ক্রিয়েটর',
    comment: 'গ্যাজেট বিডিএস থেকে কেনা হেডফোনটি আমার প্রতিদিনের কাজে খুব সাহায্য করছে।',
    rating: 5,
    grid: 'md:col-span-2 md:row-span-1',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function TrustSection() {
  return (
    <section className="py-16 bg-bg relative overflow-hidden border-t border-border/10">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-0.5 h-full bg-linear-to-b from-primary/10 via-transparent to-transparent hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* --- Header: Clean & Trusted --- */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                কাস্টমার রিভিউ এবং ফিডব্যাক
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-text tracking-tighter uppercase italic leading-none">
              ইউজারদের <span className="text-primary">আস্থা</span>
            </h2>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-pText/60 font-bold text-[11px] uppercase tracking-widest leading-relaxed">
              সন্তুষ্ট কাস্টমার: ৯৯.৮% <br /> ভেরিফাইড রিভিউ সিস্টেম একটিভ
            </p>
          </div>
        </div>

        {/* --- Bento Grid Area --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4"
        >
          {/* 1. Feature Hero Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-text uppercase leading-[1] tracking-tighter">
                ১০০% জেনুইন <br /> <span className="text-primary">প্রোডাক্টের</span> <br /> নিশ্চয়তা
              </h3>
            </div>

            <div className="relative z-10 mt-12 md:mt-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-card bg-primary/20 backdrop-blur-xl flex items-center justify-center text-[10px] font-black text-primary"
                    >
                      
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-pText italic">+১২০০ কাস্টমার</span>
              </div>
              <p className="text-pText text-sm max-w-xs leading-relaxed font-medium">
                আমাদের প্রতিটি পণ্য কঠোর মাননিয়ন্ত্রণের মাধ্যমে যাচাই করা হয়। আপনি পাচ্ছেন আসল
                পণ্যের পূর্ণ গ্যারান্টি।
              </p>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          </motion.div>

          {/* 2. Dynamic Review Cards */}
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={itemVariants}
              className={`${rev.grid} bg-card/40 backdrop-blur-md border border-border/40 p-6 rounded-3xl hover:border-primary/30 transition-all duration-500 group flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={10} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <MessageSquareQuote
                    size={16}
                    className="text-primary/20 group-hover:text-primary transition-colors"
                  />
                </div>
                <p className="text-pText text-sm md:text-base font-bold leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <h4 className="text-text font-black text-sm tracking-tight">{rev.user}</h4>
                  <p className="text-primary/70 text-[10px] font-bold uppercase tracking-tighter">
                    {rev.role}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-border/20 group-hover:bg-primary group-hover:text-bg transition-colors cursor-pointer">
                  <Share2 size={12} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* 3. Stats Section */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 bg-card border border-border/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 group"
          >
            <div className="p-3 bg-primary/5 rounded-full mb-1 group-hover:rotate-[360deg] transition-transform duration-700">
              <Cpu size={24} className="text-primary" />
            </div>
            <span className="text-3xl font-black italic tracking-tighter text-text">৯৯.৯%</span>
            <span className="text-[10px] text-pText/60 uppercase font-black tracking-widest">
              সফল ডেলিভারি
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
