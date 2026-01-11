'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getMe,
  getAddresses,
  updateMe,
  addAddress,
  updateAddress,
  deleteAddress,
  logoutUser,
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
  Trash2,
  X,
  Plus,
  Home,
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // States for Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Form States
  const [editData, setEditData] = useState({ fullname: '', phone: '' });
  const [addressData, setAddressData] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
  });
  const [selectedAddrId, setSelectedAddrId] = useState(null);

  const {
    user,
    addresses,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const { orders, loading: orderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      dispatch(getMe());
      dispatch(getAddresses());
      dispatch(getMyOrders());
    } else {
      router.push('/auth');
    }
  }, [dispatch, isAuthenticated, router]);

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // --- USER UPDATE HANDLER ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateMe(editData)).unwrap();
      toast.success('Identity Updated');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err);
    }
  };

  // --- ADDRESS ADD/UPDATE HANDLER ---
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingAddress) {
        await dispatch(updateAddress({ addressId: selectedAddrId, addressData })).unwrap();
        toast.success('Node Updated');
      } else {
        await dispatch(addAddress(addressData)).unwrap();
        toast.success('New Node Added');
      }
      setIsAddressModalOpen(false);
      resetAddressForm();
    } catch (err) {
      toast.error(err);
    }
  };

  const resetAddressForm = () => {
    setAddressData({ phone: '', street: '', city: '', state: '', zip: '', country: 'Bangladesh' });
    setIsEditingAddress(false);
    setSelectedAddrId(null);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Erase this shipping node from database?')) {
      try {
        await dispatch(deleteAddress(id)).unwrap();
        toast.success('Node Erased');
      } catch (err) {
        toast.error(err);
      }
    }
  };

  if (!mounted || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-bg pt-10 pb-20 relative">
      <div className="max-w-7xl mx-auto space-y-10 px-6">
        {/* --- Header Section (Profile Card) --- */}
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
            <div className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[3rem] bg-bg border-2 border-border flex items-center justify-center overflow-hidden shadow-2xl">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-black text-primary italic uppercase">
                    {user?.fullname?.charAt(0)}
                  </span>
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-bg rounded-2xl shadow-xl hover:scale-110 transition">
                <Camera size={20} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-text tracking-tighter italic uppercase leading-none">
                {user?.fullname}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={() => {
                    setEditData({ fullname: user.fullname, phone: user.phone || '' });
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-bg font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-lg transition-all"
                >
                  <Edit3 size={14} /> Edit Identity
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <LogOut size={14} />
                  )}{' '}
                  Logout Session
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <StatBox label="Orders" value={orders?.length} icon={<Package size={22} />} />
              <StatBox label="Nodes" value={addresses?.length} icon={<MapPin size={22} />} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- Left Column: Addresses --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-2xl font-black italic">Shipping Nodes</h3>
                <p className="text-[10px] font-bold text-pText uppercase tracking-widest">
                  Active delivery endpoints
                </p>
              </div>
              <button
                onClick={() => {
                  resetAddressForm();
                  setIsAddressModalOpen(true);
                }}
                className="p-3 bg-primary text-bg rounded-2xl hover:scale-110 transition shadow-lg"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {addresses?.length > 0 ? (
                addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="group bg-card/30 border border-border/50 p-6 rounded-[2.5rem] flex justify-between items-center hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary">
                        <Home size={14} />
                        <p className="text-xs font-black uppercase tracking-widest text-text">
                          {addr.street}
                        </p>
                      </div>
                      <p className="text-[10px] font-bold text-pText italic uppercase">
                        {addr.city}, {addr.zip}
                      </p>
                      <p className="text-[10px] text-primary font-mono">{addr.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAddressData(addr);
                          setSelectedAddrId(addr._id);
                          setIsEditingAddress(true);
                          setIsAddressModalOpen(true);
                        }}
                        className="p-2 text-pText hover:text-primary transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="p-2 text-pText hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-card/10 rounded-[2.5rem] border border-dashed border-border/50 text-pText text-[10px] font-black uppercase italic">
                  No nodes established
                </div>
              )}
            </div>
          </div>

          {/* --- Right Column: Recent Orders --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex justify-between items-end px-2">
              <h3 className="text-2xl font-black italic">Latest Transmissions</h3>
              <Link
                href="/orders"
                className="text-primary text-[10px] font-black uppercase tracking-widest border-b border-primary/20"
              >
                Access Archives
              </Link>
            </div>
            <div className="space-y-4">
              {orderLoading ? (
                <Loader2 className="animate-spin mx-auto text-primary" />
              ) : (
                orders?.slice(0, 5).map((order) => (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="flex items-center gap-6 bg-card/20 border border-border/50 p-6 rounded-[2.5rem] hover:border-primary/40 transition-all group"
                  >
                    <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-primary border border-border/50">
                      <Package size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm uppercase">#{order._id.slice(-8)}</h4>
                      <p className="text-[10px] text-pText font-black mt-1">
                        {new Date(order.createdAt).toDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-text font-mono">
                        ৳{order.pricing?.totalPrice?.toLocaleString()}
                      </p>
                      <span className="text-[9px] font-black uppercase px-2 py-1 bg-primary/10 text-primary rounded-md">
                        {order.orderStatus}
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-pText group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL SYSTEM --- */}
      {(isEditModalOpen || isAddressModalOpen) && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
            onClick={() => {
              setIsEditModalOpen(false);
              setIsAddressModalOpen(false);
            }}
          />

          <div className="relative bg-card border border-border/50 w-full max-w-xl p-8 md:p-12 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
            <button
              className="absolute top-8 right-8 text-pText hover:text-primary transition"
              onClick={() => {
                setIsEditModalOpen(false);
                setIsAddressModalOpen(false);
              }}
            >
              <X size={32} />
            </button>

            {isEditModalOpen ? (
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <h2 className="text-3xl font-black italic uppercase">Sync Identity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup
                    label="Full Name"
                    value={editData.fullname}
                    onChange={(v) => setEditData({ ...editData, fullname: v })}
                  />
                  <InputGroup
                    label="Phone Number"
                    value={editData.phone}
                    onChange={(v) => setEditData({ ...editData, phone: v })}
                  />
                </div>
                <Button
                  text={authLoading ? 'Syncing...' : 'Update Protocol'}
                  className="w-full"
                  disabled={authLoading}
                />
              </form>
            ) : (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <h2 className="text-3xl font-black italic uppercase">
                  {isEditingAddress ? 'Update Node' : 'Initialize Node'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup
                    label="Contact Phone"
                    value={addressData.phone}
                    onChange={(v) => setAddressData({ ...addressData, phone: v })}
                  />
                  <InputGroup
                    label="Street / Area"
                    value={addressData.street}
                    onChange={(v) => setAddressData({ ...addressData, street: v })}
                  />
                  <InputGroup
                    label="City"
                    value={addressData.city}
                    onChange={(v) => setAddressData({ ...addressData, city: v })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputGroup
                      label="State"
                      value={addressData.state}
                      onChange={(v) => setAddressData({ ...addressData, state: v })}
                    />
                    <InputGroup
                      label="Zip"
                      value={addressData.zip}
                      onChange={(v) => setAddressData({ ...addressData, zip: v })}
                    />
                  </div>
                </div>
                <Button
                  text={authLoading ? 'Transmitting...' : 'Establish Node'}
                  className="w-full"
                  disabled={authLoading}
                />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-bg/40 border border-border/40 p-5 rounded-3xl text-center min-w-28">
      <div className="text-primary mb-2 flex justify-center">{icon}</div>
      <div className="text-2xl font-black text-text font-mono leading-none">{value || 0}</div>
      <p className="text-[9px] font-black uppercase text-pText tracking-widest mt-2">{label}</p>
    </div>
  );
}

function InputGroup({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-pText">
        {label}
      </label>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg/50 border border-border p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
      />
    </div>
  );
}
