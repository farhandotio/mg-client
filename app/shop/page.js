import { Suspense } from 'react';
import ShopPageContent from './components/ShopPageContent';
import Skeleton from '@/components/Skeleton';

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<ShopLoadingFallback />}>
        <ShopPageContent />
      </Suspense>
    </div>
  );
}

function ShopLoadingFallback() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-48 bg-card/40 rounded-xl animate-pulse" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <Skeleton type="product" count={8} />
      </div>
    </div>
  );
}
