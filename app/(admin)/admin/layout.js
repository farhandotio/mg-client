import AdminProtection from '@/components/AdminProtection';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({ children }) {
  return (
    <AdminProtection>
      <div className="flex h-screen bg-bg overflow-hidden">
        <aside className="hidden md:flex md:shrink-0">
          <AdminSidebar />
        </aside>

        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <AdminHeader />

          <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminProtection>
  );
}
