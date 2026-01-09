'use client';
import { useSelector } from 'react-redux';
import { Bell, Search, User } from 'lucide-react';

export default function AdminHeader() {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-20 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-8 z-10">
      <div className="relative w-96 hidden md:block">
        <input
          type="text"
          placeholder="Search for data..."
          className="w-full bg-bg border border-border rounded-xl py-2 px-10 text-xs focus:outline-none focus:border-primary/50"
        />
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-pText" />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-pText hover:text-primary transition-colors">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase text-white">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-[8px] font-bold text-primary uppercase tracking-tighter">
              System Overseer
            </p>
          </div>
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <User size={20} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
