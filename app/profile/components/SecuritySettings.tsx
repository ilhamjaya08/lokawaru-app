'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SecuritySettings() {
  const supabase = createClient();
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Password baru tidak cocok');
      setSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter');
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Password berhasil diubah!');
      setChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    }

    setSaving(false);
  };

  const resetForm = () => {
    setChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
  };

  return (
    <div className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Keamanan</h2>
          <p className="text-[#4A4A4A] mt-1">Ubah password untuk keamanan akun</p>
        </div>
        {!changingPassword && (
          <button
            onClick={() => setChangingPassword(true)}
            className="px-4 py-2 bg-[#6B9F7E] text-white font-semibold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Ubah Password
          </button>
        )}
      </div>

      {message && !error && (
        <div className="mb-4 p-3 bg-[#E8F3E8] border-2 border-[#6B9F7E] text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      {changingPassword && (
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#6B9F7E]/30"
              required
              minLength={8}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#6B9F7E] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Mengubah...' : 'Ubah Password'}
            </button>
            <button
              type="button"
              onClick={resetForm}
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
