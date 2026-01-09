// app/(admin)/admin/dashboard/page.js
export default function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '৳5,20,000', change: '+12%' },
    { label: 'Total Orders', value: '1,240', change: '+5%' },
    { label: 'Active Users', value: '850', change: '+18%' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black italic uppercase mb-8">
        System <span className="text-primary">Overview</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-pText">
              {stat.label}
            </p>
            <h2 className="text-4xl font-black mt-2">{stat.value}</h2>
            <span className="text-primary font-bold text-xs">{stat.change} since last month</span>
          </div>
        ))}
      </div>
    </div>
  );
}
