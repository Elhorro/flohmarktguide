import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flohmarkt Kalender Österreich',
  description:
    'Finde Flohmärkte, Fetzen- und Antikmarkte in Österreich. Steiermark und ganz Österreich – kostenlos eintragen!',
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
