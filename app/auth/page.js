'use client';
import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser, registerUser } from '@/store/features/authSlice';
import {
  Mail,
  Lock,
  User,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import AuthField from './AuthField';
import AuthOverlay from './AuthOverlay';
import Button from '@/components/Button';
import toast from 'react-hot-toast';

function AuthForm() {
  const [mode, setMode] = useState('login');
  const [locked, setLocked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const isVerified = searchParams.get('verified') === 'true';
  const isLogin = mode === 'login';

  useEffect(() => {
    if (isAuthenticated && !success) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, callbackUrl, success]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toggleMode = useCallback(() => {
    if (locked || loading) return;
    setLocked(true);
    setVerificationNotice(false);
    setTimeout(() => {
      setMode((prev) => (prev === 'login' ? 'register' : 'login'));
      reset();
      setLocked(false);
    }, 500);
  }, [locked, loading, reset]);

  const onSubmit = async (data) => {
    const action = isLogin ? loginUser(data) : registerUser(data);
    const result = await dispatch(action);

    if (result.meta.requestStatus === 'fulfilled') {
      if (isLogin) {
        setSuccess(true);
        toast.success('লগইন সফল হয়েছে! রিডাইরেক্ট করা হচ্ছে...');
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 2000);
      } else {
        setSuccess(true);
        setVerificationNotice(true);
        toast.success('নিবন্ধন সফল! আপনার ইমেইল চেক করুন।');

        setTimeout(() => {
          setSuccess(false);
          setMode('login');
          reset();
        }, 6000);
      }
    } else {
      const errorMessage =
        result.payload?.message || result.payload || 'প্রবেশাধিকার প্রত্যাখ্যান করা হয়েছে';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] relative">
      {/* ব্যাক বাটন - মোবাইল এবং ডেস্কটপ উভয়ের জন্য */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/5 text-pText hover:text-primary hover:bg-white/10 transition-all group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[12px] font-black uppercase tracking-widest hidden sm:block">
          ফিরে যান
        </span>
      </button>

      <div className="flex-1 p-8 md:p-14 flex items-center">
        <div
          className={`w-full transition-all duration-500 ${
            locked ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="mb-10 pt-8 md:pt-0">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Sparkles size={24} fill="currentColor" />
              <span className="font-black tracking-tighter text-xl uppercase italic">
                Gadget BDs
              </span>
            </div>

            <h2 className="text-4xl font-black text-text tracking-tighter mb-2 italic leading-none">
              {isLogin ? 'ফিরে আসায় স্বাগতম' : 'নতুন অ্যাকাউন্ট'}
            </h2>
            <p className="text-pText text-[12px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60">
              {isLogin ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'শুরু করতে তথ্য প্রদান করুন'}
            </p>

            {/* অ্যালার্ট মেসেজসমূহ */}
            {isLogin && isVerified && !error && (
              <div className="flex items-center gap-2 text-green-500 text-[11px] font-bold uppercase bg-green-500/10 p-3 rounded-md mb-4 border border-green-500/20">
                <CheckCircle2 size={14} /> ইমেইল ভেরিফাইড! এখন লগইন করুন।
              </div>
            )}

            {verificationNotice && (
              <div className="flex items-start gap-2 text-blue-500 text-[11px] font-bold uppercase bg-blue-500/10 p-4 rounded-md mb-4 border border-blue-500/20">
                <Info size={16} className="shrink-0" />
                লগইন করার আগে ইমেইল চেক করে ভেরিফাই করুন।
              </div>
            )}

            {error && (
              <p className="text-red-500 text-[12px] font-bold uppercase tracking-widest bg-red-500/10 p-3 rounded-md mb-4 animate-shake border border-red-500/20">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <AuthField
                icon={<User size={18} />}
                placeholder="আপনার পূর্ণ নাম"
                {...register('fullname', { required: 'নাম প্রয়োজন' })}
                error={errors.fullname}
              />
            )}
            <AuthField
              icon={<Mail size={18} />}
              type="email"
              placeholder="ইমেইল অ্যাড্রেস"
              {...register('email', { required: 'ইমেইল প্রয়োজন' })}
              error={errors.email}
            />
            <AuthField
              icon={<Lock size={18} />}
              type="password"
              placeholder="পাসওয়ার্ড"
              {...register('password', { required: 'পাসওয়ার্ড প্রয়োজন' })}
              error={errors.password}
            />

            <div className="pt-4">
              <Button
                arialabel="submit"
                type="submit"
                text={
                  success
                    ? isLogin
                      ? 'প্রবেশ করা হচ্ছে...'
                      : 'ইমেইল দেখুন!'
                    : isLogin
                      ? 'লগইন করুন'
                      : 'অ্যাকাউন্ট তৈরি করুন'
                }
                loading={loading}
                size="xl"
                icon={success ? CheckCircle2 : ArrowRight}
              />
            </div>
          </form>

          <div className="mt-8 text-center md:hidden">
            <button
              aria-label="toggle auth"
              onClick={toggleMode}
              className="text-xs font-bold uppercase tracking-widest text-pText hover:text-primary transition-colors"
            >
              {isLogin ? 'নতুন ইউজার? ' : 'আগে থেকেই অ্যাকাউন্ট আছে? '}
              <span className="text-primary underline ml-1 font-black">
                {isLogin ? 'নিবন্ধন করুন' : 'লগইন করুন'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <AuthOverlay isLogin={isLogin} locked={locked} toggleMode={toggleMode} />
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 overflow-hidden relative">
      {/* গ্লো ইফেক্ট */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05),transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-5xl bg-card/40 backdrop-blur-3xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        <Suspense
          fallback={
            <div className="p-20 text-center text-text font-black uppercase tracking-widest animate-pulse">
              লোড হচ্ছে...
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
