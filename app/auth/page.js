'use client';
import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser, registerUser } from '@/store/features/authSlice';
import { Mail, Lock, User, CheckCircle2, Sparkles } from 'lucide-react';
import AuthField from './AuthField';
import AuthOverlay from './AuthOverlay';
import Button from '@/components/Button';

// মূল লজিকটি এই কম্পোনেন্টে আলাদা করা হয়েছে
function AuthForm() {
  const [mode, setMode] = useState('login');
  const [locked, setLocked] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const callbackUrl = searchParams.get('callbackUrl') || '/';
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
      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-150">
      <div className="flex-1 p-8 md:p-14 flex items-center">
        <div
          className={`w-full transition-all duration-500 ${
            locked ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Sparkles size={24} fill="currentColor" />
              <span className="font-black tracking-tighter text-xl">MyGadget</span>
            </div>
            <h2 className="text-4xl font-black text-text tracking-tighter mb-2 italic">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-2 rounded-lg mb-4 animate-shake">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <AuthField
                icon={<User size={18} />}
                placeholder="Full Name"
                {...register('fullname', { required: 'Name is required' })}
                error={errors.fullname}
              />
            )}
            <AuthField
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email Address"
              {...register('email', { required: 'Email is required' })}
              error={errors.email}
            />
            <AuthField
              icon={<Lock size={18} />}
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password}
            />

            <div className="pt-4">
              <Button
                type="submit"
                text={success ? 'Success!' : isLogin ? 'Sign In' : 'Create Account'}
                loading={loading}
                size="xl"
                icon={success ? CheckCircle2 : isLogin ? Lock : User}
              />
            </div>
          </form>

          <div className="mt-8 text-center md:hidden">
            <button
              onClick={toggleMode}
              className="text-xs font-black uppercase tracking-widest text-pText"
            >
              {isLogin ? 'New user? ' : 'Already user? '}
              <span className="text-primary underline"> {isLogin ? 'Register' : 'Login'} </span>
            </button>
          </div>
        </div>
      </div>

      <AuthOverlay isLogin={isLogin} locked={locked} toggleMode={toggleMode} />
    </div>
  );
}

// এটিই আপনার মেইন এক্সপোর্ট, যা Suspense ব্যবহার করে বিল্ড এরর ফিক্স করবে
export default function AuthPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 overflow-hidden relative">
      <div className="relative w-full max-w-5xl bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Suspense fallback={<div className="p-10 text-center text-text">Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
