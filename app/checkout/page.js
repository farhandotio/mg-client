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
import { createBkashPayment, resetBkashState } from '@/store/features/bkashSlice';
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // --- Redux States ---
  const { user, addresses = [] } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const {
    loading: orderLoading,
    success: orderSuccess,
    orderId,
  } = useSelector((state) => state.order || {});
  const { loading: bkashLoading, error: bkashError } = useSelector((state) => state.bkash || {});

  // --- Local States ---
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false); // FIXED: Added this state

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
      const addrList = res.payload?.addresses || [];
      if (addrList.length === 0) {
        setShowAddressForm(true);
      } else {
        setSelectedAddress(addrList[0]);
      }
    });
  }, [dispatch]);

  // ২. COD পেমেন্ট সফল হলে হ্যান্ডলিং
  useEffect(() => {
    if (orderSuccess && orderId && paymentMethod === 'COD') {
      toast.success('ORDER PLACED SUCCESSFULLY!');
      dispatch(clearCart());
      router.push(`/order-success/${orderId}`);
      dispatch(resetOrderState());
    }
  }, [orderSuccess, orderId, paymentMethod, router, dispatch]);

  // ৩. বিকাশ এরর হ্যান্ডলিং
  useEffect(() => {
    if (bkashError) {
      toast.error(bkashError);
      dispatch(resetBkashState());
      setIsProcessing(false);
    }
  }, [bkashError, dispatch]);

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
      return toast.error('Fill all required fields');
    }
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('Address saved');
      setShowAddressForm(false);
      setNewAddress({ phone: '', street: '', city: '', state: '', zip: '', country: 'Bangladesh' });
    } catch (err) {
      toast.error(err || 'Failed to sync address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a shipping address');

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price?.discounted || item.price,
        title: item.title,
        image: item.image,
      })),
      shippingAddress: {
        fullname: user.fullname,
        phoneNumber: selectedAddress.phone,
        address: selectedAddress.street,
        city: selectedAddress.city,
        area: selectedAddress.state || selectedAddress.city,
      },
      paymentMethod: paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: total,
    };

    try {
      setIsProcessing(true);

      if (paymentMethod === 'Online') {
        const loadingToast = toast.loading('Initializing bKash Gateway...');
        const orderResponse = await dispatch(createOrder(orderData)).unwrap();
        const finalOrderId = orderResponse?.orderId || orderResponse?._id;

        if (finalOrderId) {
          toast.loading('Connecting to bKash...', { id: loadingToast });
          const result = await dispatch(createBkashPayment(finalOrderId)).unwrap();
          if (result) {
            toast.dismiss(loadingToast);
            window.location.href = result;
          }
        }
      } else {
        await dispatch(createOrder(orderData)).unwrap();
      }
    } catch (err) {
      setIsProcessing(false);
      toast.dismiss();
      toast.error(err.message || err || 'Transaction Failed');
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

        {/* Stepper */}
        <div className="flex items-center justify-center mb-20 max-w-2xl mx-auto relative text-center">
          <StepIcon active={step >= 1} current={step === 1} label="Shipping" icon={Truck} />
          <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-white/5'}`} />
          <StepIcon active={step >= 2} current={step === 2} label="Payment" icon={CreditCard} />
          <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-white/5'}`} />
          <StepIcon active={step >= 3} current={step === 3} label="Confirm" icon={ClipboardCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            {step === 1 && (
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
                    <MapPin size={24} /> Shipping Nodes
                  </h2>
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
                        <div className="flex justify-between mb-2">
                          <p className="text-sm font-bold text-white/90">{addr.street}</p>
                          {selectedAddress?._id === addr._id && (
                            <CheckCircle2 size={16} className="text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-white/30">
                          {addr.city}, {addr.state}
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/5 font-mono text-primary/80 text-[10px]">
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
                      label="Phone"
                      value={newAddress.phone}
                      placeholder="017..."
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                    <InputGroup
                      label="Street"
                      value={newAddress.street}
                      placeholder="Road/House"
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    />
                    <InputGroup
                      label="City"
                      value={newAddress.city}
                      placeholder="Dhaka"
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <div className="md:col-span-2 flex gap-4">
                      <Button text="Save Address Node" type="submit" className="flex-1 py-4" />
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-xs uppercase font-black text-white/20 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                {!showAddressForm && (
                  <div className="mt-12 flex justify-end">
                    <Button
                      text="Proceed to Payment"
                      onClick={() =>
                        selectedAddress ? setStep(2) : toast.error('Select an address')
                      }
                      className="px-12 py-4 shadow-[0_0_30px_rgba(41,252,86,0.2)]"
                    />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-black uppercase italic text-primary mb-10 flex items-center gap-3 tracking-tighter">
                  <CreditCard size={24} /> Payment Protocol
                </h2>
                <div className="grid gap-4">
                  <PaymentOption
                    id="COD"
                    title="Cash on Delivery"
                    desc="Physical exchange upon arrival"
                    selected={paymentMethod === 'COD'}
                    onSelect={setPaymentMethod}
                  />
                  <PaymentOption
                    id="Online"
                    title="Online (bKash)"
                    desc="Instant encrypted transaction"
                    selected={paymentMethod === 'Online'}
                    onSelect={setPaymentMethod}
                  />
                </div>
                <div className="mt-12 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white"
                  >
                    Back
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
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-10">
                <h2 className="text-xl font-black uppercase italic text-primary mb-10 flex items-center gap-3 tracking-tighter">
                  <ClipboardCheck size={24} /> Final Verification
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase text-primary mb-3">
                      Shipping To
                    </p>
                    <p className="font-bold text-lg">{user?.fullname}</p>
                    <p className="text-xs text-white/60">
                      {selectedAddress?.street}, {selectedAddress?.city}
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase text-primary mb-3">
                      Payment Mode
                    </p>
                    <p className="font-bold text-lg uppercase">
                      {paymentMethod === 'COD' ? 'Cash' : 'Online / bKash'}
                    </p>
                  </div>
                </div>

                <Button
                  text={
                    orderLoading || bkashLoading || isProcessing ? (
                      <span className="flex items-center gap-2">
                        Processing... <Loader2 className="animate-spin" size={18} />
                      </span>
                    ) : (
                      'Finalize Transaction'
                    )
                  }
                  disabled={orderLoading || bkashLoading || isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full py-6 text-lg rounded-2xl shadow-[0_0_40px_rgba(41,252,86,0.3)]"
                />
              </div>
            )}
          </div>

          {/* Right Column: Summary (FIXED: Added mapping back) */}
          <div className="lg:col-span-4">
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
              <div className="flex items-center justify-between mb-8 opacity-60">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <ShoppingCart size={14} /> Inventory
                </span>
                <span className="text-[10px] font-mono text-primary">{cartItems.length} Items</span>
              </div>

              <div className="space-y-4 mb-8 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate uppercase">{item.title}</p>
                      <p className="text-[10px] text-white/40">QTY: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-mono font-bold text-primary">
                      ৳{(item.price?.discounted || item.price) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-white/30 text-[10px] font-black uppercase">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/30 text-[10px] font-black uppercase">
                  <span>Shipping</span>
                  <span>৳{shipping}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-4xl font-black text-primary italic tracking-tighter">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
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
        className={`text-[10px] font-black uppercase tracking-widest absolute -bottom-10 whitespace-nowrap ${
          active ? 'text-primary' : 'text-white/20'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-white/30 ml-1">{label}</label>
      <input
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#161616] border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-primary/50 outline-none text-white font-medium shadow-inner"
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
          : 'border-white/5 bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? 'border-primary' : 'border-white/20'
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#29fc56]" />
          )}
        </div>
        <div>
          <h4
            className={`font-black uppercase text-sm tracking-widest ${
              selected ? 'text-primary' : 'text-white/90'
            }`}
          >
            {title}
          </h4>
          <p className="text-[10px] text-white/40 tracking-tight mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}
