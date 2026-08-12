'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <main className="pt-20 md:pt-24 pb-20 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 space-y-4 border-l-4 border-secondary pl-8">
          <h1 className="text-5xl md:text-7xl font-medium text-text italic uppercase tracking-tighterer">
            Return <span className="text-secondary">& Refund</span>
          </h1>
          <p className="text-pText font-medium uppercase tracking-tighter text-sm opacity-60">
            Protocol_v2.1 // Last Updated: 2026
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <PolicyCard
            icon={<Clock className="text-secondary" />}
            title="7-Day Window"
            desc="You have 7 solar days to initiate a return if the hardware is found defective upon arrival."
          />
          <PolicyCard
            icon={<ShieldCheck className="text-secondary" />}
            title="Mint Condition"
            desc="Items must be in original packaging with all security seals intact for a successful refund."
          />
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12 text-pText font-medium leading-relaxed">
          <section className="space-y-4">
            <h3 className="text-2xl font-medium text-text uppercase italic">
              01. Eligibility Criteria
            </h3>
            <p>
              To be eligible for a return, your item must be unused and in the same condition that
              you received it. Any product with signs of physical damage, liquid damage, or
              unauthorized repair attempts will be rejected by our technical lab.
            </p>
          </section>

          <section className="space-y-4 bg-card/20 p-8 rounded-0 border border-white/5">
            <h3 className="text-2xl font-medium text-text uppercase italic flex items-center gap-3">
              <AlertTriangle className="text-yellow-500" /> Non-Returnable Items
            </h3>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
              <li>Downloadable software products or digital keys.</li>
              <li>Items on "Flash Clearance" or final sale.</li>
              <li>Hygiene-related products (In-ear headphones) if the seal is broken.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-medium text-text uppercase italic">02. Refund Process</h3>
            <p>
              Once your return is received and inspected, we will notify you of the approval or
              rejection of your refund. If approved, the credit will automatically be applied to
              your original method of payment within 5-10 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function PolicyCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-card/30 border border-white/5 rounded-0">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-medium text-text uppercase italic mb-2">{title}</h4>
      <p className="text-sm opacity-70">{desc}</p>
    </div>
  );
}
