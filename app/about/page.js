'use client';
import React from 'react';

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Products', value: '10K+' },
    { label: 'Satisfaction Rate', value: '99%' },
    { label: 'Customer Support', value: '24/7' },
  ];

  const team = [
    { name: 'Alex Chen', role: 'Founder & CEO', initials: 'AC' },
    { name: 'Sarah Miller', role: 'Head of Design', initials: 'SM' },
    { name: 'James Wilson', role: 'CTO', initials: 'JW' },
    { name: 'Emily Brown', role: 'Head of Sales', initials: 'EB' },
  ];

  return (
    <div className="bg-bg min-h-screen pt-16 pb-20">
      {/* --- About Header Section --- */}
      <section className="px-6 text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-black text-text mb-6">
          About <span className="text-primary">Gadget BDs</span>
        </h1>
        <p className="text-pText text-lg font-medium leading-relaxed">
          We're on a mission to make premium technology accessible to everyone. Since 2020, we've
          been curating the best gadgets and electronics from around the world.
        </p>
      </section>

      {/* --- Stats Section --- */}
      <section className="border-y border-border/50 py-16 mb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <h2 className="text-4xl md:text-5xl font-black text-primary">{stat.value}</h2>
              <p className="text-pText font-bold uppercase tracking-widest text-xs opacity-70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Our Story & Values --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-text uppercase">Our Story</h2>
            <p className="text-pText leading-loose italic">
              Gadget BDs was founded in 2020 with a simple idea: everyone deserves access to premium
              technology without the premium price tag.
            </p>
            <p className="text-pText leading-loose">
              What started as a small online store has grown into one of the most trusted
              destinations for electronics and gadgets. We've served over 50,000 customers and
              continue to grow every day.
            </p>
          </div>

          {/* Values Grid */}
          <div className="bg-card border border-border p-8 md:p-12 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Customer First',
                desc: 'Every decision we make starts with our customers in mind.',
              },
              {
                title: 'Quality Products',
                desc: 'We only sell products that meet our strict quality standards.',
              },
              {
                title: 'Community',
                desc: 'Building a community of tech enthusiasts who love what we do.',
              },
              {
                title: 'Innovation',
                desc: 'Staying ahead of the curve with the latest technology trends.',
              },
            ].map((val, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-text font-bold">{val.title}</h4>
                <p className="text-pText text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Meet Our Team Section --- */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-text uppercase tracking-tight">Meet Our Team</h2>
          <p className="text-pText font-medium italic opacity-80">
            The passionate people behind Gadget BDs who make it all happen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-card border border-border p-10 rounded-md flex flex-col items-center text-center group hover:border-primary transition-all duration-300"
            >
              {/* Profile Avatar with Initials */}
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-bg font-black text-2xl mb-6 shadow-[0_0_20px_rgba(41,252,86,0.2)] group-hover:scale-110 transition-transform">
                {member.initials}
              </div>
              <h4 className="text-text font-bold text-lg">{member.name}</h4>
              <p className="text-pText text-xs font-bold uppercase tracking-widest mt-1 opacity-60">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
