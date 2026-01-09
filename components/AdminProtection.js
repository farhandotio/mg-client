'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminProtection({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const router = useRouter();

  // ১. মাউন্ট হওয়া পর্যন্ত অপেক্ষা করার জন্য একটি স্টেট
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // ২. একটি ছোট ডিলে বা লোডিং শেষ হওয়ার জন্য অপেক্ষা
    const timer = setTimeout(() => {
      if (!loading) {
        if (!user || user.role !== 'admin') {
          router.push('/login');
        } else {
          setIsChecking(false);
        }
      }
    }, 1500); // ১.৫ সেকেন্ড ডিলে যাতে রিডাক্স ডাটা পাওয়ার সময় পায়

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  // ৩. যতক্ষণ চেকিং চলবে অথবা রিডাক্স লোড হবে, ততক্ষণ লোডার দেখাবে
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pText animate-pulse">
          Authenticating Admin Session...
        </p>
      </div>
    );
  }

  // সব চেক সফল হলে চিলড্রেন দেখাবে
  return user?.role === 'admin' ? children : null;
}
