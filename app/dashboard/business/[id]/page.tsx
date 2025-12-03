'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { getBusinessById } from '@/lib/services/business.client';
import type { BusinessWithCategory } from '@/lib/types/business';

export default function BusinessOwnerDashboard() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessWithCategory | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      const biz = await getBusinessById(id);
      if (!biz) {
        setError('Usaha tidak ditemukan');
        setLoading(false);
        return;
      }

      if (biz.owner_id !== user.id) {
        // If not the owner, redirect to the public business page
        router.push(`/business/${id}`);
        return;
      }

      setBusiness(biz);
      setLoading(false);
    };

    checkAuthAndFetch();
  }, [id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6B9F7E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4A4A]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="mdi:alert-circle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#1A1A1A] font-bold text-xl mb-2">{error || 'Usaha tidak ditemukan'}</p>
          <Link href="/dashboard" className="text-[#6B9F7E] hover:underline">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9F7]">
      <nav className="bg-white border-b-4 border-[#1A1A1A] shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="text-2xl md:text-3xl font-bold text-[#1A1A1A] flex items-center">
                <span className="inline-block px-3 py-1 bg-[#6B9F7E] text-white border-3 border-[#1A1A1A] transform -rotate-2 group-hover:rotate-0 transition-transform shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  Loka
                </span>
                <span className="inline-block px-3 py-1 bg-white text-[#1A1A1A] border-3 border-[#1A1A1A] transform rotate-2 group-hover:rotate-0 transition-transform shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -ml-1">
                  waru
                </span>
              </div>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-[#1A1A1A] font-semibold hover:bg-[#E8F3E8] border-2 border-transparent hover:border-[#1A1A1A] transition-all"
            >
              <Icon icon="mdi:arrow-left" className="inline w-5 h-5 mr-1" />
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Dashboard Usaha</h1>
          <p className="text-[#4A4A4A]">Kelola dan pantau usaha lo</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#6B9F7E] border-3 border-[#1A1A1A] flex items-center justify-center">
                <Icon icon="mdi:eye" className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-[#6B9F7E]">{business.view_count}</span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Total Views</h3>
            <p className="text-sm text-[#4A4A4A]">Orang yang lihat usaha lo</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FFB800] border-3 border-[#1A1A1A] flex items-center justify-center">
                <Icon icon="mdi:star" className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#FFB800]">
                  {business.rating_avg > 0 ? business.rating_avg.toFixed(1) : '0.0'}
                </div>
                <div className="text-sm text-[#4A4A4A]">({business.rating_count})</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Rating</h3>
            <p className="text-sm text-[#4A4A4A]">
              {business.rating_count === 0 ? 'Belum ada review' : `${business.rating_count} reviews`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#A8D5BA] border-3 border-[#1A1A1A] flex items-center justify-center">
                {business.verified ? (
                  <Icon icon="mdi:check-decagram" className="w-6 h-6 text-[#1A1A1A]" />
                ) : (
                  <Icon icon="mdi:clock-outline" className="w-6 h-6 text-[#1A1A1A]" />
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Status</h3>
            <p className="text-sm text-[#4A4A4A]">
              {business.verified ? 'Terverifikasi ✓' : 'Belum Terverifikasi'}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Informasi Usaha</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={business.logo_url}
                alt={business.name}
                className="w-full h-48 object-cover border-3 border-[#1A1A1A] mb-4"
              />
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-1">Nama Usaha</label>
                  <p className="text-lg text-[#1A1A1A]">{business.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-1">Pemilik</label>
                  <p className="text-lg text-[#1A1A1A]">{business.owner_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-1">Kategori</label>
                  <p className="text-lg text-[#1A1A1A]">{business.category?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-[#4A4A4A] mb-1">Alamat</label>
                <p className="text-[#1A1A1A]">{business.address_text}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4A4A4A] mb-1">Koordinat</label>
                <p className="text-sm text-[#4A4A4A] font-mono">
                  {business.latitude.toFixed(6)}, {business.longitude.toFixed(6)}
                </p>
              </div>
              {business.keywords && business.keywords.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-1">Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {business.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#E8F3E8] text-[#1A1A1A] border-2 border-[#1A1A1A] text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/business/${business.id}`}
              target="_blank"
              className="px-6 py-3 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Icon icon="mdi:eye" className="inline w-5 h-5 mr-2" />
              Lihat Halaman Publik
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
