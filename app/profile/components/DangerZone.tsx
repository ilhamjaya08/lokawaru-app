'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DangerZone() {
  const router = useRouter();
  const supabase = createClient();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'HAPUS AKUN') {
      setError('Ketik "HAPUS AKUN" untuk konfirmasi');
      return;
    }

    setSaving(true);
    setError('');

    const { error: deleteError } = await supabase.rpc('delete_user_account');

    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }

    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="bg-white border-4 border-red-500 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] p-8">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Zona Bahaya</h2>
      <p className="text-[#4A4A4A] mb-6">
        Keluar dari akun atau hapus akun secara permanen. Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-[#1A1A1A] text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Keluar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-500 text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Hapus Akun
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="p-6 bg-red-50 border-3 border-red-500">
            <p className="text-[#1A1A1A] font-bold mb-4">
              ⚠️ Peringatan: Akun akan dihapus permanen!
            </p>
            <p className="text-[#4A4A4A] mb-4 text-sm">
              Semua data termasuk usaha, review, dan favorit akan hilang.
            </p>
            <p className="text-[#4A4A4A] mb-3 text-sm font-semibold">
              Ketik "HAPUS AKUN" untuk konfirmasi:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="HAPUS AKUN"
              className="w-full px-4 py-3 border-3 border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 mb-4"
            />
            {error && <p className="text-red-700 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={saving || deleteConfirmText !== 'HAPUS AKUN'}
                className="px-6 py-3 bg-red-500 text-white font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Menghapus...' : 'Ya, Hapus Permanen'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                  setError('');
                }}
                className="px-6 py-3 bg-white text-[#1A1A1A] font-bold border-3 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
