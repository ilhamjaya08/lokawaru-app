'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { getMyBusinesses } from '@/lib/services/business.client';
import { getFavorites } from '@/lib/services/favorite.client';
import type { User } from '@supabase/supabase-js';
import type { Business } from '@/lib/types/business';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const supabase = createClient();

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

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) return;
      setLoadingBusinesses(true);
      try {
        const userBusinesses = await getMyBusinesses();
        setBusinesses(userBusinesses);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const favs = await getFavorites();
        setFavoriteCount(favs.length);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
  const totalViews = businesses.reduce((sum, biz) => sum + (biz.view_count || 0), 0);

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
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-10 w-16 h-16 border-4 border-[#8FBC8F] rounded-full opacity-20"
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

          <Link href="/dashboard/favorites">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer p-6"
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
          </Link>

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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Link href="/dashboard/business/create">
              <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#6B9F7E] border-3 border-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:store-plus" className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Daftarkan Usaha</h3>
                    <p className="text-sm text-[#4A4A4A] mb-3">
                      Punya warung, UMKM, atau usaha lokal? Daftarin sekarang biar makin banyak yang tau!
                    </p>
                    <button className="px-4 py-2 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      Mulai Daftar
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            
            <Link href="/explore">
              <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#8FBC8F] border-3 border-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:map-search" className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Jelajah Usaha Lokal</h3>
                    <p className="text-sm text-[#4A4A4A] mb-3">
                      Cari warung, toko, atau jasa terdekat dengan AI-powered search yang canggih!
                    </p>
                    <button className="px-4 py-2 bg-[#8FBC8F] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      Mulai Cari
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Usaha Saya</h2>
            <Link href="/dashboard/business/create">
              <button className="px-4 py-2 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                + Tambah Usaha
              </button>
            </Link>
          </div>

          {loadingBusinesses ? (
            <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
              <Icon icon="mdi:loading" className="w-12 h-12 animate-spin text-[#6B9F7E] mx-auto" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
              <div className="w-24 h-24 bg-[#F8F9F7] border-3 border-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:store-outline" className="w-12 h-12 text-[#6B9F7E]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Belum Ada Usaha Terdaftar</h3>
              <p className="text-[#4A4A4A] mb-6 max-w-md mx-auto">
                Lo belum punya usaha yang terdaftar. Yuk daftarin usaha lo biar makin banyak customer yang tau!
              </p>
              <Link href="/dashboard/business/create">
                <button className="px-6 py-3 bg-[#6B9F7E] text-white font-bold text-lg border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Daftarkan Usaha Pertama
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/dashboard/business/${business.id}`}>
                    <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer overflow-hidden group">
                      <div className="relative h-48 bg-[#F8F9F7] border-b-4 border-[#1A1A1A]">
                        <Image
                          src={business.logo_url}
                          alt={business.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-1">{business.name}</h3>
                          {business.verified && (
                            <div className="flex-shrink-0 ml-2 w-6 h-6 bg-[#6B9F7E] border-2 border-[#1A1A1A] flex items-center justify-center">
                              <Icon icon="mdi:check-bold" className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-[#4A4A4A] mb-3 line-clamp-2">{business.address_text}</p>
                        <div className="flex items-center gap-4 text-xs text-[#4A4A4A]">
                          <div className="flex items-center gap-1">
                            <Icon icon="mdi:eye" className="w-4 h-4" />
                            <span>{business.view_count || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Informasi Akun</h2>
          <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-[#6B9F7E] border-3 border-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:account" className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Nama</label>
                  <p className="text-lg text-[#4A4A4A]">{userName}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Email</label>
                  <p className="text-lg text-[#4A4A4A]">{userEmail}</p>
                </div>
                <Link
                  href="/profile"
                  className="inline-block px-4 py-2 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Kelola Profil
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}