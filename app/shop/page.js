import { Suspense } from 'react';
import ShopPageContent from './components/ShopPageContent';
import Skeleton from '@/components/Skeleton';

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 min-h-screen">
      <Suspense fallback={<ShopLoadingFallback />}>
        <ShopPageContent />
      </Suspense>
    </div>
  );
}

function ShopLoadingFallback() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="h-4 w-32 bg-primary/10 rounded-full animate-pulse" />
        <div className="h-12 w-64 bg-card border border-border/50 rounded-2xl animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        <Skeleton type="product" count={8} className="aspect-3/4 rounded-3xl" />
      </div>
    </div>
  );
}
