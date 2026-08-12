'use client';
import { useState } from 'react';
import AdminProtection from '@/components/AdminProtection';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminProtection>
      <div className="flex h-screen bg-bg overflow-hidden">
        <aside className="hidden lg:flex lg:shrink-0">
          <AdminSidebar />
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-70 bg-card border-r border-border animate-in slide-in-from-left duration-500 ">
              <div className="absolute right-4 top-5">
                <button
                  aria-label="closs sidebar"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-pText p-2"
                >
                  <X size={24} />
                </button>
              </div>
              <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 relative overflow-y-auto no-scrollbar focus:outline-none p-4 md:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminProtection>
  );
}
