'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Calendar, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Märkte', icon: Calendar },
  { href: '/karte', label: 'Karte', icon: MapPin },
  { href: '/eintragen', label: 'Eintragen', icon: Plus },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Flohmarkt Guide"
              width={44}
              height={44}
              className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              priority
            />
            <div className="hidden sm:block leading-tight">
              <span className="font-bold text-stone-800 text-lg block">flohmarkt<span className="text-orange-500">guide</span></span>
              <span className="text-stone-400 text-[10px] font-medium tracking-widest uppercase">Tipps · Termine · Kalender</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/eintragen"
            className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow"
          >
            <Plus size={16} />
            Markt eintragen
          </Link>

          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
