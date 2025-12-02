'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/lib/services/user.client';
import type { FullUser } from '@/lib/types/user';

import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import SecuritySettings from './components/SecuritySettings';
import DangerZone from './components/DangerZone';

interface ProfileClientPageProps {
  user: FullUser;
}

export default function ProfileClientPage({ user: initialUser }: ProfileClientPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<FullUser>(initialUser);
  const [editing, setEditing] = useState(false);

  const [displayName, setDisplayName] = useState(user.displayName);
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const result = await updateProfile({
      displayName,
      phone: phone || undefined,
      bio: bio || undefined,
    });

    if (result.success) {
      setMessage('Profil berhasil diperbarui!');
      setEditing(false);
      // Optimistically update the local user state
      setUser(prevUser => ({ ...prevUser, displayName, phone, bio }));
      // Refresh server components on the page
      router.refresh();
    } else {
      setError(result.error || 'Gagal memperbarui profil');
    }

    setSaving(false);
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#F8F9F7]">
      <ProfileHeader />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Profil Saya</h1>
          <p className="text-[#4A4A4A]">Kelola informasi profil dan keamanan akun</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-[#E8F3E8] border-3 border-[#6B9F7E] text-[#1A1A1A]">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-3 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <ProfileInfo
          user={user}
          editing={editing}
          setEditing={setEditing}
          displayName={displayName}
          setDisplayName={setDisplayName}
          phone={phone}
          setPhone={setPhone}
          bio={bio}
          setBio={setBio}
          handleUpdateProfile={handleUpdateProfile}
          saving={saving}
        />

        <SecuritySettings />

        <DangerZone />
      </div>
    </main>
  );
}