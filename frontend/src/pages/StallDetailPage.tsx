import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Flame, MapPin, Pencil, Star, Trash2, UtensilsCrossed } from 'lucide-react'
import { stallApi } from '../lib/api'
import { parseError } from '../lib/errors'
import { can } from '../lib/permissions'
import { categoryColor, formatRupiah } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'
import { EmptyState, ErrorState, Spinner } from '../components/ui'
import type { MenuItem, Stall } from '../types/api'

interface LoadError {
  status: number | null
  message: string
}

export default function StallDetailPage() {
  const { id } = useParams()
  const stallId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [stall, setStall] = useState<Stall | null>(null)
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<LoadError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!Number.isInteger(stallId) || stallId <= 0) {
      setError({ status: 404, message: 'ID warung tidak valid.' })
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    Promise.all([stallApi.get(stallId), stallApi.menus(stallId)])
      .then(([stallData, menuData]) => {
        if (cancelled) return
        setStall(stallData)
        setMenus(menuData)
      })
      .catch((caught) => {
        if (cancelled) return
        const parsed = parseError(caught)
        setError({ status: parsed.status, message: parsed.message })
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [stallId, reloadKey])

  async function handleDelete() {
    if (!stall) return
    setDeleting(true)
    try {
      await stallApi.remove(stall.id)
      toast.success(`Warung "${stall.name}" berhasil dihapus.`)
      navigate('/', { replace: true })
    } catch (caught) {
      const parsed = parseError(caught)
      toast.error(parsed.status === 403 ? `Akses ditolak: ${parsed.message}` : parsed.message)
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const back = (
    <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-pine">
      <ArrowLeft size={16} aria-hidden="true" />
      Kembali ke daftar warung
    </Link>
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {back}
        <Spinner label="Memuat detail warung..." />
      </div>
    )
  }

  if (error || !stall) {
    const notFound = error?.status === 404
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {back}
        {notFound ? (
          <EmptyState
            title="Warung tidak ditemukan"
            description="Warung ini mungkin sudah dihapus atau alamatnya salah."
            action={
              <Link to="/" className="btn btn-primary">
                Lihat semua warung
              </Link>
            }
          />
        ) : (
          <ErrorState message={error?.message ?? 'Terjadi kesalahan.'} onRetry={() => setReloadKey((key) => key + 1)} />
        )}
      </div>
    )
  }

  const color = categoryColor(stall.category)
  const canEdit = can.edit(user, stall)
  const canDelete = can.remove(user)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {back}

      <article className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="px-6 py-8 sm:px-8" style={{ background: color.bg, color: color.fg }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold">{stall.category ?? 'Tanpa kategori'}</span>
            {stall.isPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-sm font-bold">
                <Flame size={14} aria-hidden="true" />
                Populer
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{stall.name}</h1>
          {stall.location && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
              <MapPin size={16} aria-hidden="true" />
              {stall.location}
            </p>
          )}
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Star size={22} className="fill-saffron text-saffron" aria-hidden="true" />
              <span className="font-display text-2xl font-extrabold">{stall.avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted">dari {stall.reviewCount} ulasan</span>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex gap-2">
                {canEdit && (
                  <Link to={`/stalls/${stall.id}/edit`} className="btn btn-outline">
                    <Pencil size={16} aria-hidden="true" />
                    Ubah
                  </Link>
                )}
                {canDelete && (
                  <button type="button" className="btn btn-danger-outline" onClick={() => setConfirmOpen(true)}>
                    <Trash2 size={16} aria-hidden="true" />
                    Hapus
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">Tentang warung</h2>
            <p className="mt-2 max-w-prose leading-relaxed text-muted">{stall.description ?? 'Belum ada deskripsi.'}</p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">Menu</h2>
            {menus.length === 0 ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                <UtensilsCrossed size={16} aria-hidden="true" />
                Warung ini belum mencantumkan menu.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                {menus.map((menu) => (
                  <li key={menu.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className={menu.isAvailable ? 'font-medium' : 'font-medium text-muted line-through'}>{menu.name}</span>
                    <span className="flex items-center gap-3 text-sm">
                      {!menu.isAvailable && (
                        <span className="rounded-full bg-chili-soft px-2 py-0.5 text-xs font-semibold text-chili">Habis</span>
                      )}
                      <span className="font-bold text-pine">{formatRupiah(menu.price)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      {confirmOpen && (
        <ConfirmDialog
          title="Hapus warung ini?"
          message={`Warung "${stall.name}" akan dihapus dari database. Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Ya, hapus"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  )
}
