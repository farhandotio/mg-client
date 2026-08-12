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
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

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
    <div className="flex flex-col max-md:h-full w-full md:rounded-0 md:py-4 md:bg-card max-w-lg">
      {/* ব্যাক বাটন - মোবাইল এবং ডেস্কটপ উভয়ের জন্য */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-0 bg-white/5 border border-white/5 text-pText hover:text-secondary hover:bg-white/10 transition-all group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[12px] font-medium uppercase tracking-tighter hidden sm:block">
          ফিরে যান
        </span>
      </button>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div
            className={`w-full transition-all duration-500 ${
              locked ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="mb-10 pt-8 md:pt-0">
              <h2 className="text-4xl font-medium text-text tracking-tighterer mb-2 text-center leading-none">
                {isLogin ? 'ফিরে আসায় স্বাগতম' : 'নতুন অ্যাকাউন্ট'}
              </h2>

              {/* অ্যালার্ট মেসেজসমূহ */}
              {isLogin && isVerified && !error && (
                <div className="flex items-center gap-2 text-green-500 text-[11px] font-medium uppercase bg-green-500/10 p-3 rounded-0 mb-4 border border-green-500/20">
                  <CheckCircle2 size={14} /> ইমেইল ভেরিফাইড! এখন লগইন করুন।
                </div>
              )}

              {verificationNotice && (
                <div className="flex items-start gap-2 text-blue-500 text-[11px] font-medium uppercase bg-blue-500/10 p-4 rounded-0 mb-4 border border-blue-500/20">
                  <Info size={16} className="shrink-0" />
                  লগইন করার আগে ইমেইল চেক করে ভেরিফাই করুন।
                </div>
              )}

              {error && (
                <p className="text-danger text-[12px] font-medium uppercase tracking-tighter bg-danger/10 p-3 rounded-0 mb-4 animate-shake border border-danger/20">
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

              <div className="p-4 w-full flex items-center justify-center gap-2">
                <div className="h-0.5 w-full bg-border" />
                <div className="h-2 w-2 bg-border rounded-full shrink-0" />
                <div className="h-0.5 w-full bg-border" />
              </div>

              <button
                type="button"
                onClick={() => {
                  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                  window.location.href = `${baseUrl}/api/auth/google?callbackUrl=${encodeURIComponent(
                    callbackUrl
                  )}`;
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-0 border border-slate-200/80 bg-white/90 px-4 py-4 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100 cursor-pointer"
              >
                <FcGoogle size={18} /> Google দিয়ে সাইন ইন করুন
              </button>
            </form>

            <div className="mt-8 text-center md:hidden">
              <button
                aria-label="toggle auth"
                onClick={toggleMode}
                className="text-xs font-medium uppercase tracking-tighter text-pText hover:text-secondary transition-colors"
              >
                {isLogin ? 'নতুন ইউজার? ' : 'আগে থেকেই অ্যাকাউন্ট আছে? '}
                <span className="text-secondary underline ml-1 font-medium">
                  {isLogin ? 'নিবন্ধন করুন' : 'লগইন করুন'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 px-6 md:px-0 text-center text-pText">
        <button
          aria-label="toggle auth"
          onClick={toggleMode}
          className="text-xs font-medium uppercase tracking-tighterransition-colors"
        >
          {isLogin ? 'নতুন ইউজার? ' : 'আগে থেকেই অ্যাকাউন্ট আছে? '}
          <span className="underline ml-1 font-medium hover:text-secondary cursor-pointer">
            {isLogin ? 'নিবন্ধন করুন' : 'লগইন করুন'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="bg-bg flex items-center justify-center overflow-hidden relative w-full">
      {/* গ্লো ইফেক্ট */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--secondary-rgb),0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full backdrop-blur-3xl  overflow-hidden min-h-screen flex items-center md:justify-center">
        <Suspense
          fallback={
            <div className="p-20 text-center text-text font-medium uppercase tracking-tighter animate-pulse w-full">
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
