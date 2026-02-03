'use client';
import React from 'react';
import Link from 'next/link';

export default function Button({
  text,
  href,
  url,
  icon: Icon,
  size = 'md',
  className = '',
  type = 'button',
  fillColor = 'bg-primary',
  loading = false,
  arialabel,
  ...props
}) {
  const sizeClasses =
    size === 'xs'
      ? 'h-7 px-3 text-xs'
      : size === 'sm'
        ? 'h-8 px-4 text-xs'
        : size === 'lg'
          ? 'h-13 px-8 text-base'
          : size === 'xl'
            ? 'h-16 px-10 text-lg'
            : size === '2xl'
              ? 'h-20 px-14 text-2xl tracking-tighter'
              : 'h-11 px-6 text-sm';

  const baseClasses = `
    relative inline-flex items-center gap-3 overflow-hidden group font-black justify-center 
    text-text whitespace-nowrap rounded-md transition-all duration-500 w-full cursor-pointer disabled:opacity-70 bg-card border ${fillColor} md:bg-card max-md:text-white border-border/20 
    hover:border-transparent hover:-translate-y-[1px]
    ${sizeClasses} ${className}
  `;

  const fillLayer = `
    absolute bottom-0 left-0 w-full h-0 
    transition-all duration-500 ease-out 
    group-hover:h-full -z-10
   ${fillColor}`;

  const content = (
    <>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-primary group-hover:text-white"
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
          <span className="group-hover:text-white transition-colors duration-300">Processing...</span>
        </span>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 group-hover:text-white transition-colors duration-300" />}
          <span className="uppercase tracking-widest group-hover:text-white transition-colors duration-300">
            {text}
          </span>
        </>
      )}
      {/* ফিল লেয়ার */}
      <span className={`${fillLayer}`}></span>
    </>
  );

  if (href)
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );

  if (url)
    return (
      <Link href={url} className={baseClasses} {...props}>
        {content}
      </Link>
    );

  return (
    <button
      aria-label={arialabel || "button"}
      type={type}
      className={baseClasses}
      disabled={loading}
      {...props}
    >
      {content}
    </button>
  );
}
