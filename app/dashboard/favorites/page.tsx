'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { getFavorites } from '@/lib/services/favorite.client';
import type { BusinessWithCategory } from '@/lib/types/business';

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<BusinessWithCategory[]>([]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      try {
        const favs = await getFavorites();
        setFavorites(favs);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center">
        <Icon icon="mdi:loading" className="w-12 h-12 animate-spin text-[#6B9F7E]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9F7]">
      <header className="border-b-4 border-[#1A1A1A] bg-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
            <Icon icon="mdi:heart" className="inline w-10 h-10 text-[#E63946] mr-2" />
            Favorit Gw
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            Usaha lokal yang lo sukai ({favorites.length})
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center"
          >
            <div className="w-24 h-24 bg-[#F8F9F7] border-3 border-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:heart-outline" className="w-12 h-12 text-[#E63946]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Belum Ada Favorit</h3>
            <p className="text-[#4A4A4A] mb-6 max-w-md mx-auto">
              Mulai explore usaha lokal dan tandai yang lo suka sebagai favorit!
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-[#6B9F7E] text-white font-bold text-lg border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Jelajah Usaha
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/business/${business.id}`}>
                  <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer overflow-hidden group">
                    <div className="relative h-48 bg-[#F8F9F7] border-b-4 border-[#1A1A1A]">
                      <Image
                        src={business.logo_url}
                        alt={business.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {business.verified && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-[#6B9F7E] border-2 border-[#1A1A1A] flex items-center justify-center">
                          <Icon icon="mdi:check-bold" className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 line-clamp-1">
                        {business.name}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] mb-2">{business.category?.name}</p>
                      <p className="text-sm text-[#4A4A4A] mb-3 line-clamp-2">{business.address_text}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:star" className="w-4 h-4 text-[#FFB800]" />
                          <span>{business.rating_avg > 0 ? business.rating_avg.toFixed(1) : '0.0'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:eye" className="w-4 h-4 text-[#4A4A4A]" />
                          <span>{business.view_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
