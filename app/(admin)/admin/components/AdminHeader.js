'use client';
import { Bell, Menu, User } from 'lucide-react';

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="h-20 bg-card backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 z-10">
      <div className="flex items-center gap-4">
        {/* মোবাইল মেনু টগল বাটন */}
        <button
          aria-label="menu toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 bg-bg border border-border rounded-md text-primary"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-sm font-black uppercase tracking-tighter hidden sm:block">
          System <span className="text-primary">Console</span>
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button
          aria-label="bell"
          className="text-pText hover:text-primary transition-colors hidden xs:block"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-[12px] font-black uppercase text-white">Admin</p>
          </div>
          <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <User size={18} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
