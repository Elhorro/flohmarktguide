'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminActions({
  id,
  adminSecret,
}: {
  id: string;
  adminSecret: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'approving' | 'rejecting' | 'done'>('idle');

  async function approve() {
    setState('approving');
    await fetch(`/api/admin/approve/${id}`, {
      method: 'PATCH',
      headers: { 'x-admin-secret': adminSecret },
    });
    setState('done');
    router.refresh();
  }

  async function reject() {
    if (!confirm('Markt wirklich löschen?')) return;
    setState('rejecting');
    await fetch(`/api/admin/reject/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': adminSecret },
    });
    setState('done');
    router.refresh();
  }

  if (state === 'done') return null;

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={approve}
        disabled={state !== 'idle'}
        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {state === 'approving' ? (
          <Loader size={14} className="animate-spin" />
        ) : (
          <CheckCircle size={14} />
        )}
        Freischalten
      </button>
      <button
        onClick={reject}
        disabled={state !== 'idle'}
        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {state === 'rejecting' ? (
          <Loader size={14} className="animate-spin" />
        ) : (
          <XCircle size={14} />
        )}
        Ablehnen
      </button>
    </div>
  );
}
