'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { getBusinessById, incrementBusinessViews } from '@/lib/services/business.client';
import { isFavorited, addFavorite, removeFavorite } from '@/lib/services/favorite.client';
import type { BusinessWithCategory } from '@/lib/types/business';

export default function BusinessPublicPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessWithCategory | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    const fetchBusiness = async () => {
      const biz = await getBusinessById(id);
      setBusiness(biz);
      setLoading(false);

      if (biz) {
        await incrementBusinessViews(id);
      }
    };

    fetchBusiness();
  }, [id]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isAuthenticated) {
        const favStatus = await isFavorited(id);
        setIsFav(favStatus);
      }
    };
    fetchFavoriteStatus();
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    setFavLoading(true);
    const result = isFav ? await removeFavorite(id) : await addFavorite(id);
    if (result.success) {
      setIsFav(!isFav);
      if (business) {
        setBusiness({
          ...business,
          favorite_count: business.favorite_count + (isFav ? -1 : 1),
        });
      }
    }
    setFavLoading(false);
  };

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

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="mdi:store-off" className="w-16 h-16 text-[#4A4A4A] mx-auto mb-4" />
          <p className="text-[#1A1A1A] font-bold text-xl mb-2">Usaha tidak ditemukan</p>
          <Link href="/" className="text-[#6B9F7E] hover:underline">
            Kembali ke Home
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
            <Link href="/" className="flex items-center gap-2 group">
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
              href="/"
              className="px-4 py-2 text-[#1A1A1A] font-semibold hover:bg-[#E8F3E8] border-2 border-transparent hover:border-[#1A1A1A] transition-all"
            >
              <Icon icon="mdi:arrow-left" className="inline w-5 h-5 mr-1" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img
                src={business.logo_url}
                alt={business.name}
                className="w-full aspect-square object-cover border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              />
              {business.verified && (
                <div className="mt-4 px-4 py-2 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] text-center">
                  <Icon icon="mdi:check-decagram" className="inline w-5 h-5 mr-2" />
                  Terverifikasi
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-[#1A1A1A]">{business.name}</h1>
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={favLoading}
                    className="flex-shrink-0 w-12 h-12 bg-white border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                  >
                    <Icon
                      icon={isFav ? 'mdi:heart' : 'mdi:heart-outline'}
                      className={`w-6 h-6 mx-auto ${isFav ? 'text-[#E63946]' : 'text-[#4A4A4A]'}`}
                    />
                  </button>
                </div>
                <p className="text-lg text-[#4A4A4A] mb-2">{business.category?.name}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:star" className="w-5 h-5 text-[#FFB800]" />
                    <span className="font-bold text-[#1A1A1A]">
                      {business.rating_avg > 0 ? business.rating_avg.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-sm text-[#4A4A4A]">({business.rating_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:heart" className="w-5 h-5 text-[#E63946]" />
                    <span className="text-sm text-[#4A4A4A]">{business.favorite_count} favorites</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#E8F3E8] border-3 border-[#1A1A1A]">
                <p className="text-sm font-bold text-[#4A4A4A] mb-1">Pemilik</p>
                <p className="text-lg text-[#1A1A1A]">{business.owner_name}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-[#4A4A4A] mb-2">Alamat</p>
                <p className="text-[#1A1A1A]">{business.address_text}</p>
              </div>

              {business.keywords && business.keywords.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-[#4A4A4A] mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {business.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <a
                  href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Icon icon="mdi:map-marker" className="inline w-5 h-5 mr-2" />
                  Lihat di Map
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
