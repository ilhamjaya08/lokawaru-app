import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk ke Akun | Lokawaru',
  description: 'Login ke akun Lokawaru lo. Lanjut kelola usaha, lihat statistik, atau cari lagi tempat nongkrong & jajan favorit.',
};

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
