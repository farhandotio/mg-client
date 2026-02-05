'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { getMe } from '@/store/features/authSlice';

export default function AdminProtection({ children }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!isAuthenticated) {
        await dispatch(getMe());
      }
      setIsInitialLoad(false);
    };

    checkSession();
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isInitialLoad && !loading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, isAuthenticated, loading, router, isInitialLoad]);

  if (isInitialLoad || (loading && !user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-primary" size={40} />
          <ShieldCheck
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40"
            size={18}
          />
        </div>
        <div className="text-center">
          <p className="text-[12px] font-black uppercase tracking-tighter text-white">
            Verifying <span className="text-primary">Admin</span> Session
          </p>
          <p className="text-[10px] text-pText opacity-40 uppercase mt-1">
            Please wait, do not refresh
          </p>
        </div>
      </div>
    );
  }

  return user?.role === 'admin' ? <>{children}</> : null;
}
