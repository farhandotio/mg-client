'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ category, title }) {
  return (
    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-pText mb-12 bg-card/20 w-fit px-5 py-2.5 rounded-full border border-border/30 backdrop-blur-sm">
      <Link href="/shop" className="hover:text-primary transition-colors">
        Shop
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
