'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(false); // Set to false to avoid showing the loading state initially

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-[#1A1A1A] shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="text-2xl md:text-3xl font-bold text-[#1A1A1A] flex items-center">
                <span className="inline-block px-3 py-1 bg-[#6B9F7E] text-white border-3 border-[#1A1A1A] transform -rotate-2 group-hover:rotate-0 transition-transform shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  Loka
                </span>
                <span className="inline-block px-3 py-1 bg-white text-[#1A1A1A] border-3 border-[#1A1A1A] transform rotate-2 group-hover:rotate-0 transition-transform shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -ml-1">
                  waru
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/explore"
              className="px-4 py-2 text-[#1A1A1A] font-semibold hover:bg-[#E8F3E8] border-2 border-transparent hover:border-[#1A1A1A] transition-all"
            >
              Jelajahi
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-[#1A1A1A] font-semibold hover:bg-[#E8F3E8] border-2 border-transparent hover:border-[#1A1A1A] transition-all"
            >
              Tentang
            </Link>
          </div>

          {loading ? (
            <div className="px-4 md:px-6 py-2 md:py-2.5 bg-gray-200 border-3 border-[#1A1A1A] text-sm md:text-base animate-pulse">
              <div className="w-24 h-5 bg-gray-300"></div>
            </div>
          ) : user ? (
            <Link
              href="/dashboard"
              className="px-4 md:px-6 py-2 md:py-2.5 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm md:text-base"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="px-4 md:px-6 py-2 md:py-2.5 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm md:text-base"
            >
              Daftar Usaha
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
