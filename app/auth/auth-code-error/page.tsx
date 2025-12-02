import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F7] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-lg">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] mb-4">
          Waduh, Ada Masalah
        </h1>
        <p className="text-lg text-[#4A4A4A] mb-8">
          Terjadi kesalahan saat mencoba masuk ke akun lo. Ini bisa terjadi karena link-nya kedaluwarsa atau udah pernah dipake.
        </p>
        <Link
          href="/signin"
          className="px-8 py-4 bg-[#6B9F7E] text-white font-bold border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Coba Masuk Lagi
        </Link>
      </div>
    </div>
  );
}
