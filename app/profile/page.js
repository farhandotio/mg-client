'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Settings,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Edit3,
  Camera,
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  // ডামি ডেটা (আপনার API ডাটা না আসা পর্যন্ত)
  const stats = [
    { label: 'Total Orders', value: '12', icon: <Package size={20} />, color: 'text-blue-500' },
    { label: 'Saved Items', value: '08', icon: <Shield size={20} />, color: 'text-green-500' },
    { label: 'Points', value: '450', icon: <CreditCard size={20} />, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-bg pt-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-8 px-6">
        {/* --- Header & Profile Image Section --- */}
        <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar with Edit Overlay */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-card border-2 border-border flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-primary italic">
                    {user?.fullname?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-bg rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>

            {/* User Basic Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black text-text tracking-tighter italic">
                {user?.fullname || 'Tech Enthusiast'}
              </h1>
              <p className="text-pText font-bold uppercase tracking-widest text-xs opacity-70">
                Member Since January 2026
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                <div className="w-fit">
                  <Button text="Edit Profile" size="sm" icon={Edit3} className="rounded-xl w-fit" />
                </div>
                <div className="w-fit">
                  <Button
                    text="Settings"
                    bgColor="bg-white/5"
                    size="sm"
                    icon={Settings}
                    className="rounded-xl w-fit"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-bg/50 border border-border/50 p-6 rounded-3xl text-center min-w-30"
                >
                  <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
                  <div className="text-2xl font-black text-text">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase text-pText tracking-tighter">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details (Col-5) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-black text-text italic px-2">Account Information</h3>
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 space-y-6">
              <InfoItem icon={<Mail />} label="Email Address" value={user?.email || 'N/A'} />
              <InfoItem icon={<Phone />} label="Phone Number" value="+1 (555) 000-0000" />
              <InfoItem
                icon={<MapPin />}
                label="Shipping Address"
                value="123 Tech Avenue, Silicon Valley, CA"
              />
              <div className="h-px bg-border/50" />
              <button className="flex items-center gap-3 text-red-500 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-opacity px-2">
                <LogOut size={18} /> Logout Session
              </button>
            </div>
          </div>

          {/* Right Column: Recent Activity (Col-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black text-text italic">Recent Orders</h3>
              <Link
                href="/orders"
                className="text-primary text-xs font-black uppercase tracking-widest hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {[1, 2].map((order) => (
                <div
                  key={order}
                  className="group bg-card/40 border border-border/50 rounded-3xl p-5 flex items-center gap-6 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-primary border border-border/50">
                    <Package size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text group-hover:text-primary transition-colors">
                      Order #MG-5502{order}
                    </h4>
                    <p className="text-xs text-pText font-medium italic">Ordered on Dec 28, 2025</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-text">$249.00</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                      Delivered
                    </span>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-pText opacity-50 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              ))}

              {/* Empty State (Optional) */}
              {!user && (
                <div className="text-center py-20 bg-card/20 rounded-3xl border-2 border-dashed border-border/50">
                  <p className="text-pText font-bold">No orders found yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component ---
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-3 bg-bg rounded-xl text-primary border border-border/50 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-pText tracking-widest opacity-60 mb-1">
          {label}
        </p>
        <p className="text-text font-bold text-sm truncate max-w-65">{value}</p>
      </div>
    </div>
  );
}
