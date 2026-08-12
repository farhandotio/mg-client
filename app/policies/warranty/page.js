'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Cpu, Settings } from 'lucide-react';

export default function WarrantyPolicy() {
  return (
    <main className="pt-20 md:pt-24 pb-20 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-1 rounded-full text-secondary">
            <Award size={14} />
            <span className="text-[12px] font-medium uppercase tracking-tighter">
              Premium Protection
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium text-text italic uppercase tracking-tighterer leading-none">
            Warranty <br />
            <span className="text-secondary">Protocols</span>
          </h1>
        </div>

        {/* Warranty Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Step
            number="01"
            title="Diagnosis"
            desc="Connect with our support team for initial remote troubleshooting."
          />
          <Step
            number="02"
            title="Shipment"
            desc="Securely package the unit and dispatch it to our central lab."
          />
          <Step
            number="03"
            title="Repair"
            desc="Expert engineers restore your hardware to factory specs."
          />
        </div>

        {/* Coverage Details */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-text uppercase italic flex items-center gap-3">
                <Cpu size={20} className="text-secondary" /> What's Covered
              </h3>
              <p className="text-pText opacity-80 font-medium">
                Our 2-Year Limited Warranty covers manufacturing defects in materials and
                workmanship under normal use. This includes internal circuitry, battery health (up
                to 1 year), and display panels.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-text uppercase italic flex items-center gap-3">
                <Zap size={20} className="text-secondary" /> Void Conditions
              </h3>
              <p className="text-pText opacity-80 font-medium">
                Warranty is void if: the serial number is tampered with, the device is
                water-damaged, physical force is evident, or third-party firmware (jailbreaking) is
                detected.
              </p>
            </div>
          </div>

          {/* Support Call to Action */}
          <div className="p-10 bg-secondary rounded-0 text-bg flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_20px_50px_rgba(var(--secondary-rgb),0.3)]">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-3xl font-medium uppercase italic leading-none">Need to Claim?</h3>
              <p className="font-medium opacity-80 uppercase tracking-tighter">
                Initiate your service ticket via our 24/7 command center.
              </p>
            </div>
            <button
              aria-label="open ticket"
              className="bg-bg text-text px-10 py-4 rounded-0 font-medium uppercase tracking-tighter hover:scale-105 transition-transform"
            >
              Open Ticket
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="p-6 bg-card/20 border border-white/5 rounded-0 relative overflow-hidden group">
      <span className="absolute -right-2 -top-2 text-6xl font-medium text-white/30 group-hover:text-secondary/10 transition-colors">
        {number}
      </span>
      <h4 className="text-lg font-medium text-text uppercase italic mb-2 relative z-10">{title}</h4>
      <p className="text-xs text-pText opacity-70 leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}
