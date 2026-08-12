'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrdersAdmin } from '@/store/features/orderSlice';
import { getAllUsersAdmin } from '@/store/features/authSlice';
import { fetchAllProducts } from '@/store/features/productSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const dispatch = useDispatch();
  const isFetched = useRef(false);

  // Redux States (নিশ্চিত করুন loading/isFetched স্লাইসে আছে)
  const { orders = [] } = useSelector((state) => state.order);
  const { users = [] } = useSelector((state) => state.auth);
  const { products = [] } = useSelector((state) => state.products);

  // --- Fetch Data on Mount (Loop-safe) ---
  useEffect(() => {
    if (!isFetched.current) {
      dispatch(getAllOrdersAdmin());
      dispatch(getAllUsersAdmin());
      dispatch(fetchAllProducts());
      isFetched.current = true;
    }
  }, [dispatch]);

  // --- Calculate Stats ---
  // আপনার মডেল অনুযায়ী pricing.totalPrice ব্যবহার করা হয়েছে
  const totalRevenue = useMemo(
    () => orders.reduce((acc, order) => acc + (order.pricing?.totalPrice || 0), 0),
    [orders]
  );

  const stats = [
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, change: '+12%' },
    { label: 'Total Orders', value: orders.length.toLocaleString(), change: '+5%' },
    { label: 'Active Users', value: users.length.toLocaleString(), change: '+18%' },
  ];

  // --- Monthly Revenue Chart ---
  const revenueChartData = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlyRevenue = new Array(12).fill(0);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlyRevenue[month] += order.pricing?.totalPrice || 0;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Revenue (৳)',
          data: monthlyRevenue,
          backgroundColor: '#3b82f6',
          borderRadius: 8,
        },
      ],
    };
  }, [orders]);

  // --- Status Distribution ---
  const statusChartData = useMemo(() => {
    const statusCount = { PENDING: 0, PROCESSING: 0, DELIVERED: 0, CANCELLED: 0, CONFIRMED: 0 };
    orders.forEach((o) => {
      if (o.orderStatus) statusCount[o.orderStatus] = (statusCount[o.orderStatus] || 0) + 1;
    });

    return {
      labels: Object.keys(statusCount),
      datasets: [
        {
          data: Object.values(statusCount),
          backgroundColor: ['#facc15', '#3b82f6', '#10b981', '#ef4444', '#a855f7'],
        },
      ],
    };
  }, [orders]);

  return (
    <div className="bg-bg min-h-screen">
      <h1 className="text-3xl font-medium italic uppercase mb-8">
        System <span className="text-primary">Overview</span>
      </h1>

      {/* --- Top Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border/50 p-6 rounded-0 shadow-sm">
            <p className="text-[12px] font-medium uppercase tracking-tighter text-pText/70">
              {stat.label}
            </p>
            <h2 className="text-4xl font-medium mt-2 text-text">{stat.value}</h2>
            <span className="text-primary font-medium text-xs">{stat.change} since last month</span>
          </div>
        ))}
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-card p-6 rounded-0 border border-border/50">
          <Bar
            data={revenueChartData}
            options={{
              responsive: true,
              plugins: { title: { display: true, text: 'Monthly Revenue Distribution' } },
            }}
          />
        </div>
        <div className="bg-card p-6 rounded-0 border border-border/50">
          <div className="max-w-87 mx-auto">
            <Pie
              data={statusChartData}
              options={{
                responsive: true,
                plugins: { title: { display: true, text: 'Order Status Metrics' } },
              }}
            />
          </div>
        </div>
      </div>

      {/* --- Detailed Lists --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-card p-6 rounded-0 border border-border/50">
          <h3 className="font-medium uppercase text-sm tracking-tighter mb-6 border-b border-border pb-2">
            Recent Terminals
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar">
            {orders
              .slice()
              .reverse()
              .slice(0, 6)
              .map((order) => (
                <div key={order._id} className="flex justify-between items-center group">
                  <div>
                    <p className="text-xs font-medium text-text uppercase">
                      ID: {order._id.slice(-8)}
                    </p>
                    <p className="text-[12px] text-pText">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary">৳{order.pricing?.totalPrice}</p>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Products Overview */}
        <div className="bg-card p-6 rounded-0 border border-border/50">
          <h3 className="font-medium uppercase text-sm tracking-tighter mb-6 border-b border-border pb-2">
            Stock Inventory
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar">
            {products.slice(0, 6).map((product) => (
              <div key={product._id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg rounded-0 overflow-hidden border border-border">
                    <img
                      src={product.images?.[0]?.url || '/placeholder.png'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-text uppercase truncate w-32 md:w-48">
                    {product.title}
                  </span>
                </div>
                <span
                  className={`text-[12px] font-medium ${
                    product.stock < 5 ? 'text-red-500' : 'text-primary'
                  }`}
                >
                  {product.stock} Units
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
