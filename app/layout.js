import './globals.css';
import { ReduxProvider } from '@/store/Provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthInit from '@/components/AuthInit';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'গ্যাজেট বিডিএস – বাংলাদেশে অরিজিনাল গ্যাজেট ও ইলেকট্রনিক্স কিনুন অনলাইনে',
  description:
    'বাংলাদেশে সেরা দামে অরিজিনাল গ্যাজেট, ইলেকট্রনিক্স এবং লেটেস্ট ডিভাইসের বিশাল কালেকশন থেকে অনলাইনে শপিং করুন। দ্রুত ডেলিভারি ও বিশ্বস্ত সেবা।',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6D28D9',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://mg-server.vercel.app" crossOrigin="anonymous" />

        <link
          rel="preload"
          as="image"
          href="https://ik.imagekit.io/iura/gadgetbds.png"
          fetchPriority="high"
        />

        <link rel="dns-prefetch" href="https://mg-server.vercel.app" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-bg text-text selection:bg-primary selection:text-white"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <AuthInit>
            <Navbar />
            <main id="main-content" className="grow w-full relative outline-none">
              {children}
              <Analytics />
            </main>
            <Footer />
          </AuthInit>
        </ReduxProvider>
      </body>
    </html>
  );
}
