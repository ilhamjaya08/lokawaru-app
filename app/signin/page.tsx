'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SigninPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  const handleOAuthSignIn = async (provider: 'google') => {
    setLoading(true);
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-[#F8F9F7] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-32 h-32 border-4 border-[#6B9F7E] opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-[#A8D5BA] opacity-20 transform rotate-45"
        />
      </div>

      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          <span className="hidden sm:inline">Beranda</span>
        </Link>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 flex gap-2">
              <Link
                href="/signup"
                className="px-8 py-3 font-bold border-3 border-[#1A1A1A] transition-all bg-white text-[#1A1A1A] hover:bg-[#E8F3E8]"
              >
                Daftar
              </Link>
              <Link
                href="/signin"
                className="px-8 py-3 font-bold border-3 border-[#1A1A1A] transition-all bg-[#6B9F7E] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Masuk
              </Link>
            </div>
          </div>

          <div className="bg-white border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="grid md:grid-cols-2 min-h-[600px]">
              <div className="relative bg-[#6B9F7E] p-12 hidden md:flex flex-col justify-center items-center overflow-hidden">
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                  >
                    <div className="w-32 h-32 bg-white border-4 border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                      <Icon icon="mdi:account-arrow-right" className="w-16 h-16 text-[#6B9F7E]" />
                    </div>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-4"
                  >
                    Selamat Datang!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-white/90 text-lg"
                  >
                    Masuk ke akun lo untuk kelola usaha dan lihat statistik.
                  </motion.p>
                </div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                    Masuk ke Akun
                  </h1>
                  <p className="text-[#4A4A4A] mb-8">
                    Lanjutin petualangan lo di Lokawaru!
                  </p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-3 border-red-500 text-red-700">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:alert-circle" className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Icon icon="mdi:email" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B9F7E]" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contoh@email.com"
                          className="w-full pl-12 pr-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30 bg-[#FAFAFA]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Icon icon="mdi:lock" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B9F7E]" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Masukkan password lo"
                          className="w-full pl-12 pr-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30 bg-[#FAFAFA]"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#6B9F7E] text-white font-bold text-lg border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                          Tunggu sebentar...
                        </span>
                      ) : (
                        'Masuk'
                      )}
                    </button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-[#1A1A1A]"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-[#4A4A4A] font-medium">
                          Atau masuk dengan
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => handleOAuthSignIn('google')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-3 border-[#1A1A1A] font-bold hover:bg-[#E8F3E8] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                      >
                        <Icon icon="mdi:google" className="w-5 h-5" />
                        <span>Google</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}