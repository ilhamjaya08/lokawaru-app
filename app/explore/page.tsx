import { Metadata } from 'next';
import MapWrapper from '../components/MapWrapper';

export const metadata: Metadata = {
  title: 'Jelajahi Peta - Lokawaru',
  description: 'Jelajahi peta interaktif usaha lokal di sekitar Anda dengan teknologi AI',
};

export default function ExplorePage() {
  return (
    <main className="h-screen overflow-hidden">
      <MapWrapper />
    </main>
  );
}
