'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function FloatingHeadphoneSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance Animation for Text and Image
      gsap.from(textRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(imageRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Subtle Floating Animation for Headphones
      gsap.to(imageRef.current, {
        y: -15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 3.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-bg px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Outer Card Wrapper matching the image border radius and shadow */}
      <div className="relative flex w-full items-center justify-center p-8 py-20 md:p-16 lg:p-24">
        {/* Background Text (Centered & Behind Image) */}
        <h1
          ref={textRef}
          className="pointer-events-none select-none text-center text-3xl font-extrabold leading-[1.15] tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl z-0"
        >
          From pioneering wireless audio to designing state-of-the-art speakers,{' '}
          <span className="italic font-serif">Sonos</span>{' '}
          <span className="text-text/30">
            commitment to innovation that connects and inspires.
          </span>
        </h1>

        {/* Floating Headphone Overlay (Centered & In Front of Text) */}
        <div
          ref={imageRef}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="relative h-72 w-72 sm:h-96 sm:w-96 md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px]">
            <Image
              src="/images/Headphone_floating_against_white__202608111342-removebg-preview.png"
              alt="Floating Sonos Headphone"
              fill
              priority
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 300px, 500px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
