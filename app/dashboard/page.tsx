'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Static Business Data ---
  const [businesses] = useState<any[]>([]);
  const [loadingBusinesses] = useState(false);
  const [favoriteCount] = useState(0);
  const totalViews = businesses.reduce((sum, biz) => sum + (biz.view_count || 0), 0);
  // --- End of Static Business Data ---

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-[#6B9F7E]" />
          <p className="text-lg font-bold text-[#1A1A1A]">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <main className="relative min-h-screen bg-[#F8F9F7] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 border-4 border-[#6B9F7E] opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-[#A8D5BA] opacity-20 transform rotate-45"
        />
      </div>

      <header className="relative border-b-4 border-[#1A1A1A] bg-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#F8F9F7] border-3 border-[#1A1A1A] hover:bg-[#E8F3E8] transition-colors"
              >
                <Icon icon="mdi:account-circle" className="w-5 h-5 text-[#6B9F7E]" />
                <span className="font-medium text-[#1A1A1A]">{userName}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Icon icon="mdi:logout" className="w-5 h-5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-2">
            Halo, {userName}! 👋
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            Selamat datang di dashboard Lokawaru. Atur usaha lo atau cari produk lokal terdekat!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#6B9F7E] border-3 border-[#1A1A1A] flex items-center justify-center">
                <Icon icon="mdi:store" className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-[#6B9F7E]">{businesses.length}</span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Usaha Terdaftar</h3>
            <p className="text-sm text-[#4A4A4A]">
              {businesses.length === 0 ? 'Belum ada usaha yang didaftarkan' : `${businesses.length} usaha aktif`}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#8FBC8F] border-3 border-[#1A1A1A] flex items-center justify-center">
                <Icon icon="mdi:heart" className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-[#8FBC8F]">{favoriteCount}</span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Favorit</h3>
            <p className="text-sm text-[#4A4A4A]">Usaha yang lo simpan</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#A8D5BA] border-3 border-[#1A1A1A] flex items-center justify-center">
                <Icon icon="mdi:eye" className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <span className="text-3xl font-bold text-[#A8D5BA]">{totalViews}</span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Total Views</h3>
            <p className="text-sm text-[#4A4A4A]">Orang yang lihat usaha lo</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Usaha Saya</h2>
            <button className="cursor-not-allowed px-4 py-2 bg-gray-300 text-gray-500 font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              + Tambah Usaha
            </button>
          </div>
          <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
            <div className="w-24 h-24 bg-[#F8F9F7] border-3 border-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:store-outline" className="w-12 h-12 text-[#6B9F7E]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Belum Ada Usaha Terdaftar</h3>
            <p className="text-[#4A4A4A] mb-6 max-w-md mx-auto">
              Lo belum punya usaha yang terdaftar. Yuk daftarin usaha lo biar makin banyak customer yang tau!
            </p>
            <button className="cursor-not-allowed px-6 py-3 bg-gray-300 text-gray-500 font-bold text-lg border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Daftarkan Usaha Pertama
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}