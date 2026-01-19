import dynamic from 'next/dynamic';
import Hero from './components/Hero';

const Category = dynamic(() => import('./components/Category'), { ssr: true });
const Feature = dynamic(() => import('./components/Feature'), { ssr: true });
const Flash = dynamic(() => import('./components/Flash'), { ssr: true });
const Best = dynamic(() => import('./components/Best'), { ssr: true });
const Brand = dynamic(() => import('./components/Brand'), { ssr: true });
const TrustSection = dynamic(() => import('./components/TrustSection'), { ssr: true });

export default function page() {
  return (
    <main className="max-w-7xl mx-auto">
      <Hero /> 
      <Category />
      <Feature />
      <Flash />
      <Best />
      <TrustSection />
      <Brand />
    </main>
  );
}
