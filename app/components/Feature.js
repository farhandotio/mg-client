'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function Feature() {
  const featuredProducts = [
    {
      _id: '1',
      title: 'iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'Smartphones',
      price: { base: 1199, original: 1299 },
      rating: 4.9,
      numReviews: 2847,
      isNew: true,
      discountPercentage: 8,
      images: [
        {
          url: 'https://imgs.search.brave.com/G1lrzAcX4OiD6m7GZyK955F66uo3VaIkURzpxPS5n8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LmFpcXVpY2tkcmF3/LmNvbS9pbWdjb21w/cmVzc2VkL2ltZy9j/b21wcmVzc2VkXzEw/YmM2NGIwNDRmN2I2/MjhhZTljNzcyZDI3/MzU1YzBlLndlYnA',
        },
      ],
    },
    {
      _id: '2',
      title: 'MacBook Pro 16"',
      brand: 'Apple',
      category: 'Laptops',
      price: { base: 2499, original: 2699 },
      rating: 4.8,
      numReviews: 1562,
      isNew: false,
      discountPercentage: 7,
      images: [
        {
          url: 'https://imgs.search.brave.com/XEcDxFeG-exZTu1wktJwt6Jjl9URs20pNsgks9Opw2c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Bo/b3RvLTE2NjE2NjI4/NTAyMjYtODNjOTgx/ZWQ0ZWJhP2ZtPWpw/ZyZxPTYwJnc9MzAw/MCZpeGxpYj1yYi00/LjEuMCZpeGlkPU0z/d3hNakEzZkRCOE1I/eHpaV0Z5WTJoOE1Y/eDhiR0Z3ZEc5d0pU/SXdZMjl0Y0hWMFpY/SjhaVzU4TUh4OE1I/eDhmREE9',
        },
      ],
    },
    {
      _id: '3',
      title: 'PlayStation 5 Pro',
      brand: 'Sony',
      category: 'Gaming',
      price: { base: 699 },
      rating: 4.9,
      numReviews: 8934,
      isNew: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
  ];

  return (
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header with Title and "View All" Button */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-text tracking-tight">Featured Products</h2>
            <p className="text-pText font-medium">Handpicked selection of premium gadgets</p>
          </div>

          <button className="flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-2xl text-text font-bold hover:border-primary/50 hover:bg-white/5 transition-all group">
            View All{' '}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
