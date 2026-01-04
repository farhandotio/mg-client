'use client';
import React from 'react';
import { ShieldCheck, Terminal, Cpu, HardDrive, Share2, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    id: 1,
    user: 'Tanvir Ahmed',
    role: 'Dev',
    comment: 'The latency is zero. Truly next-gen equipment.',
    rating: 5,
    grid: 'md:col-span-2 md:row-span-1',
  },
  {
    id: 2,
    user: 'Arif Rayhan',
    role: 'Gamer',
    comment: 'Fast shipping. Unboxing felt like 2077.',
    rating: 5,
    grid: 'md:col-span-1 md:row-span-2',
  },
  {
    id: 3,
    user: 'Nusrat Jahan',
    role: 'Architect',
    comment: 'Clean aesthetic, unmatched build quality.',
    rating: 4,
    grid: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 4,
    user: 'Sabbir Hossain',
    role: 'Creator',
    comment: 'Excellent support for workstation upgrades.',
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
    <section className="py-24 bg-bg relative overflow-hidden">
      {/* --- High-Tech Decor Elements --- */}
      <div className="absolute top-0 left-1/4 w-0.5 h-full bg-linear-to-b from-primary/20 via-transparent to-transparent hidden md:block" />
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-primary/10 via-transparent to-transparent hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Unique Header: Terminal HUD Style --- */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-primary font-mono text-[10px] uppercase tracking-[0.4em]">
                Live_Feed: Customer_Nodes
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-text tracking-tighter uppercase italic leading-[0.8]">
              Trust <span className="text-primary">Matrix</span>
            </h2>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-pText/40 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
              Global Integrity Score: 99.8% <br /> Verified Protocol Active
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
          {/* 1. Feature Hero Card (Now centered on Mobile, Sidebar on Desktop) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group border-b-primary/50"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={32} className="text-primary" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-text uppercase leading-[0.9] tracking-tighter">
                Verified <br /> <span className="text-primary">Hardware</span> <br /> Access
              </h3>
            </div>

            <div className="relative z-10 mt-12 md:mt-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-card bg-primary/20 backdrop-blur-xl flex items-center justify-center text-[10px] font-bold text-primary"
                    >
                      ID_0{i}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-pText italic">+1.2k Users</span>
              </div>
              <p className="text-pText text-sm max-w-xs leading-relaxed">
                System-wide confirmation: All hardware units pass neural quality standards.
              </p>
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          </motion.div>

          {/* 2. Dynamic Review Cards */}
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={itemVariants}
              className={`${rev.grid} bg-card/20 backdrop-blur-md border border-border/40 p-6 rounded-2xl hover:bg-card/40 hover:border-primary/30 transition-all duration-500 group flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={10} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <CheckCircle2
                    size={14}
                    className="text-primary/30 group-hover:text-primary transition-colors"
                  />
                </div>
                <p className="text-pText text-sm md:text-base font-medium leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <h4 className="text-text font-black uppercase text-[10px] tracking-widest">
                    {rev.user}
                  </h4>
                  <p className="text-primary/60 text-[9px] font-bold uppercase tracking-tighter">
                    {rev.role}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-border/20 group-hover:bg-primary group-hover:text-bg transition-colors cursor-pointer">
                  <Share2 size={12} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* 3. Stats Section (Responsive Align) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 bg-linear-to-br from-card to-bg border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 group border-r-primary/30"
          >
            <div className="p-3 bg-primary/5 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <Cpu size={20} className="text-primary" />
            </div>
            <span className="text-3xl font-black italic tracking-tighter text-text">99.9%</span>
            <span className="text-[9px] text-pText/50 uppercase font-black tracking-widest">
              Uptime Delivery
            </span>
          </motion.div>

          {/* <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 bg-linear-to-br from-card to-bg border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 group border-l-primary/30"
          >
            <div className="p-3 bg-primary/5 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <HardDrive size={20} className="text-primary" />
            </div>
            <span className="text-3xl font-black italic tracking-tighter text-text">24/7</span>
            <span className="text-[9px] text-pText/50 uppercase font-black tracking-widest">
              Neural Support
            </span>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
