'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function FloatingHeadphoneSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-bg px-4 py-24 sm:px-6 lg:px-8">
      {/* Outer Card Wrapper matching the image border radius and shadow */}
      <div className="relative flex w-full items-center justify-center p-4 py-20 md:p-16 lg:p-24">
        {/* Background Text (Centered & Behind Image) */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none select-none text-center text-5xl font-medium leading-[1.15] tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl z-0"
        >
          From pioneering wireless audio to designing state-of-the-art speakers,{' '}
          <span className="italic">Sonos</span>{' '}
          <span className="text-text/30">commitment to innovation that connects and inspires.</span>
        </motion.h1>

        {/* Floating Headphone Overlay (Centered & In Front of Text) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Separate layer for the continuous float loop, so it doesn't fight the entrance animation */}
          <motion.div
            animate={{ y: [-0, -15, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeIn' }}
            className="relative h-150 w-150"
          >
            <Image
              src="/images/robot-png.png"
              alt="Floating Sonos Headphone"
              fill
              priority
              className="object-contain drop-shadow-2xl scale-150 md:scale-100"
              sizes="(max-width: 768px) 300px, 500px"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
