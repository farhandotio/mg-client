'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function KeywordCardSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const textGroupRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance animation for background texts
      gsap.from(textGroupRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Floating tilt animation for the image card
      gsap.fromTo(
        cardRef.current,
        { rotation: 10, y: 0 },
        {
          rotation: 6,
          y: -12,
          repeat: -1,
          yoyo: true,
          duration: 3,
          ease: 'sine.inOut',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-bg px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Outer Card Wrapper */}
      <div className="relative flex w-full items-center justify-center">
        {/* Typographic Layout Container */}
        <div
          ref={textGroupRef}
          className="relative flex flex-col items-center justify-center font-bold tracking-tight select-none"
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
            <span className="text-3xl font-extrabold text-[#D83B25] sm:text-5xl md:text-6xl lg:text-7xl">
              Harmony
            </span>

            <span className="text-3xl text-danger/20 blur-[1px] sm:text-5xl md:text-6xl lg:text-7xl">
              Harmony
            </span>

            {/* Rotated Floating Card */}
            <div
              ref={cardRef}
              className="absolute right-[12%] top-[-40%] z-10 h-36 w-28 overflow-hidden rounded-2xl shadow-2xl transition-shadow duration-300 hover:shadow-2xl sm:h-52 sm:w-40 md:h-60 md:w-44"
            >
              <Image
                src="/images/Person_interacting_with_smartwatch_202608111348.jpeg"
                alt="Person interacting with device"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 176px"
                priority
              />
            </div>
          </div>

          {/* Bottom Words */}
          <span className="mt-2 text-3xl text-text sm:text-5xl md:text-6xl">Amplify</span>
          <span className="mt-2 text-3xl text-text sm:text-5xl md:text-6xl">Move</span>
        </div>
      </div>
    </section>
  );
}
