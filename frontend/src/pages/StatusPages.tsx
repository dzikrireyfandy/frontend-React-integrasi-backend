import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'

export function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <EmptyState
        title="403 - Akses ditolak"
        description="Perananmu belum diizinkan membuka halaman ini."
        action={
          <Link to="/" className="btn btn-primary">
            Kembali ke daftar warung
          </Link>
        }
      />
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <EmptyState
        title="404 - Halaman tidak ada"
        description="Alamat yang kamu buka tidak dikenali."
        action={
          <Link to="/" className="btn btn-primary">
            Kembali ke daftar warung
          </Link>
        }
      />
    </div>
  )
}
