'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ category, title }) {
  return (
    <nav className="flex items-center gap-3 text-[12px] md:text-sm font-medium uppercase tracking-tighter text-pText mb-5 w-fit">
      <Link href="/shop" className="hover:text-secondary transition-colors">
        শপ
      </Link>

      <ChevronRight size={10} className="opacity-30" />

      {category && (
        <>
          <Link
            href={`/category/${category.slug}`}
            className="text-secondary hover:opacity-80 transition-opacity"
          >
            {category.name}
          </Link>
          <ChevronRight size={10} className="opacity-30" />
        </>
      )}

      <span className="opacity-40 truncate max-w-37 italic">{title}</span>
    </nav>
  );
}
