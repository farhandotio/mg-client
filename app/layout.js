import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/Provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthInit from '@/components/AuthInit';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Gadget BDs – Buy Original Gadgets & Electronics Online in Bangladesh',
  description:
    'Shop a wide range of original gadgets, electronics, and devices online at the best prices in Bangladesh. Discover top-quality products, exclusive deals, and fast delivery at Gadget BDs.',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ReduxProvider>
          <AuthInit>
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
          </AuthInit>
        </ReduxProvider>
      </body>
    </html>
  );
}
