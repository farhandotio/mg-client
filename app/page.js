import dynamic from 'next/dynamic';
import Hero from './components/Hero';
import FloatingHeadphoneSection from './components/FloatingHeadphoneSection';
import KeywordCardSection from './components/KeywordCardSection';
import FeatureShowcaseSection from './components/FeatureShowcaseSection';

const Category = dynamic(() => import('./components/Category'), { ssr: true });
const Feature = dynamic(() => import('./components/Feature'), { ssr: true });
const Flash = dynamic(() => import('./components/Flash'), { ssr: true });
const Best = dynamic(() => import('./components/Best'), { ssr: true });
const Brand = dynamic(() => import('./components/Brand'), { ssr: true });
const TrustSection = dynamic(() => import('./components/TrustSection'), { ssr: true });

export default function page() {
  return (
    <main className="">
      <Hero />
      <FloatingHeadphoneSection />
      <FeatureShowcaseSection />
      <KeywordCardSection />
      <Category />
      <Feature />
      <Flash />
      <Best />
      <TrustSection />
      <Brand />
    </main>
  );
}
