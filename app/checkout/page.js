'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Redux Actions
import { addAddress, getAddresses } from '@/store/features/authSlice';
import { createOrder } from '@/store/features/orderSlice';
import { initSSLPayment } from '@/store/features/paymentSlice';
import { clearCart } from '@/store/features/cartSlice';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux State
  const { user, addresses, loading: authLoading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.order);

  // Local State
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
  });

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  // ক্যালকুলেশন
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + shipping;

  // --- ফিক্সড এরর হ্যান্ডলার ---
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('Address Added!');
      setShowAddressForm(false);
    } catch (err) {
      // 'message' defined না থাকার এরর এখানে ফিক্স করা হয়েছে
      const errorMsg = err?.message || err || 'Failed to add address';
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Error adding address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a shipping address');
    if (cartItems.length === 0) return toast.error('Cart is empty');

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        fullname: user?.fullname,
        phoneNumber: selectedAddress.phone,
        address: selectedAddress.street,
        city: selectedAddress.city,
        area: selectedAddress.state || selectedAddress.city,
      },
      payment: { method: paymentMethod },
      pricing: { itemsPrice: subtotal, shippingPrice: shipping, totalPrice: total },
    };

    try {
      // ১. অর্ডার ক্রিয়েট
      const orderRes = await dispatch(createOrder(orderData)).unwrap();

      // ২. পেমেন্ট মেথড চেক
      if (paymentMethod === 'ONLINE') {
        const payRes = await dispatch(initSSLPayment({ orderId: orderRes.orderId })).unwrap();
        if (payRes.gatewayUrl) {
          window.location.replace(payRes.gatewayUrl);
        }
      } else {
        toast.success('Order Placed!');
        dispatch(clearCart());
        router.push(`/order-success/${orderRes.orderId}`);
      }
    } catch (err) {
      // ৪00 Bad Request এর মেসেজ এখানে সুন্দরভাবে দেখাবে
      const errorMsg = err?.message || err || 'Order failed';
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Validation Error');
      console.log('Order Error Detail:', err);
    }
  };

  if (cartItems.length === 0)
    return <div className="p-20 text-center text-white">Cart is empty.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-white bg-black min-h-screen">
      <div className="md:col-span-2 space-y-6">
        <section className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">1. Shipping Address</h2>
          {addresses?.length > 0 && !showAddressForm ? (
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((addr, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 border cursor-pointer rounded-md ${
                    selectedAddress?._id === addr._id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-zinc-700'
                  }`}
                >
                  <p className="font-bold">{user?.fullname}</p>
                  <p className="text-sm text-zinc-400">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="text-sm text-zinc-400">Phone: {addr.phone}</p>
                </div>
              ))}
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-sm text-green-500 mt-2"
              >
                + Add New Address
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddAddress} className="grid grid-cols-2 gap-4">
              <input
                className="bg-zinc-800 p-2 rounded border border-zinc-700"
                placeholder="Phone"
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                required
              />
              <input
                className="bg-zinc-800 p-2 rounded border border-zinc-700"
                placeholder="Street/House"
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                required
              />
              <input
                className="bg-zinc-800 p-2 rounded border border-zinc-700"
                placeholder="City"
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                required
              />
              <input
                className="bg-zinc-800 p-2 rounded border border-zinc-700"
                placeholder="State/Area"
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                required
              />
              <input
                className="bg-zinc-800 p-2 rounded border border-zinc-700"
                placeholder="Zip Code"
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                required
              />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-green-600 px-4 py-2 rounded">
                  Save
                </button>
                {addresses?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="bg-zinc-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        <section className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">2. Payment Method</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setPaymentMethod('COD')}
              className={`flex-1 p-4 border rounded-md ${
                paymentMethod === 'COD' ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'
              }`}
            >
              Cash on Delivery
            </button>
            <button
              onClick={() => setPaymentMethod('ONLINE')}
              className={`flex-1 p-4 border rounded-md ${
                paymentMethod === 'ONLINE' ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'
              }`}
            >
              Online Payment
            </button>
          </div>
        </section>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 h-fit sticky top-4">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-zinc-400">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span>৳{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-zinc-800 pt-4 font-bold text-green-500 flex justify-between">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={orderLoading || authLoading}
          className="w-full bg-green-600 py-4 rounded-lg font-bold disabled:opacity-50"
        >
          {orderLoading ? 'Processing...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
}
