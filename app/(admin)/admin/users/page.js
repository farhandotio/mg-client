'use client';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersAdmin } from '@/store/features/authSlice';
import DataTable from '../components/DataTable';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const isFetched = useRef(false);

  const { users = [], loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isFetched.current) {
      dispatch(getAllUsersAdmin());
      isFetched.current = true;
    }
  }, [dispatch]);

  const columns = [
    { label: 'Name', key: 'fullname' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 italic uppercase">User Registry</h1>
      <DataTable columns={columns} data={Array.isArray(users) ? users : []} loading={loading} />
    </div>
  );
}
