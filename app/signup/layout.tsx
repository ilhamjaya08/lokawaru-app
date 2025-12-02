import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Akun | Lokawaru',
  description: 'Bikin akun gratis di Lokawaru. Daftarin usaha lo atau mulai petualangan kuliner & belanja lokal. Cuma butuh semenit!',
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
