'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[#F8F9F7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#1A1A1A] border-t-[#6B9F7E] rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-[#1A1A1A]">Memuat peta...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper() {
  return <MapComponent />;
}
