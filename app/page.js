import dynamic from 'next/dynamic';
import Hero from './components/Hero';
import FloatingHeadphoneSection from './components/FloatingHeadphoneSection';
import KeywordCardSection from './components/KeywordCardSection';
import FeatureShowcaseSection from './components/FeatureShowcaseSection';
import Footer from '@/components/Footer';
const Feature = dynamic(() => import('./components/Feature'), { ssr: true });

export default function page() {
  return (
    <main className="">
      <Hero />
      <FloatingHeadphoneSection />
      <Feature />
      <FeatureShowcaseSection />
      <KeywordCardSection />
      <Footer/>
    </main>
  );
}
