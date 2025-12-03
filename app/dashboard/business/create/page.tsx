'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { getCategories } from '@/lib/services/business.client';
import { createBusiness } from '@/lib/services/business.server';
import MapPicker from '@/app/components/MapPicker';
import type { BusinessCategory, LocationCoordinates } from '@/lib/types/business';

export default function CreateBusinessPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [addressText, setAddressText] = useState('');
  const [location, setLocation] = useState<LocationCoordinates>({ lat: -6.2088, lng: 106.8456 });
  const [keywords, setKeywords] = useState('');

  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      const cats = await getCategories();
      setCategories(cats);
      setLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualCoordsSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert('Format koordinat salah!');
      return;
    }
    setLocation({ lat, lng });
    setShowManualCoords(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!logo) {
      setError('Logo wajib diupload');
      setSubmitting(false);
      return;
    }

    const keywordsArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    try {
      const result = await createBusiness({
        category_id: categoryId,
        name,
        owner_name: ownerName,
        logo,
        address_text: addressText,
        latitude: location.lat,
        longitude: location.lng,
        keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
      });

      if (!result.success) {
        setError(result.error || 'Gagal mendaftar usaha');
        setSubmitting(false);
        return;
      }

      router.push(`/dashboard/business/${result.businessId}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setSubmitting(false);
    }
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
              Kembali
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Daftarkan Usaha</h1>
          <p className="text-[#4A4A4A]">Isi form di bawah untuk mendaftarkan usaha lo ke platform</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border-3 border-red-500 text-red-700"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Kategori Usaha *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Nama Usaha *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Warung Bakso Pak Haji"
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Nama Pemilik *
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Bapak Haji Ahmad"
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Logo Usaha *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
            />
            {logoPreview && (
              <div className="mt-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-cover border-3 border-[#1A1A1A]"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Alamat Lengkap *
            </label>
            <textarea
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="Jl. Raya Bogor No. 123, RT 01/RW 05, Kelurahan Menteng, Kecamatan Bogor Barat"
              rows={3}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
            />
            <p className="text-xs text-[#4A4A4A] mt-1">Contoh: Jl. Kebon Jeruk No. 45, RT 02/RW 08</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Lokasi Presisi *
            </label>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setShowMapDialog(true)}
                className="flex-1 px-4 py-3 bg-[#6B9F7E] text-white font-semibold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Icon icon="mdi:map-marker" className="inline w-5 h-5 mr-2" />
                Buka Peta
              </button>
              <button
                type="button"
                onClick={() => setShowManualCoords(!showManualCoords)}
                className="px-4 py-3 bg-white text-[#1A1A1A] font-semibold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Icon icon="mdi:pencil" className="inline w-5 h-5 mr-2" />
                Input Manual
              </button>
            </div>

            {showManualCoords && (
              <div className="p-4 bg-[#E8F3E8] border-3 border-[#1A1A1A] mb-4 space-y-3">
                <p className="text-sm text-[#4A4A4A]">Format: -6.200000, 106.816666</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="Latitude (e.g., -6.200000)"
                    className="flex-1 px-3 py-2 border-3 border-[#1A1A1A]"
                  />
                  <input
                    type="text"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="Longitude (e.g., 106.816666)"
                    className="flex-1 px-3 py-2 border-3 border-[#1A1A1A]"
                  />
                  <button
                    type="button"
                    onClick={handleManualCoordsSubmit}
                    className="px-4 py-2 bg-[#6B9F7E] text-white font-semibold border-3 border-[#1A1A1A]"
                  >
                    Set
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 bg-[#E8F3E8] border-3 border-[#1A1A1A]">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Koordinat Saat Ini:</p>
              <p className="text-sm text-[#4A4A4A]">
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Keywords (Opsional)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="bakso, pedas, enak, murah"
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
            />
            <p className="text-xs text-[#4A4A4A] mt-1">Pisahkan dengan koma untuk keyword lebih dari satu</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-[#6B9F7E] text-white font-bold text-lg border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Mendaftar...' : 'Daftarkan Usaha'}
          </button>
        </motion.form>
      </div>

      <AnimatePresence>
        {showMapDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowMapDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Pilih Lokasi</h2>
                <button
                  onClick={() => setShowMapDialog(false)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white font-bold border-3 border-[#1A1A1A]"
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </button>
              </div>
              <MapPicker
                onLocationSelect={(coords) => setLocation(coords)}
                initialPosition={location}
              />
              <button
                onClick={() => setShowMapDialog(false)}
                className="w-full mt-4 px-6 py-3 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Konfirmasi Lokasi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
