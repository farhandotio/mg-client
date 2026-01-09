'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Tag,
  ShoppingCart,
  Users,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export default function AdminSidebar({ closeSidebar }) {
  const pathname = usePathname();

  // মেনু আইটেমগুলোকে অর্গানাইজ করা হয়েছে
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { name: 'Categories', icon: Layers, path: '/admin/categories' },
    { name: 'Brands', icon: Tag, path: '/admin/brands' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Users', icon: Users, path: '/admin/users' },
  ];

  return (
    <div className="w-full lg:w-72 bg-card border-r border-border h-full flex flex-col">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black italic text-primary uppercase tracking-tighter">
          Vault Admin
        </h2>

        <Link
          href="/"
          target="_blank"
          className="mt-4 flex items-center justify-between gap-2 px-4 py-2 bg-white/5 border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-pText hover:text-primary transition-all group"
        >
          View Live Store
          <ExternalLink
            size={12}
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 mb-2 text-[8px] font-black text-pText/40 uppercase tracking-[0.3em]">
          Management
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-text'
                  : 'text-pText hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-white' : 'text-primary/70'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* --- নিচের অংশ (Logout) --- */}
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-4 w-full px-4 py-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/5 rounded-2xl transition-all group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
