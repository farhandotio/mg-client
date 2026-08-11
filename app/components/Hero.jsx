'use client';
import React from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="fixed top-0 left-0 inset-0">
        <Image
          src="/images/Man_using_wireless_headphones_202608111342.jpeg"
          alt="Man using wireless headphones"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/70" />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 pb-10 md:pb-20 pt-2 md:pt-15 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-8 text-white">
          <h1 className="text-5xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Your <span className="text-primary">style + function</span> together online in audio and
            gadgets.
          </h1>

          <p className="max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            From Bluetooth headphones to smartwatches, premium devices for your daily life delivered
            fast in Bangladesh.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              url="/shop"
              text="Explore Collection"
              icon={ArrowRight}
              size="lg"
              className="max-w-max bg-primary text-bg border-transparent hover:bg-primary/90"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function FeatureCard({ title, subtitle }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">{title}</p>
      <p className="mt-3 text-base font-medium text-white">{subtitle}</p>
    </div>
  );
}

export default Hero;
