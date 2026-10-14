import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'HMR Hotels & Resorts — Home of the HMR Dum Biryani',
  description: 'HMR Hotels & Resorts — luxury rooms and suites, a rooftop infinity pool, spa, and the famous HMR dum biryani served at Ember or delivered to your room around the clock.',
  openGraph: {
    title: 'HMR Hotels & Resorts',
    description: 'Luxury stays and the famous HMR dum biryani.',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#0c231c', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="is-loading">{children}</body>
    </html>
  );
}
