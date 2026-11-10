import { Link } from 'react-router-dom'
import { Flame, MapPin, Star } from 'lucide-react'
import type { Stall } from '../types/api'
import { categoryColor } from '../lib/format'

export default function StallCard({ stall }: { stall: Stall }) {
  const color = categoryColor(stall.category)

  return (
    <Link
      to={`/stalls/${stall.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
    >
      <div className="flex items-center justify-between gap-2 px-5 py-3" style={{ background: color.bg, color: color.fg }}>
        <span className="text-sm font-bold">{stall.category ?? 'Tanpa kategori'}</span>
        {stall.isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold">
            <Flame size={13} aria-hidden="true" />
            Populer
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-xl font-bold leading-snug group-hover:text-pine">{stall.name}</h2>

        {stall.location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={14} className="shrink-0" aria-hidden="true" />
            {stall.location}
          </p>
        )}

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {stall.description ?? 'Belum ada deskripsi.'}
        </p>

        <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-sm">
          <Star size={16} className="fill-saffron text-saffron" aria-hidden="true" />
          <span className="font-bold">{stall.avgRating.toFixed(1)}</span>
          <span className="text-muted">({stall.reviewCount} ulasan)</span>
        </div>
      </div>
    </Link>
  )
}
