import { http } from './http'
import type {
  ApiResponse,
  LoginInput,
  LoginResult,
  MenuItem,
  PagedResponse,
  RegisterInput,
  Stall,
  StallInput,
  StallQuery,
  User,
} from '../types/api'

export const authApi = {
  register: (input: RegisterInput) =>
    http.post<ApiResponse<{ user: User }>>('/auth/register', input).then((r) => r.data.data.user),
  login: (input: LoginInput) =>
    http.post<ApiResponse<LoginResult>>('/auth/login', input).then((r) => r.data.data),
  me: () => http.get<ApiResponse<User>>('/auth/me').then((r) => r.data.data),
}

export const stallApi = {
  list: (params?: StallQuery) =>
    http.get<PagedResponse<Stall>>('/stalls', { params }).then((r) => r.data),
  get: (id: number) => http.get<ApiResponse<Stall>>(`/stalls/${id}`).then((r) => r.data.data),
  menus: (id: number) =>
    http.get<ApiResponse<MenuItem[]>>(`/stalls/${id}/menus`).then((r) => r.data.data),
  create: (input: StallInput) =>
    http.post<ApiResponse<Stall>>('/stalls', input).then((r) => r.data.data),
  update: (id: number, input: StallInput) =>
    http.put<ApiResponse<Stall>>(`/stalls/${id}`, input).then((r) => r.data.data),
  remove: (id: number) => http.delete<ApiResponse<Stall>>(`/stalls/${id}`).then((r) => r.data.data),
}
