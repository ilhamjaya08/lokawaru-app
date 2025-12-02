import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function ProfileHeader() {
  return (
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
            className="px-4 py-2 text-[#1A1A1A] font-semibold hover:bg-[#E8F3E8] border-2 border-transparent hover:border-[#1A1A1A] transition-all flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
