import type { Stall, User } from '../types/api'

// Aturan ini hanya untuk menyesuaikan tampilan. Keputusan akhir tetap di backend (403).
export const can = {
  create: (user: User | null) => user?.role === 'admin' || user?.role === 'owner',
  edit: (user: User | null, stall: Stall) =>
    user?.role === 'admin' || (user?.role === 'owner' && stall.ownerId === user.id),
  remove: (user: User | null) => user?.role === 'admin',
}
