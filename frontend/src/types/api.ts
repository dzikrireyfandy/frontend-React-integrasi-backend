export type UserRole = 'admin' | 'owner' | 'customer'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface Stall {
  id: number
  ownerId: number
  name: string
  category: string | null
  location: string | null
  description: string | null
  avgRating: number
  reviewCount: number
  isPopular: boolean
}

export interface MenuItem {
  id: number
  stallId: number
  name: string
  price: number | string
  isAvailable: boolean
}

export interface StallInput {
  name: string
  category: string | null
  location: string | null
  description: string | null
}

export interface StallQuery {
  search?: string
  category?: string
  page?: number
  limit?: number
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginResult {
  token: string
  tokenType: 'Bearer'
  expiresIn: string
  user: User
}

export interface ApiResponse<T> {
  status: 'success'
  data: T
}

export interface PagedResponse<T> {
  status: 'success'
  meta: { page: number; limit: number; total: number }
  data: T[]
}

export interface FieldIssue {
  field: string
  message: string
}

export interface ApiErrorBody {
  status: 'fail' | 'error'
  message: string
  errors?: FieldIssue[]
}
