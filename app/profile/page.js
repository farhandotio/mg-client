'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getMe,
  getAddresses,
  logoutUser,
  clearError,
  clearMessage,
} from '@/store/features/authSlice';
import { getMyOrders } from '@/store/features/orderSlice';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  Edit3,
  Camera,
  Clock,
  Loader2,
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redux States
  const { user, addresses, isAuthenticated } = useSelector((state) => state.auth);
  const { orders, loading: orderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    setMounted(true);
    // যদি অলরেডি লগইন থাকে তবেই ডাটা ফেচ হবে
    if (isAuthenticated) {
      dispatch(getMe());
      dispatch(getAddresses());
      dispatch(getMyOrders());
    } else {
      router.push('/auth'); // লগইন না থাকলে অথ পেজে পাঠিয়ে দিবে
    }
  }, [dispatch, isAuthenticated, router]);

  // --- Logout Logic ---
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // ১. রিডাক্স থাঙ্ক কল (এটি এপিআই হিট করবে এবং রিডাক্স স্টেট ক্লিন করবে)
      await dispatch(logoutUser()).unwrap();

      // ২. ক্লিনআপ সাকসেস হলে হোমপেজে রিডাইরেক্ট
      router.push('/');
      router.refresh(); // নেভিবার এবং অন্যান্য কম্পোনেন্ট আপডেট করতে রিফ্রেশ জরুরি
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!mounted || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  const stats = [
    {
      label: 'Total Orders',
      value: orders?.length || '0',
      icon: <Package size={20} />,
      color: 'text-blue-500',
    },
    {
      label: 'Saved Address',
      value: addresses?.length > 0 ? addresses.length : '0',
      icon: <MapPin size={20} />,
      color: 'text-green-500',
    },
    {
      label: 'Account Role',
      value: user?.role || 'User',
      icon: <Shield size={20} />,
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-bg pt-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-8 px-6">
        {/* --- Header & Profile Section --- */}
        <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-bg border-2 border-border flex items-center justify-center overflow-hidden shadow-2xl">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-primary italic uppercase">
                    {user?.fullname?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-bg rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Camera size={18} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black text-text tracking-tighter italic capitalize">
                {user?.fullname}
              </h1>
              <p className="text-pText font-bold uppercase tracking-widest text-[10px] opacity-70 flex items-center justify-center md:justify-start gap-2">
                <Clock size={12} className="text-primary" />
                Joined{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : '2026'}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                <div className="w-fit">
                  <Button text="Edit Profile" size="sm" icon={Edit3} className="rounded-xl" />
                </div>
                <div className="w-fit">
                  <Button text="Settings" size="sm" icon={Settings} className="rounded-xl" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-bg/50 border border-border/50 p-6 rounded-3xl text-center min-w-32.5 hover:border-primary/30 transition-colors shadow-inner"
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
          {/* Left Column: Account Details */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-black text-text italic px-2">Account Information</h3>
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 space-y-6 shadow-xl">
              <InfoItem icon={<Mail />} label="Email Address" value={user?.email || 'N/A'} />
              <InfoItem
                icon={<Phone />}
                label="Phone Number"
                value={user?.phone || 'Not provided'}
              />
              <InfoItem
                icon={<MapPin />}
                label="Primary Address"
                value={
                  addresses?.length > 0
                    ? `${addresses[0].street}, ${addresses[0].city}`
                    : 'No address saved'
                }
              />

              <div className="h-px bg-border/20" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 text-red-500 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-all px-2 w-full cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <LogOut size={18} />
                )}
                {isLoggingOut ? 'Logging out...' : 'Logout Session'}
              </button>
            </div>
          </div>

          {/* Right Column: Recent Orders */}
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
              {orderLoading ? (
                [1, 2].map((n) => (
                  <div key={n} className="h-24 w-full bg-card/20 animate-pulse rounded-3xl" />
                ))
              ) : orders?.length > 0 ? (
                orders.slice(0, 3).map((order) => (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="group bg-card/40 border border-border/50 rounded-3xl p-5 flex items-center gap-6 hover:border-primary/30 transition-all hover:bg-card/60"
                  >
                    <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-primary border border-border/50">
                      <Package size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-text group-hover:text-primary transition-colors">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h4>
                      <p className="text-xs text-pText font-medium italic">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-text">
                        ${order.totalPrice || order.totalAmount}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                          order.orderStatus === 'Delivered'
                            ? 'text-green-500 bg-green-500/10'
                            : order.orderStatus === 'Processing'
                            ? 'text-blue-500 bg-blue-500/10'
                            : 'text-yellow-500 bg-yellow-500/10'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-pText opacity-50 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 bg-card/20 rounded-3xl border-2 border-dashed border-border/50">
                  <p className="text-pText font-bold">No orders found yet.</p>
                  <Link
                    href="/shop"
                    className="text-primary text-xs uppercase font-black mt-2 inline-block hover:underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-3 bg-bg rounded-xl text-primary border border-border/50 group-hover:scale-110 transition-transform shrink-0">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase text-pText tracking-widest opacity-60 mb-1">
          {label}
        </p>
        <p className="text-text font-bold text-sm truncate">{value}</p>
      </div>
    </div>
  );
}
