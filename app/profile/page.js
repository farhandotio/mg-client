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
  MapPin,
  Package,
  LogOut,
  ChevronRight,
  Edit3,
  Loader2,
  Trash2,
  X,
  Plus,
  Home,
  Phone,
  Globe,
  Link as LinkIcon,
  ImageIcon,
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
  // N.B. Backend schema uses 'image', frontend might receive 'avatar' or 'image'.
  // We map it to 'image' for updates.
  const [editData, setEditData] = useState({
    fullname: '',
    phone: '',
    image: '',
  });

  const [addressData, setAddressData] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
    isDefault: false,
  });

  const [selectedAddrId, setSelectedAddrId] = useState(null);

  const { user, addresses, isAuthenticated, loading } = useSelector((state) => state.auth);

  const { orders, loading: orderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      dispatch(getMe());
      dispatch(getAddresses());
      dispatch(getMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      toast.success('Session Terminated');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // --- UPDATE PROFILE ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Sending data to backend
      await dispatch(updateMe(editData)).unwrap();
      toast.success('Profile Protocol Updated');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Update Failed');
    }
  };

  // --- ADDRESS HANDLER ---
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressData.street || !addressData.city || !addressData.phone || !addressData.zip) {
      return toast.error('Required coordinates missing');
    }
    try {
      if (isEditingAddress && selectedAddrId) {
        await dispatch(updateAddress({ addressId: selectedAddrId, addressData })).unwrap();
        toast.success('Node Coordinates Updated');
      } else {
        await dispatch(addAddress(addressData)).unwrap();
        toast.success('New Shipping Node Established');
      }
      setIsAddressModalOpen(false);
      resetAddressForm();
    } catch (err) {
      toast.error('Operation Failed');
    }
  };

  const resetAddressForm = () => {
    setAddressData({
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'Bangladesh',
      isDefault: false,
    });
    setIsEditingAddress(false);
    setSelectedAddrId(null);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Terminate this shipping node?')) {
      try {
        await dispatch(deleteAddress(id)).unwrap();
        toast.success('Node Terminated');
      } catch (err) {
        toast.error('Delete Failed');
      }
    }
  };

  // Prepare Edit Data when opening modal
  const openEditModal = () => {
    setEditData({
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      image: user?.image || user?.avatar || '', // Handling both cases if backend varies
    });
    setIsEditModalOpen(true);
  };

  if (!mounted) return <div className="min-h-screen bg-bg" />;

  return (
    <div className="min-h-screen h-full bg-bg pt-6 pb-20 relative animate-in fade-in duration-700 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 relative z-10">
        {/* --- HERO SECTION: User Card --- */}
        <div className="relative bg-card/30 backdrop-blur-3xl border border-white/5 md:border-border/40 rounded-md md:rounded-[3rem] p-6 md:p-10 overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Avatar Circle */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full md:rounded-lg bg-bg border-[3px] border-border/60 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] relative z-10">
                {user?.image || user?.avatar ? (
                  <img
                    src={user.image || user.avatar}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="profile"
                  />
                ) : (
                  <span className="text-5xl md:text-7xl font-black text-primary/80 italic uppercase select-none">
                    {user?.fullname?.charAt(0)}
                  </span>
                )}
              </div>

              {/* Edit Badge (Visual only, triggers modal via main button) */}
              <div className="absolute bottom-2 right-2 md:-bottom-2 md:-right-2 bg-primary text-white p-2 md:p-3 rounded-md shadow-lg z-20 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <Edit3 size={16} />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full">
              <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text tracking-tighter italic uppercase leading-[0.9]">
                  {user?.fullname || 'Unknown Entity'}
                </h1>
                <p className="text-xs md:text-sm font-bold text-primary/80 tracking-[0.3em] uppercase mt-2">
                  {user?.role === 'admin' ? 'System Administrator' : 'Authorized User'}
                </p>
                <p className="text-xs text-pText/50 font-mono mt-1">ID: {user?._id}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full">
                <button
                  aria-label="edit open"
                  onClick={openEditModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-text font-black uppercase text-[12px] tracking-widest rounded-md hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_20px_rgba(255,111,92,0.4)] transition-all duration-300"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
                <button
                  aria-label="logout"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-red-500/5 text-red-500 border border-red-500/20 font-black uppercase text-[12px] tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <LogOut size={14} />
                  )}
                  Terminate
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto min-w-50">
              <StatCard label="Orders" value={orders?.length} delay="0" />
              <StatCard label="Nodes" value={addresses?.length} delay="100" />
            </div>
          </div>
        </div>

        {/* --- MAIN GRID CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT: ADDRESSES --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-xl md:text-2xl font-black italic text-text">Shipping Nodes</h3>
                <p className="text-[11px] font-bold text-pText uppercase tracking-widest">
                  Delivery Endpoints
                </p>
              </div>
              <button
                aria-label="plus"
                onClick={() => {
                  resetAddressForm();
                  setIsAddressModalOpen(true);
                }}
                className="p-3 bg-primary text-white rounded-md hover:scale-105 active:scale-95 transition shadow-lg shadow-primary/20"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {addresses?.length > 0 ? (
                addresses.map((addr, idx) => (
                  <div
                    key={addr._id}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    className="group relative bg-card/40 border border-white/5 p-5 rounded-md hover:border-primary/40 transition-all duration-300 hover:bg-card/60 animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards"
                  >
                    {/* Active Indicator Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-1/2 transition-all duration-300 rounded-r-full" />

                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-primary">
                          <MapPin size={14} className="shrink-0" />
                          <p className="text-xs font-black uppercase tracking-widest text-text line-clamp-1">
                            {addr.street}
                          </p>
                        </div>
                        <p className="text-[12px] font-bold text-pText/70 italic uppercase pl-6">
                          {addr.city}, {addr.zip} • {addr.state}
                        </p>
                        <div className="flex items-center gap-2 pl-6">
                          <p className="text-[12px] text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">
                            {addr.phone}
                          </p>
                          {addr.isDefault && (
                            <span className="text-[10px] font-black bg-white/10 text-white px-2 py-0.5 rounded-full tracking-wider">
                              DEFAULT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button
                          aria-label="edit address"
                          onClick={() => {
                            setAddressData({ ...addr });
                            setSelectedAddrId(addr._id);
                            setIsEditingAddress(true);
                            setIsAddressModalOpen(true);
                          }}
                          className="p-2 bg-bg text-pText hover:text-primary rounded-md hover:bg-white/5 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          aria-label="delete address"
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="p-2 bg-bg text-pText hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-card/20 rounded-md border border-dashed border-border/40">
                  <p className="text-pText/40 text-[12px] font-black uppercase tracking-widest">
                    No coordinates found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT: ORDERS --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-xl md:text-2xl font-black italic text-text">Data Logs</h3>
                <p className="text-[11px] font-bold text-pText uppercase tracking-widest">
                  Recent Acquisitions
                </p>
              </div>
              <Link
                href="/orders"
                className="text-primary text-[12px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
              >
                View Archive
              </Link>
            </div>

            <div className="space-y-3">
              {orderLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={30} />
                </div>
              ) : (
                orders?.slice(0, 5).map((order, idx) => (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-card/30 border border-white/5 p-5 rounded-md hover:bg-card/50 hover:border-primary/30 transition-all group animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards"
                  >
                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                      <div className="w-12 h-12 bg-bg rounded-md flex items-center justify-center text-primary/80 border border-white/5 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                        <Package size={20} />
                      </div>
                      <div className="sm:hidden">
                        <span
                          className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md border ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-500/10 border-green-500/20 text-green-500'
                              : 'bg-primary/10 border-primary/20 text-primary'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-text/90 uppercase truncate group-hover:text-primary transition-colors">
                        Order #{order._id.slice(-6)}
                      </h4>
                      <p className="text-[12px] text-pText/60 font-black mt-1 uppercase tracking-wider">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      <div className="text-right">
                        <p className="text-base font-black text-text font-mono">
                          ৳{order.pricing?.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <span
                          className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-md border ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-500/10 border-green-500/20 text-green-500'
                              : 'bg-primary/10 border-primary/20 text-primary'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-pText/50 group-hover:text-primary group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL SYSTEM --- */}
      {(isEditModalOpen || isAddressModalOpen) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg/80 backdrop-blur-xl transition-opacity animate-in fade-in"
            onClick={() => {
              setIsEditModalOpen(false);
              setIsAddressModalOpen(false);
            }}
          />

          <div className="relative bg-card border border-white/10 w-full max-w-lg p-6 md:p-10 rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Modal Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary shadow-[0_0_20px_rgba(255,111,92,0.8)]" />

            <button
              aria-label="cross model"
              className="absolute top-2 right-2 md:top-6 md:right-6 text-pText hover:text-red-500 transition bg-white/5 p-2 rounded-full hover:bg-white/10"
              onClick={() => {
                setIsEditModalOpen(false);
                setIsAddressModalOpen(false);
              }}
            >
              <X size={20} />
            </button>

            {/* --- EDIT PROFILE MODAL --- */}
            {isEditModalOpen && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">
                    Update Protocol
                  </h2>
                  <p className="text-[12px] text-pText uppercase tracking-widest mt-2">
                    Modify Identity Data
                  </p>
                </div>

                <div className="space-y-5">
                  <InputGroup
                    label="Full Name"
                    value={editData.fullname}
                    onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
                    icon={<User size={16} />}
                  />
                  <InputGroup
                    label="Comms (Phone)"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    icon={<Phone size={16} />}
                    placeholder="+880..."
                  />

                  {/* --- Image URL Input with Preview --- */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-black uppercase tracking-[0.2em] text-pText/60 ml-2">
                      Avatar URL Link
                    </label>
                    <div className="flex gap-3">
                      <div className="relative group flex-1">
                        <input
                          value={editData.image}
                          onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="w-full bg-bg border border-border rounded-md p-4 pl-11 text-xs font-bold text-text outline-none focus:border-primary transition-all shadow-inner placeholder:text-pText/20"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pText">
                          <LinkIcon size={16} />
                        </div>
                      </div>
                      {/* Preview Box */}
                      <div className="w-12 h-12 rounded-md bg-bg border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {editData.image ? (
                          <img
                            src={editData.image}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        ) : (
                          <ImageIcon size={16} className="text-pText/30" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  arialabel="submit"
                  type="submit"
                  text={loading ? 'Uploading Data...' : 'Execute Update'}
                  className="w-full py-4 rounded-md mt-4"
                  disabled={loading}
                />
              </form>
            )}

            {/* --- ADD/EDIT ADDRESS MODAL --- */}
            {isAddressModalOpen && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">
                    {isEditingAddress ? 'Re-Route Node' : 'New Coordinate'}
                  </h2>
                  <p className="text-[12px] text-pText uppercase tracking-widest mt-2">
                    Logistics Data Entry
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Contact Phone*"
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      icon={<Phone size={16} />}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Street Address*"
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                      icon={<MapPin size={16} />}
                      placeholder="House, Road, Block"
                    />
                  </div>
                  <InputGroup
                    label="City*"
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  />
                  <InputGroup
                    label="ZIP Code*"
                    value={addressData.zip}
                    onChange={(e) => setAddressData({ ...addressData, zip: e.target.value })}
                  />
                  <InputGroup
                    label="State / District*"
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  />
                  <InputGroup
                    label="Country"
                    value={addressData.country}
                    disabled
                    icon={<Globe size={16} />}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-bg/50 rounded-md border border-white/5">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressData.isDefault}
                    onChange={(e) =>
                      setAddressData({ ...addressData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-[12px] font-bold uppercase tracking-widest cursor-pointer select-none text-pText"
                  >
                    Set as Default Node
                  </label>
                </div>

                <Button
                  arialabel="submit"
                  type="submit"
                  text={
                    loading ? 'Processing...' : isEditingAddress ? 'Update Node' : 'Establish Node'
                  }
                  className="w-full py-4 rounded-md"
                  disabled={loading}
                />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, delay }) {
  return (
    <div
      className="bg-bg/40 backdrop-blur-md border border-white/5 p-4 rounded-md text-center min-w-25 animate-in zoom-in-50 fill-mode-backwards duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(255,111,92,0.5)]">
        {value || 0}
      </p>
      <p className="text-[11px] uppercase tracking-widest text-pText/70 mt-1">{label}</p>
    </div>
  );
}

function InputGroup({ label, icon, disabled, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-black uppercase tracking-[0.2em] text-pText/60 ml-2">
        {label}
      </label>
      <div className="relative group">
        <input
          {...props}
          disabled={disabled}
          className={`w-full bg-bg border border-border rounded-md p-4 text-xs font-bold text-text outline-none focus:border-primary transition-all shadow-inner placeholder:text-pText/20
          ${icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed text-pText/50' : ''}`}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pText group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
