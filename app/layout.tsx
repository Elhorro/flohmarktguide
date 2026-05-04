import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flohmarktguide.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Flohmarkt Kalender Österreich',
    template: '%s | Flohmarkt Kalender',
  },
  description:
    'Finde Flohmärkte, Fetzen- und Antikmarkte in Österreich. Steiermark und ganz Österreich – kostenlos eintragen!',
  keywords: [
    'Flohmarkt',
    'Österreich',
    'Steiermark',
    'Graz',
    'Fetzenmarkt',
    'Antikmarkt',
    'Hausflohmarkt',
    'Second Hand',
    'Flohmarkt Kalender',
  ],
  authors: [{ name: 'Flohmarkt Kalender' }],
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: BASE_URL,
    siteName: 'Flohmarkt Kalender Österreich',
    title: 'Flohmarkt Kalender Österreich',
    description:
      'Finde Flohmärkte, Fetzen- und Antikmarkte in Österreich. Kostenlos eintragen!',
  },
  twitter: {
    card: 'summary',
    title: 'Flohmarkt Kalender Österreich',
    description:
      'Finde Flohmärkte, Fetzen- und Antikmarkte in Österreich. Kostenlos eintragen!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-white text-stone-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
