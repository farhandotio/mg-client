'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Map, PackageCheck, Zap, Globe } from 'lucide-react';

export default function ShippingInfo() {
  return (
    <main className="pt-16 pb-20 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 border-b border-bg/5 pb-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-text italic uppercase tracking-tighter leading-none">
              Rapid <br />
              <span className="text-primary">Dispatch</span>
            </h1>
            <p className="text-pText font-black uppercase tracking-wide text-xs opacity-50">
              Logistics_System_Active
            </p>
          </div>
          <div className="p-6 bg-primary text-bg rounded-md flex items-center gap-4 shadow-[0_20px_40px_rgba(var(--primary-rgb),0.2)]">
            <Zap size={30} fill="currentColor" />
            <div className="font-black italic uppercase leading-none">
              <p className="text-[12px]">Average Speed</p>
              <p className="text-2xl tracking-tighter">24-72 Hours</p>
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ZoneCard
            location="Dhaka Metro"
            time="Next Day Delivery"
            price="Free of Charge"
            detail="Orders placed before 14:00 will be prioritized for same-day dispatch."
          />
          <ZoneCard
            location="Outside Dhaka"
            time="2-3 Working Days"
            price="Standard Rate: ৳120"
            detail="Safe transit via our verified courier partners with real-time tracking."
          />
        </div>

        {/* Delivery Protocols */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-text uppercase italic border-b border-primary/20 pb-4">
              Extraction Protocols
            </h3>

            <div className="grid gap-4">
              <ProtocolItem
                icon={<PackageCheck size={18} />}
                text="All units are triple-checked and vacuum-sealed before dispatch."
              />
              <ProtocolItem
                icon={<Map size={18} />}
                text="Live signal tracking ID will be sent to your Neural ID (Email) once shipped."
              />
              <ProtocolItem
                icon={<Globe size={18} />}
                text="Currently servicing all 64 districts across the Bangladesh sector."
              />
            </div>
          </div>

          {/* Damage Protection Note */}
          <div className="p-10 bg-card/20 border border-bg/5 rounded-xl text-center space-y-4">
            <h4 className="text-xl font-black text-text uppercase italic tracking-widest">
              Transit Security
            </h4>
            <p className="text-pText font-medium opacity-80">
              If the outer protective seal is broken upon arrival, do not accept the package.
              Initialize an immediate signal to our Support Center at +880 1XXX-XXXXXX.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ZoneCard({ location, time, price, detail }) {
  return (
    <div className="p-10 bg-card/20 border border-bg/5 rounded-lg hover:bg-card/40 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <h4 className="text-3xl font-black text-text italic uppercase tracking-tighter">
          {location}
        </h4>
        <Truck className="text-primary" size={24} />
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <span className="text-[12px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">
            {time}
          </span>
          <span className="text-[12px] font-black uppercase bg-bg/5 text-pText px-3 py-1 rounded-full">
            {price}
          </span>
        </div>
        <p className="text-sm text-pText font-medium leading-relaxed opacity-60">{detail}</p>
      </div>
    </div>
  );
}

function ProtocolItem({ icon, text }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-bg/20 rounded-md border border-bg/5">
      <div className="text-primary">{icon}</div>
      <p className="text-sm font-bold text-pText uppercase tracking-tight italic">{text}</p>
    </div>
  );
}
