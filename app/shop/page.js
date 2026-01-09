import { Suspense } from 'react';
import ShopPageContent from './components/ShopPageContent';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
