'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Lock, Server, FileLock2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="pt-16 pb-20 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 space-y-6 relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl text-primary mb-4 border border-primary/20">
            <Lock size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Data_Protection_Enabled
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-text italic uppercase tracking-tighter leading-none">
            Privacy <br />
            <span className="text-primary">Shield</span>
          </h1>
          <p className="text-pText text-lg font-medium border-l-2 border-primary/30 pl-6 max-w-2xl italic">
            Your privacy is our primary directive. We employ military-grade encryption to ensure
            your neural and physical data remains yours alone.
          </p>
        </div>

        {/* Security Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <SecurityFeature
            icon={<EyeOff />}
            title="No Tracker"
            desc="We do not sell your navigation data to third-party entities."
          />
          <SecurityFeature
            icon={<Server />}
            title="Secured Node"
            desc="All transactions are processed through decentralized encrypted nodes."
          />
          <SecurityFeature
            icon={<FileLock2 />}
            title="Encrypted"
            desc="Your personal identification is hashed and stored in offline vaults."
          />
        </div>

        {/* Detailed Clauses */}
        <div className="space-y-16">
          <section className="space-y-4">
            <h3 className="text-2xl font-black text-text uppercase italic flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
              01. Information Acquisition
            </h3>
            <p className="text-pText font-medium leading-relaxed opacity-80">
              When you initialize a transaction on our platform, we collect essential data such as
              your name, communication link (email), and extraction point (shipping address). This
              is utilized strictly for logistics and communication protocols.
            </p>
          </section>

          <section className="space-y-4 bg-card/20 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 italic font-black text-6xl select-none">
              DATA_SEC
            </div>
            <h3 className="text-2xl font-black text-text uppercase italic">02. Cookie Protocols</h3>
            <p className="text-pText font-medium leading-relaxed opacity-80">
              Our system utilizes minor "Cookies" to optimize your interface and recall your
              preferences. These fragments are temporary and can be purged from your system at any
              time via your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-text uppercase italic flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              03. System Security
            </h3>
            <p className="text-pText font-medium leading-relaxed opacity-80">
              Your financial data is never stored on our local servers. All payment signals are
              routed through SSL-secured gateways with PCI-DSS compliance.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function SecurityFeature({ icon, title, desc }) {
  return (
    <div className="p-8 bg-card/30 border border-white/5 rounded-3xl group hover:border-primary/50 transition-all duration-500">
      <div className="text-primary mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-lg font-black text-text uppercase italic mb-2 tracking-tighter">
        {title}
      </h4>
      <p className="text-xs text-pText font-medium leading-relaxed opacity-60">{desc}</p>
    </div>
  );
}
