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
  title: 'Gadget BDs – Buy Original Gadgets & Electronics Online in Bangladesh',
  description:
    'Shop a wide range of original gadgets, electronics, and devices online at the best prices in Bangladesh.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://mg-server.vercel.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imgs.search.brave.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://mg-server.vercel.app" />

        <link rel="preload" href="BACKEND_URL_OF_HERO_IMAGE" as="image" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-bg text-text"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <AuthInit>
            <Navbar />
            <main className="grow w-full">{children}</main>
            <Footer />
          </AuthInit>
        </ReduxProvider>
      </body>
    </html>
  );
}
