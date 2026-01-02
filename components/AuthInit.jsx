'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMe } from '@/store/features/authSlice';

export default function AuthInit({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return <>{children}</>;
}
