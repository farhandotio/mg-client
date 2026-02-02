'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, ShieldAlert, Cpu, Radio, Box } from 'lucide-react';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 relative overflow-hidden py-12">
      {/* --- Aesthetic Tech Background --- */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L0 0m60 60L30 30' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* --- Unique 404 Hero Area --- */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center items-center gap-4"
          >
            <span className="text-8xl md:text-[12rem] font-black text-text italic tracking-tighter leading-none">
              4
            </span>
            <div className="w-24 h-32 md:w-32 md:h-44 bg-primary rounded-lg flex items-center justify-center rotate-12 relative shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
              <div className="absolute inset-2 border-2 border-bg/20 rounded-md border-dashed" />
              <Radio size={48} className="text-bg animate-pulse" />
            </div>
            <span className="text-8xl md:text-[12rem] font-black text-text italic tracking-tighter leading-none">
              4
            </span>
          </motion.div>

          {/* Vertical Metadata Bar */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 opacity-20">
            <div className="w-px h-24 bg-text" />
            <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em]">
              Sector.Failure
            </span>
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 bg-white/30 border border-white/10 px-6 py-2 rounded-md">
              <ShieldAlert size={16} className="text-primary" />
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-pText">
                Alert: Data_Link_Severed
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-text tracking-tighter uppercase italic leading-[0.85]">
              Pathways <br />
              <span className="text-primary">Terminated.</span>
            </h2>

            <p className="text-pText text-lg max-w-lg mx-auto font-medium leading-relaxed opacity-80 pl-6 border-l-2 border-primary/30">
              The node you are requesting is currently offline or has been purged from our main
              directory. Verify the hash and retry.
            </p>
          </motion.div>

          {/* --- Industrial Navigation --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-6"
          >
            <button
              aria-label="page back"
              onClick={() => window.history.back()}
              className="group flex items-center gap-4 backdrop-blur-xl px-10 py-5 rounded-md transition-all duration-500"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-bg transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-text">
                Revert Sector
              </span>
            </button>
            <div>
              <Button
                aria-label="go to home"
                size="lg"
                url={'/'}
                icon={Home}
                text={'Base Command'}
              />
            </div>
          </motion.div>
        </div>

        {/* --- Footer Status --- */}
        <div className="mt-20 flex justify-center items-center gap-12 border-t border-white/5 pt-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-pText uppercase tracking-widest">Protocol</p>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-primary" />
              <span className="text-xs font-black text-text uppercase italic">v.2026.X</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-pText uppercase tracking-widest">Storage</p>
            <div className="flex items-center gap-2">
              <Box size={14} className="text-primary" />
              <span className="text-xs font-black text-text uppercase italic">Void_0x404</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
