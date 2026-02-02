'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '@/store/features/orderSlice';
import DataTable from '../components/DataTable';
import { toast } from 'react-hot-toast';
import { Clock, Terminal, ShieldAlert, X } from 'lucide-react';

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.order);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(getAllOrdersAdmin());
  }, [dispatch]);

  const handleUpdateClick = (item) => {
    setSelectedOrder(item);
    setNewStatus(item.orderStatus);
    setIsModalOpen(true);
  };

  const submitStatusUpdate = async () => {
    try {
      await dispatch(
        updateOrderStatusAdmin({
          id: selectedOrder._id,
          status: newStatus,
        })
      ).unwrap();

      toast.success('System Status Synchronized');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error || 'Update Interrupted');
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
    switch (s) {
      case 'DELIVERED':
        return 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]';
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'SHIPPED':
        return 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const columns = [
    {
      label: 'Log_ID / Customer',
      key: '_id',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-black text-text uppercase italic">
            #{item._id?.slice(-8)}
          </span>
          <span className="text-[11px] text-pText/60 font-bold uppercase truncate max-w-7xl">
            {item.shippingAddress?.fullname || 'Guest'}
          </span>
        </div>
      ),
    },
    {
      label: 'Transmission',
      key: 'createdAt',
      render: (item) => (
        <span className="text-[11px] font-mono text-text/80">
          {new Date(item.createdAt).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      label: 'Payload',
      key: 'totalPrice',
      render: (item) => (
        <span className="font-black text-primary text-xs italic">
          ৳{item?.pricing?.totalPrice?.toLocaleString()}
        </span>
      ),
    },
    {
      label: 'Status',
      key: 'orderStatus',
      render: (item) => (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(
            item.orderStatus
          )}`}
        >
          <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
          {item.orderStatus || 'Pending'}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Terminal size={14} />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">
              Secure_Admin_Terminal
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter text-text leading-none mt-1">
            Order <span className="text-primary">Logs</span>
          </h1>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 px-6 py-4 rounded-md flex items-center gap-4">
          <Clock size={18} className="text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-text leading-none">{orders?.length || 0}</span>
            <span className="text-[10px] font-black text-pText/60 uppercase tracking-widest mt-1">
              Captured_Logs
            </span>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-primary/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-card/20 backdrop-blur-md border border-border/40 rounded-md overflow-hidden shadow-2xl">
          <DataTable
            columns={columns}
            data={orders}
            loading={loading}
            onEdit={handleUpdateClick}
            onView={(item) => window.open(`/orders/${item._id}`, '_self')}
            onDelete={() => toast.error('Security Protocol: Logs are immutable.')}
          />
        </div>
      </div>

      {/* --- Simple Status Update Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-border w-full max-w-md rounded-md p-8 shadow-2xl overflow-hidden relative">
            <button
              aria-label="close"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-pText hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-1">
              Update <span className="text-primary">Protocol</span>
            </h2>
            <p className="text-[12px] uppercase font-bold text-pText tracking-widest mb-8">
              Log_ID: #{selectedOrder?._id?.slice(-8)}
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-[12px] font-black uppercase tracking-widest text-primary mb-3 block">
                  Access New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-card rounded-md border border-border px-4 py-3 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <button
                aria-label="execute update"
                onClick={submitStatusUpdate}
                className="w-full bg-primary hover:bg-primary/80 text-black font-black uppercase italic py-4 rounded-md transition-all active:scale-95 text-xs tracking-widest shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
              >
                Execute Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center gap-2 opacity-30 justify-center md:justify-start">
        <ShieldAlert size={12} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          End-to-End Encryption Active // {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}
