'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { LocationCoordinates } from '@/lib/types/business';

interface MapPickerProps {
  onLocationSelect: (coords: LocationCoordinates) => void;
  initialPosition?: LocationCoordinates;
}

export default function MapPicker({ onLocationSelect, initialPosition }: MapPickerProps) {
  const [position, setPosition] = useState<LocationCoordinates>(
    initialPosition || { lat: -6.2088, lng: 106.8456 }
  );
  const [isClient, setIsClient] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);

    const loadMap = async () => {
      const leaflet = await import('leaflet');

      if (typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const { MapContainer, TileLayer, Marker, useMapEvents } = await import('react-leaflet');

      const icon = leaflet.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      function LocationMarker({ pos, onChange }: any) {
        useMapEvents({
          click(e: any) {
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
          },
        });
        return <Marker position={[pos.lat, pos.lng]} icon={icon} />;
      }

      const Map = ({ position: pos, onPosChange }: any) => (
        <MapContainer
          center={[pos.lat, pos.lng]}
          zoom={13}
          className="h-96 border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker pos={pos} onChange={onPosChange} />
        </MapContainer>
      );

      setMapComponent(() => Map);
    };

    loadMap();
  }, []);

  const handlePositionChange = (coords: LocationCoordinates) => {
    setPosition(coords);
    onLocationSelect(coords);
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          handlePositionChange(coords);
          setGettingLocation(false);
        },
        () => {
          alert('Tidak bisa mendapatkan lokasi saat ini');
          setGettingLocation(false);
        }
      );
    } else {
      alert('Browser tidak support geolocation');
      setGettingLocation(false);
    }
  };

  if (!isClient || !MapComponent) {
    return (
      <div className="h-96 bg-gray-100 border-3 border-[#1A1A1A] flex items-center justify-center">
        <p className="text-[#4A4A4A]">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#4A4A4A]">
          Klik map untuk pin lokasi, atau gunakan lokasi saat ini
        </p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="px-4 py-2 bg-[#6B9F7E] text-white font-semibold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
        >
          {gettingLocation ? (
            <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <Icon icon="mdi:crosshairs-gps" className="w-5 h-5" />
              Lokasi Saya
            </span>
          )}
        </button>
      </div>

      <MapComponent position={position} onPosChange={handlePositionChange} />

      <div className="p-4 bg-[#E8F3E8] border-3 border-[#1A1A1A]">
        <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Koordinat Terpilih:</p>
        <div className="flex gap-4">
          <div>
            <span className="text-xs text-[#4A4A4A]">Latitude:</span>
            <p className="font-mono text-sm text-[#1A1A1A]">{position.lat.toFixed(6)}</p>
          </div>
          <div>
            <span className="text-xs text-[#4A4A4A]">Longitude:</span>
            <p className="font-mono text-sm text-[#1A1A1A]">{position.lng.toFixed(6)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
