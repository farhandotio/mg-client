'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ category, title }) {
  return (
    <nav className="flex items-center gap-3 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-pText mb-5 w-fit">
      <Link href="/shop" className="hover:text-primary transition-colors">
        শপ
      </Link>

      <ChevronRight size={10} className="opacity-30" />

      {category && (
        <>
          <Link
            href={`/category/${category.slug}`}
            className="text-primary hover:opacity-80 transition-opacity"
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
