'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from '@iconify/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BusinessWithCategory } from '@/lib/types/business';
import Link from 'next/link';

// Leaflet icon setup
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export default function MapComponent() {
  const [businesses, setBusinesses] = useState<BusinessWithCategory[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Default to Jakarta
  const [mapZoom, setMapZoom] = useState(14);
  const mapRef = useRef<L.Map | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*, category:business_categories(*)');
      
      if (error) {
        console.error('Error fetching businesses for map:', error);
        return;
      }

      const formattedData = data.map(({ business_categories, ...rest }: any) => ({
        ...rest,
        category: business_categories,
      }));
      setBusinesses(formattedData);
    };
    fetchBusinesses();
  }, [supabase]);

  const filteredBusinesses = searchQuery
    ? businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (business.keywords && business.keywords.join(' ').toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : businesses;

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak bisa mendapatkan lokasi. Pastikan izin lokasi sudah diberikan.');
        }
      );
    } else {
      alert('Browser tidak mendukung geolocation');
    }
  };

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 3));

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredBusinesses.map((business) => (
          <Marker
            key={business.id}
            position={[business.latitude, business.longitude]}
            eventHandlers={{
              click: () => setSelectedBusiness(business),
            }}
          >
            <Popup>
              <div className="font-bold text-sm">{business.name}</div>
              <div className="text-xs text-gray-600">{business.category?.name}</div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Lokasi Anda</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="absolute top-4 left-4 right-4 z-10 max-w-md">
        <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:sparkles-solid" className="w-5 h-5 text-[#6B9F7E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari bakso pedas, warung kopi..."
              className="flex-1 px-3 py-2 border-2 border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#6B9F7E] bg-[#FAFAFA]"
            />
          </div>
        </div>
      </div>

      <div className="absolute left-4 top-24 bottom-4 w-80 z-10 hidden lg:block">
        <div className="h-full bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-[#6B9F7E] border-b-4 border-[#1A1A1A] p-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icon icon="mdi:store" className="w-5 h-5" />
              Usaha Lokal ({filteredBusinesses.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredBusinesses.map((business) => (
              <button
                key={business.id}
                onClick={() => {
                  setSelectedBusiness(business);
                  setMapCenter([business.latitude, business.longitude]);
                  setMapZoom(16);
                }}
                className={`w-full p-3 border-3 border-[#1A1A1A] text-left transition-all hover:translate-x-[2px] hover:translate-y-[2px] ${
                  selectedBusiness?.id === business.id
                    ? 'bg-[#6B9F7E] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-[#E8F3E8] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className="font-bold text-base mb-1.5 leading-tight">{business.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-black/10 border border-[#1A1A1A] font-medium">
                    {business.category?.name}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Icon icon="mdi:star" className="w-3.5 h-3.5" />
                    {business.rating_avg.toFixed(1)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedBusiness && (
        <div className="absolute bottom-4 right-4 w-80 lg:w-96 z-10">
          <div className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative">
            <button
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#6B9F7E] transition-colors"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
            <div className="mb-3">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 pr-8">
                {selectedBusiness.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#6B9F7E] text-white text-xs font-bold border-2 border-[#1A1A1A]">
                  {selectedBusiness.category?.name}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold">
                  <Icon icon="mdi:star" className="w-4 h-4 text-[#6B9F7E]" />
                  {selectedBusiness.rating_avg.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-[#4A4A4A] mb-4">{selectedBusiness.address_text}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/business/${selectedBusiness.id}`} className="flex-1">
                <button className="w-full px-4 py-2 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
                  <Icon icon="mdi:eye" className="w-4 h-4" />
                  Lihat Detail
                </button>
              </Link>
              <a href={`https://www.google.com/maps?q=${selectedBusiness.latitude},${selectedBusiness.longitude}`} target="_blank" rel="noopener noreferrer">
                <button className="px-4 py-2 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center">
                  <Icon icon="mdi:directions" className="w-5 h-5" />
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 lg:left-[21rem] z-10 flex flex-col gap-2">
        <button
          onClick={handleGetLocation}
          className="w-12 h-12 bg-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center group"
          title="Lokasi Saya"
        >
          <Icon icon="mdi:crosshairs-gps" className="w-6 h-6 text-[#6B9F7E] group-hover:text-[#1A1A1A]" />
        </button>
        <button
          onClick={handleZoomIn}
          className="w-12 h-12 bg-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center font-bold text-xl"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-12 h-12 bg-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center font-bold text-xl"
        >
          −
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white font-bold border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(107,159,126,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(107,159,126,1)] transition-all"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          <span className="hidden sm:inline">Kembali</span>
        </Link>
      </div>
    </div>
  );
}
