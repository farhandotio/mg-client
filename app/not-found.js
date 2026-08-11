'use client';
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Google-style broken robot, rendered in SVG so no image asset is needed */}
        <div className="mb-6" aria-hidden="true">
          <svg
            width="180"
            height="150"
            viewBox="0 0 180 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* antenna */}
            <line x1="90" y1="8" x2="90" y2="26" stroke="#DADCE0" strokeWidth="3" />
            <circle cx="90" cy="8" r="5" fill="#4285F4" />

            {/* head */}
            <rect
              x="45"
              y="26"
              width="90"
              height="70"
              rx="10"
              fill="#F1F3F4"
              stroke="#DADCE0"
              strokeWidth="2"
            />

            {/* eyes: one normal, one X'd out, classic broken-robot detail */}
            <circle cx="72" cy="58" r="7" fill="#FFFFFF" stroke="#DADCE0" strokeWidth="2" />
            <circle cx="72" cy="58" r="3" fill="#4285F4" />
            <g stroke="#EA4335" strokeWidth="3" strokeLinecap="round">
              <line x1="101" y1="51" x2="115" y2="65" />
              <line x1="115" y1="51" x2="101" y2="65" />
            </g>

            {/* mouth */}
            <rect x="72" y="76" width="36" height="6" rx="3" fill="#DADCE0" />

            {/* body */}
            <rect
              x="55"
              y="100"
              width="70"
              height="40"
              rx="8"
              fill="#F1F3F4"
              stroke="#DADCE0"
              strokeWidth="2"
            />
            <circle cx="90" cy="120" r="9" fill="#FBBC04" />

            {/* one arm detached, lying separately, to read as "broken" */}
            <rect
              x="20"
              y="112"
              width="26"
              height="10"
              rx="5"
              fill="#F1F3F4"
              stroke="#DADCE0"
              strokeWidth="2"
            />
            <rect
              x="128"
              y="106"
              width="10"
              height="26"
              rx="5"
              fill="#F1F3F4"
              stroke="#DADCE0"
              strokeWidth="2"
            />
          </svg>
        </div>

        <h1 className="text-[22px] leading-8 font-normal text-[#202124]">That&rsquo;s an error.</h1>

        <p className="mt-2 text-sm leading-6 text-[#3c4043]">
          The requested URL was not found on this server. That&rsquo;s all we know.
        </p>

        <div className="mt-6">
          <Link href="/" className="text-sm text-[#1a73e8] hover:underline underline-offset-2">
            Go back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
