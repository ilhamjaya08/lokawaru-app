import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Lokawaru',
  description: 'Kelola usaha lo, lihat statistik, dan atur profil di sini.',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
