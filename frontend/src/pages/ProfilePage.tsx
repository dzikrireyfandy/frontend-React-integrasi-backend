import { useEffect, useState } from 'react'
import { authApi } from '../lib/api'
import { parseError } from '../lib/errors'
import { roleLabel } from '../lib/format'
import { ErrorState, Spinner } from '../components/ui'
import type { User } from '../types/api'

const roleNote: Record<string, string> = {
  admin: 'Bisa menambah, mengubah, dan menghapus semua warung.',
  owner: 'Bisa menambah warung dan mengubah warung milik sendiri. Menghapus hanya untuk admin.',
  customer: 'Bisa melihat daftar dan detail warung.',
}

// Data diambil langsung dari GET /auth/me (bukan dari state lokal) sebagai bukti integrasi.
export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError(null)
    authApi
      .me()
      .then((data) => {
        if (!cancelled) setMe(data)
      })
      .catch((caught) => {
        if (!cancelled) setError(parseError(caught).message)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Profil</h1>
      <p className="mt-1 text-sm text-muted">Informasi akun yang sedang login, diambil dari GET /auth/me.</p>

      <div className="mt-6">
        {error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
        ) : !me ? (
          <Spinner label="Memuat profil..." />
        ) : (
          <div className="rounded-2xl border border-line bg-white p-6">
            <dl className="divide-y divide-line">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-muted">Nama</dt>
                <dd className="font-semibold">{me.name}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-muted">Email</dt>
                <dd className="break-all font-semibold">{me.email}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-muted">Role</dt>
                <dd className="font-semibold">{roleLabel[me.role]}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-muted">ID pengguna</dt>
                <dd className="font-semibold">{me.id}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-sage p-3 text-sm text-pine">{roleNote[me.role]}</p>
          </div>
        )}
      </div>
    </div>
  )
}
