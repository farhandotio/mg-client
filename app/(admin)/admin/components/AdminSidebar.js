'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Layers, Users, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
  { name: 'Categories', icon: Layers, path: '/admin/categories' },
  { name: 'Orders', icon: Users, path: '/admin/orders' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-card border-r border-border h-full flex flex-col">
      {/* লোগো সেকশন */}
      <div className="p-8">
        <h2 className="text-2xl font-black italic text-primary uppercase tracking-tighter">
          Vault <span className="text-white">Admin</span>
        </h2>
      </div>

      {/* নেভিগেশন লিংক */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em] ${
                isActive
                  ? 'bg-primary text-white shadow-[0_10px_20px_-10px_rgba(255,77,0,0.3)]'
                  : 'text-pText hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* নিচের অংশ */}
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-4 w-full px-4 py-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/5 rounded-2xl transition-all">
          <LogOut size={18} />
          Terminating Session
        </button>
      </div>
    </div>
  );
}
