import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lokawaru: Nemu Usaha Lokal Gampang Banget!',
  description: 'Cari bakso, kopi, atau apa aja di deket lo. Lokawaru pake AI buat nemuin UMKM & usaha lokal paling pas buat kamu. Yuk, jelajahi & dukung lokal!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}