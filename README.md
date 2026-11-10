# Frontend React & Integrasi Backend

Aplikasi review warung kantin kampus. Frontend React berkomunikasi dengan backend Express.js (Tugas 2 dan 3) lewat **Axios**.
Fitur: daftar & detail warung, CRUD warung berdasarkan role, registrasi, login (JWT), informasi pengguna, serta state loading, kosong, dan error.


## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, lucide-react |
| Komunikasi HTTP | **Axios** (satu instance bersama, request + response interceptor) |
| Backend | Node.js, Express 5, TypeScript (tsx), Drizzle ORM, Zod, JWT, bcryptjs, Swagger UI |
| Database | Microsoft SQL Server |

## Struktur

```
.
├─ backend/    # API Express (Tugas 2 + 3), SQL ada di backend/sql
└─ frontend/   # React + Vite
   └─ src/
      ├─ lib/         # http.ts (Axios + interceptor), api.ts (endpoint), errors.ts, permissions.ts
      ├─ context/     # AuthContext (sesi JWT), ToastContext
      ├─ components/  # Header, StallCard, StallForm, ProtectedRoute, ConfirmDialog, ui
      └─ pages/       # daftar, detail, form tambah/ubah, login, register, profil, 403/404
```

## Prasyarat

- Node.js 22.18 atau lebih baru
- SQL Server aktif dengan database `review_kantin` (jalankan skrip di `backend/sql` berurutan: `00` sampai `03`)
- Port 3000 (backend) dan 5173 (frontend) kosong

## Instalasi dan menjalankan

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # lalu isi DB_USER, DB_PASSWORD, JWT_SECRET, dst.
npm run dev
```

Backend berjalan di `http://localhost:3000`, dokumentasi Swagger di `http://localhost:3000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:3000
npm run dev
```

Buka `http://localhost:5173`.

## Konfigurasi environment

**backend/.env** 

| Variabel | Keterangan |
| --- | --- |
| `PORT` | Port server (default 3000) |
| `CORS_ORIGIN` | Origin frontend yang diizinkan, default `http://localhost:5173` 
| `DB_SERVER`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Koneksi SQL Server |
| `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE` | Opsi koneksi SQL Server |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Rahasia dan masa berlaku token |
| `BCRYPT_SALT_ROUNDS` | Jumlah salt round bcrypt |

**frontend/.env**

| Variabel | Keterangan |
| --- | --- |
| `VITE_API_BASE_URL` | Alamat backend tanpa `/` di akhir, default `http://localhost:3000` |

## Akun uji (seed)

Semua akun seed memakai password yang sama dengan yang dipakai saat menyiapkan `03-seed.sql` pada Tugas 3.

| Role | Email |
| --- | --- |
| Admin | `admin@kantin.test` |
| Owner | `budi.owner@kantin.test` (pemilik warung 1, 2, 5, 9), `siti.owner@kantin.test`, `joko.owner@kantin.test` |
| Customer | `andi@kantin.test`, `rani@kantin.test` |

Registrasi lewat aplikasi selalu membuat akun berperan **customer**.

## Endpoint yang dipakai frontend

| Fitur | Endpoint |
| --- | --- |
| Daftar warung (search, filter, pagination) | `GET /stalls?search=&category=&page=&limit=` |
| Detail warung | `GET /stalls/:id` dan `GET /stalls/:id/menus` |
| Tambah warung | `POST /stalls` (owner, admin) |
| Ubah warung | `PUT /stalls/:id` (admin, atau owner pemilik warung) |
| Hapus warung | `DELETE /stalls/:id` (admin) |
| Registrasi | `POST /auth/register` |
| Login | `POST /auth/login` (mengembalikan JWT di body) |
| Info pengguna | `GET /auth/me` |
| Logout | Tidak ada endpoint; token Bearer dihapus dari client |

## Cara kerja autentikasi dan role

- Login mengembalikan JWT. Token disimpan di `localStorage`, lalu dipasang otomatis sebagai header `Authorization: Bearer <token>` oleh request interceptor Axios.
- Saat aplikasi dibuka, token yang tersimpan divalidasi lewat `GET /auth/me` untuk memulihkan sesi.
- Response interceptor menangkap **401** pada endpoint selain login/register: token dihapus dan pengguna diarahkan ke halaman login dengan pesan sesi berakhir.
- Respons **403** dari backend ditampilkan sebagai pesan "Akses ditolak" di form atau notifikasi.
- Tampilan mengikuti role (aturan di `frontend/src/lib/permissions.ts`), tetapi keputusan akhir selalu di backend:
  - Public: lihat daftar dan detail, registrasi, login
  - Customer: sama seperti Public, tanpa tombol pengelolaan
  - Owner: tambah warung; tombol Ubah hanya pada warung miliknya
  - Admin: tambah, ubah, dan hapus semua warung
- Rute `/stalls/new` dan `/stalls/:id/edit` hanya untuk admin dan owner. Pengguna belum login diarahkan ke `/login`, customer diarahkan ke `/forbidden`.

## Perubahan pada backend 
- Menambah middleware CORS di `backend/src/index.ts` (dibaca dari `CORS_ORIGIN`) agar browser boleh memanggil API dari `localhost:5173`.
- Merapikan import tipe di `stallService.ts` supaya `tsc --noEmit` bersih untuk jalur yang dipakai.

## Skenario pengujian manual

1. Daftar warung tampil dari `GET /stalls`, termasuk pencarian, filter kategori, dan pagination.
2. Detail warung tampil dari `GET /stalls/:id`; ID yang tidak ada menampilkan pesan tidak ditemukan.
3. Admin: tambah, ubah, dan hapus warung berhasil.
4. Owner: membuat warung dan mengubah warung miliknya.
5. Owner mengubah warung owner lain: backend menolak dengan 403, pesan tampil di form.
6. Owner menghapus warung: ditolak 403 (hanya admin). Tombol Hapus disembunyikan di UI; buktikan lewat Swagger `/docs`.
7. Registrasi dan login berhasil.
8. `GET /auth/me` tampil di halaman Profil.
9. Pengguna belum login yang membuka halaman terlindungi diarahkan ke login.
10. 401 dan 403 ditangani sesuai kondisi.
11. Loading, empty state, dan error state (matikan backend lalu muat ulang).
12. Setelah tambah, ubah, atau hapus, cek tabel `STALLS` di SQL Server untuk memastikan perubahan tersimpan di database.
