'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

export default function KeywordCardSection() {
  const cardRef = useRef(null);
  const textGroupRef = useRef(null);
  const textInView = useInView(textGroupRef, { once: true, amount: 0.35 });
  const cardInView = useInView(cardRef, { once: true, amount: 0.35 });

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-bg px-4 py-20 sm:px-6 lg:px-8">
      {/* Outer Card Wrapper */}
      <div className="relative flex w-full items-center justify-center">
        {/* Typographic Layout Container */}
        <motion.div
          ref={textGroupRef}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={textInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative flex flex-col items-center justify-center font-medium tracking-tight select-none"
        >
          {/* Top Words */}
          <span className="text-3xl text-text sm:text-5xl md:text-6xl">Vibe</span>
          <span className="mt-2 text-3xl text-text sm:text-5xl md:text-6xl">Groove</span>

          {/* Center Row with Repeats */}
          <div className="relative my-2 flex items-center justify-center gap-4 sm:gap-8">
            <span className="text-3xl text-danger/20 blur-[1px] sm:text-5xl md:text-6xl lg:text-7xl">
              Harmony
            </span>

            {/* Active Highlight Word */}
            <span className="text-3xl font-medium text-[#D83B25] sm:text-5xl md:text-6xl lg:text-7xl">
              Harmony
            </span>

            <span className="text-3xl text-danger/20 blur-[1px] sm:text-5xl md:text-6xl lg:text-7xl">
              Harmony
            </span>

            {/* Rotated Floating Card */}
            <motion.div
              ref={cardRef}
              initial={{ rotate: 10, y: 0 }}
              animate={cardInView ? { rotate: 6, y: [0, -12, 0] } : { orotate: 10, y: 0 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: 0.2,
              }}
              className="absolute right-[12%] top-[-40%] z-10 h-36 w-28 overflow-hidden rounded-0 shadow-2xl transition-shadow duration-300 hover:shadow-2xl sm:h-52 sm:w-40 md:h-60 md:w-44"
            >
              <Image
                src="/images/Person_interacting_with_smartwatch_202608111348.jpeg"
                alt="Person interacting with device"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 176px"
                priority
              />
            </motion.div>
          </div>

          {/* Bottom Words */}
          <span className="mt-2 text-3xl text-text sm:text-5xl md:text-6xl">Amplify</span>
          <span className="mt-2 text-3xl text-text sm:text-5xl md:text-6xl">Move</span>
        </motion.div>
      </div>
    </section>
  );
}
