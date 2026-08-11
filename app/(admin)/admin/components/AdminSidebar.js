'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Tag,
  ShoppingCart,
  Users,
  ExternalLink,
  LogOut,
  Plus,
  Zap,
  Activity,
  Box,
  Cpu,
} from 'lucide-react';
import { logoutUser } from '@/store/features/authSlice';
import { useDispatch } from 'react-redux';

export default function AdminSidebar({ closeSidebar }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser()).then((result) => {
      if (logoutUser.fulfilled.match(result)) {
        router.push('/');
      }
    });
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      name: 'Products',
      icon: Box,
      path: '/admin/products',
      createPath: '/admin/products/create',
    },
    {
      name: 'Categories',
      icon: Layers,
      path: '/admin/categories',
      createPath: '/admin/categories/create',
    },
    {
      name: 'Brands',
      icon: Tag,
      path: '/admin/brands',
      createPath: '/admin/brands/create',
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users',
    },
  ];

  return (
    <div className="w-full lg:w-72 bg-bg border-r border-border/60 h-full flex flex-col relative overflow-hidden">
      {/* --- Background Accent --- */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* --- Brand Header --- */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary rounded-md shadow-[0_0_15px_rgba(255,111,92,0.4)]">
            <Cpu size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-medium italic text-text uppercase tracking-tighterer leading-none">
            VAULT{' '}
            <span className="text-primary text-sm block tracking-wide not-italic mt-1">
              OS_v2.6
            </span>
          </h2>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between gap-2 px-4 py-3 bg-card/50 border border-border/50 rounded-md text-[11px] font-medium uppercase tracking-tighter text-pText hover:text-primary transition-all group backdrop-blur-md"
        >
          Explore Store
          <ExternalLink
            size={12}
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50"
          />
        </Link>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        <div className="px-4 mb-4 flex items-center gap-2">
          <Activity size={10} className="text-primary animate-pulse" />
          <p className="text-[10px] font-medium text-pText/40 uppercase tracking-wide">
            Core_Management
          </p>
        </div>

        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <div key={item.path} className="group relative">
              <div className="flex items-center gap-1">
                <Link
                  href={item.path}
                  onClick={closeSidebar}
                  className={`flex-1 flex items-center gap-4 px-4 py-3.5 rounded-md font-medium text-[12px] uppercase tracking-tighter transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-primary text-white shadow-[0_10px_20px_rgba(255,111,92,0.2)]'
                      : 'text-pText/60 hover:bg-card hover:text-text'
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`${
                      isActive ? 'text-white' : 'text-primary/50 group-hover:text-primary'
                    } transition-colors`}
                  />
                  <span className="relative z-10">{item.name}</span>

                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                  )}
                </Link>

                {/* --- Quick Create Button --- */}
                {item.createPath && (
                  <Link
                    href={item.createPath}
                    onClick={closeSidebar}
                    className={`p-3.5 rounded-md border transition-all hover:scale-105 active:scale-90 ${
                      isActive
                        ? 'bg-primary/20 border-primary/30 text-white hover:bg-primary/40'
                        : 'bg-card border-border/50 text-pText/40 hover:text-primary hover:border-primary/40'
                    }`}
                    title={`Create New ${item.name}`}
                  >
                    <Plus size={16} strokeWidth={3} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* --- System Health / Stats --- */}
      <div className="px-6 py-4 space-y-3">
        <div className="bg-card/30 rounded-md p-4 border border-border/40 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-medium uppercase text-pText/40 tracking-tighter">
              Network_Stability
            </span>
            <span className="text-[10px] font-medium text-green-500 uppercase">99.8%</span>
          </div>
          <div className="w-full bg-bg h-1 rounded-full overflow-hidden">
            <div className="w-[99.8%] h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </div>
        </div>
      </div>

      {/* --- Footer (Logout) --- */}
      <div className="p-4 bg-card/20 backdrop-blur-lg border-t border-border/40">
        <button
          aria-label="logout"
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-5 text-red-500 font-medium text-[12px] uppercase tracking-tighter hover:bg-red-500/10 rounded-lg transition-all group relative overflow-hidden border border-transparent hover:border-red-500/20"
        >
          <div className="absolute inset-0 bg-red-500/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform relative z-10"
          />
          <span className="relative z-10">Terminate Session</span>
        </button>
      </div>
    </div>
  );
}
