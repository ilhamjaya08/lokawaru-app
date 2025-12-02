import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/app/components/Navbar';

const SignOutButton = () => {
  const signOut = async () => {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/');
  };

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-6 py-3 bg-red-500 text-white font-bold border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        Keluar
      </button>
    </form>
  );
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-[#F8F9F7]">
      <Navbar />
      <div className="pt-32 px-4 text-center">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
          Selamat Datang di Dashboard!
        </h1>
        <p className="text-lg text-[#4A4A4A] mb-2">
          Ini adalah halaman dashboard lo.
        </p>
        <p className="text-md text-[#4A4A4A] mb-8">
          Logged in as: <span className="font-bold">{user.email}</span>
        </p>
        <SignOutButton />
      </div>
    </div>
  );
}
