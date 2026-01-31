import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/Provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthInit from '@/components/AuthInit';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'গ্যাজেট বিডিএস – বাংলাদেশে অরিজিনাল গ্যাজেট ও ইলেকট্রনিক্স কিনুন অনলাইনে',
  description:
    'বাংলাদেশে সেরা দামে অরিজিনাল গ্যাজেট, ইলেকট্রনিক্স এবং লেটেস্ট ডিভাইসের বিশাল কালেকশন থেকে অনলাইনে শপিং করুন। দ্রুত ডেলিভারি ও বিশ্বস্ত সেবা।',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://mg-server.vercel.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imgs.search.brave.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://mg-server.vercel.app" />

      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-bg text-text"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <AuthInit>
            <Navbar />
            <main className="grow w-full relative">{children}</main>
            <Footer />
          </AuthInit>
        </ReduxProvider>
      </body>
    </html>
  );
}
