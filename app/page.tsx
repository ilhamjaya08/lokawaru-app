'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import Navbar from './components/Navbar';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  // Dummy state, mirroring the Navbar component.
  // Set user to an object to test the logged-in view, e.g., useState<object | null>({})
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#F8F9F7] overflow-hidden">
      <Navbar />

      
      <section className="relative h-[60vh] overflow-hidden mt-16 md:mt-20">
        
        <div className="absolute inset-0">
          <Image
            src="/hero.webp"
            alt="Lokawaru - Peta Usaha Lokal Indonesia"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-white/50" />
          <div className="absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-[#F8F9F7]/60" />
        </div>

        
        <div className="relative h-full flex flex-col items-center justify-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block">Nemu Usaha Lokal</span>
              <br />
              <span className="inline-block px-4 py-2 bg-[#6B9F7E] text-white transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Gampang Banget!
              </span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-[#2A2A2A] max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Platform listing peer-to-peer yang bikin warung, UMKM, dan usaha lokal
              makin mudah ditemuin. Powered by AI biar makin cepat dan tepat!
            </motion.p>
          </motion.div>
        </div>
      </section>

      
      <div className="relative -mt-24 px-4 z-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-[#6B9F7E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#8FBC8F]"></div>
              <div className="w-3 h-3 rounded-full bg-[#A8D5BA]"></div>
            </div>

            <div className="relative flex items-center">
              <Icon
                icon="heroicons:sparkles-solid"
                className="absolute left-4 text-[#6B9F7E] w-6 h-6"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bakso pedas yang enak di deket sini..."
                className="w-full pl-14 pr-14 py-4 text-lg border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30 bg-[#FAFAFA]"
              />
              <button className="absolute right-2 px-6 py-2.5 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Cari
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {['Bakso Enak', 'Warung Kopi', 'Nasi Goreng', 'Toko Kelontong'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 text-sm bg-[#E8F3E8] text-[#2A2A2A] border-2 border-[#1A1A1A] hover:bg-[#6B9F7E] hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      
      <section className="relative px-4 py-12 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6">
            
            <div className="flex items-center gap-4">
              <p className="text-lg md:text-xl font-bold text-[#2A2A2A] text-center md:text-right">
                Atau langsung cari<br />
                <span className="text-[#6B9F7E]">pake peta interaktif!</span>
              </p>

              
              <motion.div
                animate={{
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon
                  icon="ph:arrow-right-bold"
                  className="w-12 h-12 text-[#6B9F7E] hidden md:block"
                />
                <Icon
                  icon="ph:arrow-down-bold"
                  className="w-12 h-12 text-[#6B9F7E] md:hidden"
                />
              </motion.div>
            </div>

            
            <Link
              href="/explore"
              className="group relative px-8 py-4 bg-[#6B9F7E] text-white font-bold border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Icon icon="mdi:map-search" className="w-6 h-6" />
                Jelajahi Peta
              </span>

              
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#A8D5BA] border-2 border-[#1A1A1A] transform rotate-45"></div>
            </Link>
          </div>
        </motion.div>
      </section>

      
      <section className="relative px-4 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6B9F7E] rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#6B9F7E] border-3 border-[#1A1A1A] flex items-center justify-center mb-4 transform -rotate-3">
                <Icon icon="ph:brain-fill" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
                AI yang Ngerti Bahasa Loe
              </h3>
              <p className="text-[#4A4A4A] text-lg">
                Ngomong santai aja! Sistem AI kami bakal ngerti dan kasih rekomendasi usaha lokal
                yang bener-bener sesuai sama yang lo cari.
              </p>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 bg-[#6B9F7E] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-white transform md:rotate-1 hover:rotate-0 transition-all"
          >
            <div className="w-14 h-14 bg-white border-3 border-[#1A1A1A] flex items-center justify-center mb-4">
              <Icon icon="mdi:map-marker-radius" className="w-7 h-7 text-[#6B9F7E]" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Peta Interaktif</h3>
            <p className="text-white/90">
              Lihat semua usaha lokal di sekitar lo dengan peta yang gampang dipake.
            </p>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 transform md:-rotate-2 hover:rotate-0 transition-all"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#A8D5BA] border-3 border-[#1A1A1A] transform rotate-45 flex items-center justify-center">
                <Icon icon="mdi:store" className="w-8 h-8 text-[#1A1A1A] -rotate-45" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 text-center">
              Daftar Gratis
            </h3>
            <p className="text-[#4A4A4A] text-center text-sm">
              Punya warung atau toko? Listing sekarang, 100% gratis!
            </p>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-5 bg-[#E8F3E8] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="w-14 h-14 bg-[#6B9F7E] border-3 border-[#1A1A1A] flex items-center justify-center mb-4 transform rotate-12">
              <Icon icon="mdi:lightning-bolt" className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Cepet & Real-time
            </h3>
            <p className="text-[#4A4A4A]">
              Update langsung dari penjual. Menu baru? Promo? Langsung muncul di platform!
            </p>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-3 bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 transform md:rotate-2 hover:rotate-0 transition-all"
          >
            <div className="w-14 h-14 bg-[#8FBC8F] border-3 border-[#1A1A1A] flex items-center justify-center mb-4">
              <Icon icon="mdi:Indonesia" className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
              #DukungLokal
            </h3>
            <p className="text-[#4A4A4A] text-sm">
              Bantu UMKM Indonesia berkembang!
            </p>
          </motion.div>
        </div>
      </section>

      
      <section className="relative px-4 py-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-[#6B9F7E] border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {user ? 'Siap Lanjut Eksplorasi?' : 'Siap Mulai Eksplorasi?'}
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {user
                  ? 'Temukan ribuan usaha lokal di sekitar lo atau kelola usaha lo dari dashboard!'
                  : 'Gabung sekarang dan temukan ribuan usaha lokal di sekitar lo. Atau daftarin usaha lo biar makin banyak yang tau!'}
              </p>

              {loading ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="px-8 py-4 bg-gray-200 border-3 border-[#1A1A1A] animate-pulse">
                    <div className="w-40 h-6 bg-gray-300"></div>
                  </div>
                  <div className="px-8 py-4 bg-gray-200 border-3 border-white animate-pulse">
                    <div className="w-40 h-6 bg-gray-300"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/explore"
                    className="px-8 py-4 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all inline-flex items-center gap-2"
                  >
                    <Icon icon="mdi:compass" className="w-6 h-6" />
                    Jelajahi Sekarang
                  </Link>
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="px-8 py-4 bg-[#1A1A1A] text-white font-bold border-3 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] transition-all inline-flex items-center gap-2"
                    >
                      <Icon icon="mdi:view-dashboard" className="w-6 h-6" />
                      Ke Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/signup"
                      className="px-8 py-4 bg-[#1A1A1A] text-white font-bold border-3 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] transition-all inline-flex items-center gap-2"
                    >
                      <Icon icon="mdi:store-plus" className="w-6 h-6" />
                      Daftar Usaha Lo
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      
      <section className="relative px-4 py-16 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: 'mdi:store', value: '1,200+', label: 'Usaha Lokal' },
              { icon: 'mdi:account-group', value: '5,000+', label: 'Pengguna Aktif' },
              { icon: 'mdi:map-marker', value: '150+', label: 'Kota' },
              { icon: 'mdi:star', value: '4.8/5', label: 'Rating' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Icon icon={stat.icon} className="w-10 h-10 mx-auto mb-3 text-[#6B9F7E]" />
                <div className="text-3xl font-bold text-[#1A1A1A] mb-1">{stat.value}</div>
                <div className="text-sm text-[#4A4A4A] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <footer className="relative px-4 py-8 border-t-4 border-[#1A1A1A] bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#4A4A4A] font-medium">
            Lokawaru © {new Date().getFullYear()} - Mendukung Usaha Lokal dengan Teknologi AI
          </p>
        </div>
      </footer>
    </main>
  );
}