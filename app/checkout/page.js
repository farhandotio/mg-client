'use client';
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Truck,
  CreditCard,
  ClipboardCheck,
  MapPin,
  Plus,
  CheckCircle2,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { addAddress, getAddresses } from '@/store/features/authSlice';
import { createOrder, resetOrderState } from '@/store/features/orderSlice';
import { clearCart } from '@/store/features/cartSlice'; 
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux States
  const { user, addresses = [] } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const orderState = useSelector((state) => state.order || {});

  const orderLoading = orderState.loading || false;
  const orderSuccess = orderState.success || false;
  const orderId = orderState.orderId || null;

  // Local States
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [newAddress, setNewAddress] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
  });

  // ১. ইনিশিয়াল ডাটা লোড
  useEffect(() => {
    dispatch(getAddresses()).then((res) => {
      if (!res.payload?.addresses || res.payload.addresses.length === 0) {
        setShowAddressForm(true);
      }
    });
  }, [dispatch]);

  // ২. অর্ডার সফল হলে কার্ট ডিলিট এবং রিডাইরেক্ট (প্রধান আপডেট)
  useEffect(() => {
    if (orderSuccess && orderId) {
      toast.success('ORDER ENCRYPTED & PLACED!');

      // কার্ট ক্লিয়ার করা (Redux State + LocalStorage)
      dispatch(clearCart());

      // সাকসেস পেজে পাঠানো
      router.push(`/order-success/${orderId}`);

      // অর্ডার স্ট্যাটাস রিসেট করা যাতে লুপ না হয়
      dispatch(resetOrderState());
    }
  }, [orderSuccess, orderId, router, dispatch]);

  // ক্যালকুলেশন
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price?.discounted || item.price || 0);
    return acc + price * item.quantity;
  }, 0);

  const shipping = selectedAddress?.city?.toLowerCase() === 'dhaka' ? 80 : 150;
  const total = subtotal + shipping;

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.phone || !newAddress.street || !newAddress.city) {
      return toast.error('Incomplete data nodes. Fill all fields.');
    }
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('Address saved to secure storage');
      setShowAddressForm(false);
    } catch (err) {
      toast.error(err || 'Failed to sync address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Select a delivery node first');

    const orderData = {
      shippingAddress: {
        fullname: user.fullname,
        phoneNumber: selectedAddress.phone,
        address: selectedAddress.street,
        city: selectedAddress.city,
        area: selectedAddress.state || selectedAddress.city,
      },
      paymentMethod: paymentMethod,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
    } catch (err) {
      toast.error(err || 'Transmission Interrupted');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/cart"
          className="flex items-center gap-2 text-pText/60 hover:text-primary mb-8 group transition-all"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Inventory</span>
        </Link>

        {/* --- Stepper --- */}
        <div className="flex items-center justify-center mb-20 max-w-2xl mx-auto relative text-center">
          <StepIcon active={step >= 1} current={step === 1} label="Shipping" icon={Truck} />
          <div
            className={`flex-1 h-0.5 mx-4 transition-colors duration-500 ${
              step >= 2 ? 'bg-primary shadow-[0_0_10px_#29fc56]' : 'bg-white/5'
            }`}
          />
          <StepIcon active={step >= 2} current={step === 2} label="Payment" icon={CreditCard} />
          <div
            className={`flex-1 h-0.5 mx-4 transition-colors duration-500 ${
              step >= 3 ? 'bg-primary shadow-[0_0_10px_#29fc56]' : 'bg-white/5'
            }`}
          />
          <StepIcon active={step >= 3} current={step === 3} label="Confirm" icon={ClipboardCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- Left Column --- */}
          <div className="lg:col-span-8 space-y-8">
            {step === 1 && (
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3 text-primary">
                    <MapPin size={24} />
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">
                      Shipping Nodes
                    </h2>
                  </div>
                  {addresses.length > 0 && !showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-[10px] font-black uppercase text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Plus size={12} className="inline mr-1" /> New Address
                    </button>
                  )}
                </div>

                {!showAddressForm ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                          selectedAddress?._id === addr._id
                            ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(41,252,86,0.1)]'
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {addr.city} Node
                          </span>
                          {selectedAddress?._id === addr._id && (
                            <CheckCircle2 size={18} className="text-primary" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-white/90 leading-relaxed">
                          {addr.street}
                        </p>
                        <p className="text-xs text-white/30 mt-1">
                          {addr.state}, {addr.zip}
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 font-mono text-primary/80">
                          <span className="text-[10px] text-white/20 uppercase">Signal:</span>{' '}
                          {addr.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form
                    onSubmit={handleAddNewAddress}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <InputGroup
                      label="Phone Signal"
                      placeholder="017xxxxxxxx"
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                    <InputGroup
                      label="Street Vector"
                      placeholder="Apt, Road, House"
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    />
                    <InputGroup
                      label="City Sector"
                      placeholder="e.g. Dhaka"
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <InputGroup
                      label="Area/State"
                      placeholder="e.g. Uttara"
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                    <InputGroup
                      label="Zip Code"
                      placeholder="1230"
                      onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    />
                    <div className="md:col-span-2 flex gap-4 mt-6">
                      <Button
                        text="Save Address Node"
                        type="submit"
                        className="flex-1 py-4 text-sm"
                      />
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 text-white/40 uppercase text-[10px] font-black hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {!showAddressForm && (
                  <div className="mt-12 flex justify-end">
                    <Button
                      text="Proceed to Payment"
                      onClick={() =>
                        selectedAddress
                          ? setStep(2)
                          : toast.error('Please select a transmission node')
                      }
                      className="px-12 py-4 rounded-xl shadow-[0_0_30px_rgba(41,252,86,0.2)]"
                    />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 animate-in fade-in zoom-in-95">
                <h2 className="text-xl font-black uppercase italic text-primary mb-10 flex items-center gap-3 tracking-tighter">
                  <CreditCard size={24} /> Payment Protocol
                </h2>
                <div className="grid gap-4">
                  <PaymentOption
                    id="COD"
                    title="Cash on Delivery"
                    desc="Physical credit exchange upon arrival"
                    selected={paymentMethod === 'COD'}
                    onSelect={setPaymentMethod}
                  />
                  <PaymentOption
                    id="Online"
                    title="Online (bKash/Cards)"
                    desc="Instant encrypted digital transaction"
                    selected={paymentMethod === 'Online'}
                    onSelect={setPaymentMethod}
                  />
                </div>
                <div className="mt-12 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white"
                  >
                    Back to Shipping
                  </button>
                  <Button
                    text="Review Final Order"
                    onClick={() => setStep(3)}
                    className="px-12 py-4"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 animate-in fade-in">
                <h2 className="text-xl font-black uppercase italic text-primary mb-10 flex items-center gap-3 tracking-tighter">
                  <ClipboardCheck size={24} /> Final Verification
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase text-primary mb-3 tracking-[0.2em]">
                      Shipping To
                    </p>
                    <p className="font-bold text-lg">{user.fullname}</p>
                    <p className="text-xs text-white/60 mt-1">
                      {selectedAddress?.street}, {selectedAddress?.city}
                    </p>
                    <p className="text-xs font-mono text-primary mt-3">{selectedAddress?.phone}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase text-primary mb-3 tracking-[0.2em]">
                      Payment Mode
                    </p>
                    <p className="font-bold text-lg uppercase tracking-widest">
                      {paymentMethod === 'COD' ? 'Cash On Delivery' : 'Online Payment'}
                    </p>
                    <p className="text-xs text-white/60 mt-1">Status: Ready for transmission</p>
                  </div>
                </div>
                <Button
                  text={
                    orderLoading ? (
                      <span className="flex items-center gap-2">
                        Initiating... <Loader2 className="animate-spin" size={18} />
                      </span>
                    ) : (
                      'Finalize Transaction'
                    )
                  }
                  disabled={orderLoading}
                  onClick={handlePlaceOrder}
                  className="w-full py-6 text-lg rounded-2xl shadow-[0_0_40px_rgba(41,252,86,0.3)]"
                />
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all"
                >
                  Re-configure Protocols
                </button>
              </div>
            )}
          </div>

          {/* --- Right Column: Summary --- */}
          <div className="lg:col-span-4">
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 sticky top-24 shadow-2xl border-t-primary/20">
              <div className="flex items-center justify-between mb-8 opacity-60">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Inventory List
                  </span>
                </div>
                <span className="text-[10px] font-mono text-primary">{cartItems.length} Items</span>
              </div>

              <div className="space-y-5 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center group">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 group-hover:border-primary/50 transition-colors">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold truncate text-white/80 group-hover:text-white uppercase tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-mono text-primary italic">
                        QTY: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-black">
                      ৳{(Number(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-black uppercase text-white/30 tracking-widest">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-white/30 tracking-widest">
                  <span>Shipping Fee</span>
                  <span className="text-primary">৳{shipping}</span>
                </div>
                <div className="pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">
                      Total Payload
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-4xl font-black text-primary italic tracking-tighter drop-shadow-[0_0_10px_rgba(41,252,86,0.2)]">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components (Stayed same)
function StepIcon({ active, current, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
          active
            ? 'bg-primary border-primary text-bg'
            : 'bg-[#0a0a0a] border-white/10 text-white/20'
        } ${current ? 'shadow-[0_0_30px_#29fc56] scale-110' : ''}`}
      >
        <Icon size={24} className={current ? 'animate-pulse' : ''} />
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest absolute -bottom-10 whitespace-nowrap transition-colors duration-500 ${
          active ? 'text-primary' : 'text-white/20'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function InputGroup({ label, placeholder, onChange }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-white/30 ml-1 group-focus-within:text-primary transition-colors tracking-widest">
        {label}
      </label>
      <input
        required
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#161616] border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-primary/50 focus:bg-[#1a1a1a] outline-none transition-all placeholder:opacity-10 text-white font-medium shadow-inner"
      />
    </div>
  );
}

function PaymentOption({ id, title, desc, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
        selected
          ? 'border-primary bg-primary/5 shadow-[inset_0_0_20px_rgba(41,252,86,0.05)]'
          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected ? 'border-primary' : 'border-white/20'
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#29fc56]" />
          )}
        </div>
        <div>
          <h4
            className={`font-black uppercase text-sm tracking-widest transition-colors ${
              selected ? 'text-primary' : 'text-white/90'
            }`}
          >
            {title}
          </h4>
          <p className="text-[10px] text-white/40 tracking-tight mt-1 group-hover:text-white/60 transition-colors">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
