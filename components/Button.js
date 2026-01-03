'use client';
import React from 'react';
import Link from 'next/link';

export default function Button({
  text,
  href,
  url,
  icon: Icon,
  size = 'md',
  bgColor = 'bg-primary',
  className = '',
  type = 'button',
  loading = false,
  ...props
}) {
  const sizeClasses =
    size === 'xs'
      ? 'h-7 px-3 text-xs'
      : size === 'sm'
      ? 'h-8 px-4 text-sm'
      : size === 'lg'
      ? 'h-12 px-8 text-base'
      : size === 'xl'
      ? 'h-14 px-10 text-lg'
      : size === '2xl'
      ? 'h-20 px-14 text-2xl tracking-tighter'
      : 'h-10 px-6 text-sm';

  const baseClasses = `relative inline-flex items-center gap-3 overflow-hidden group font-black justify-center text-text whitespace-nowrap rounded-2xl transition-all w-full cursor-pointer shadow-lg disabled:opacity-70 ${bgColor} ${
    bgColor === 'bg-primary' ? 'shadow-primary/40 text-bg' : 'shadow-card border border-border'
  } ${sizeClasses} ${className}`;

  const innerSpanClasses = `absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none`;

  const content = (
    <>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          <span className="uppercase tracking-widest">{text}</span>
        </>
      )}
      <span className={innerSpanClasses}></span>
    </>
  );

  if (href)
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );

  // Next.js Link এর জন্য url চেক
  if (url)
    return (
      <Link href={url} className={baseClasses} {...props}>
        {content}
      </Link>
    );

  return (
    <button type={type} className={baseClasses} disabled={loading} {...props}>
      {content}
    </button>
  );
}
