'use client';

import type { FullUser } from '@/lib/types/user';

interface ProfileInfoProps {
  user: FullUser;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
}

export default function ProfileInfo({
  user,
  editing,
  setEditing,
  displayName,
  setDisplayName,
  phone,
  setPhone,
  bio,
  setBio,
  handleUpdateProfile,
  saving,
}: ProfileInfoProps) {
  const cancelEdit = () => {
    setEditing(false);
    setDisplayName(user.displayName);
    setPhone(user.phone || '');
    setBio(user.bio || '');
  };

  return (
    <div className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Informasi Profil</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-[#6B9F7E] text-white font-semibold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Edit Profil
          </button>
        )}
      </div>

      {!editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-1">Email</label>
            <p className="text-lg text-[#1A1A1A]">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-1">Nama</label>
            <p className="text-lg text-[#1A1A1A]">{user.displayName}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-1">Nomor HP</label>
            <p className="text-lg text-[#1A1A1A]">{user.phone || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-1">Bio</label>
            <p className="text-lg text-[#1A1A1A]">{user.bio || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-1">Role</label>
            <div className="flex gap-2">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-[#E8F3E8] text-[#1A1A1A] border-2 border-[#1A1A1A] text-sm font-semibold"
                >
                  {role === 'user' ? 'User' : 'Business Owner'}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] bg-gray-100 text-[#4A4A4A] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Nama</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Nomor HP</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritain tentang diri lo..."
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-3 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
