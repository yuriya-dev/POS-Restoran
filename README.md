# Sistem POS Restoran

Sistem Point of Sale (POS) Restoran dengan arsitektur monorepo yang terdiri dari:
- Backend API (Express + MySQL)
- Frontend Admin (React + Vite + Tailwind)
- Frontend Kasir (React + Vite + Tailwind)

## Prasyarat

- Node.js (versi 16.x atau lebih baru)
- npm (sudah terinstall dengan Node.js)
- MySQL (untuk database)

## Struktur Proyek

```
pos_restoran/
├── server/               # Backend API
│   ├── controllers/      # Controller logika bisnis
│   ├── routes/          # Definisi routes
│   ├── middleware/      # Middleware (auth, validation, dll)
│   ├── config/          # Konfigurasi database dll
│   └── server.js        # Entry point
├── client_admin/        # Frontend Admin
│   ├── src/
│   │   ├── pages/      # Halaman-halaman
│   │   ├── components/ # Komponen React
│   │   └── services/   # Service API calls
│   └── ...
└── client_kasir/        # Frontend Kasir
    ├── src/
    │   ├── pages/      # Halaman-halaman
    │   ├── components/ # Komponen React
    │   └── services/   # Service API calls
    └── ...
```

## Instalasi

1. Clone repository ini
2. Install dependencies untuk setiap proyek:

```bash
# Install dependencies backend
cd server
npm install

# Install dependencies admin
cd ../client_admin
npm install

# Install dependencies kasir
cd ../client_kasir
npm install
```

## Menjalankan Aplikasi

Anda bisa menjalankan aplikasi dengan dua cara:

### 1. Menggunakan Script Helper

Gunakan script `run-all.sh` yang disediakan:

```bash
# Beri izin eksekusi
chmod +x run-all.sh

# Jalankan semua service
./run-all.sh
```

### 2. Manual (Di Terminal Terpisah)

Backend API:
```bash
cd server
npm run dev
# Server berjalan di http://localhost:3000
```

Frontend Admin:
```bash
cd client_admin
npm run dev
# Admin berjalan di http://localhost:5173
```

Frontend Kasir:
```bash
cd client_kasir
npm run dev -- --port 5174
# Kasir berjalan di http://localhost:5174
```

## URL Aplikasi

- Backend API: http://localhost:3000
  - Health check: http://localhost:3000/
  - API test: http://localhost:3000/api/ping
- Frontend Admin: http://localhost:5173
- Frontend Kasir: http://localhost:5174

## Teknologi yang Digunakan

Backend:
- Express.js
- MySQL2
- CORS
- Nodemon (development)

Frontend Admin:
- React (Vite)
- Axios
- React Router DOM
- Recharts (untuk grafik)
- Tailwind CSS

Frontend Kasir:
- React (Vite)
- Axios
- React Router DOM
- React Icons
- Tailwind CSS

## Development

Setiap bagian aplikasi memiliki hot-reload untuk development yang lebih cepat:
- Server menggunakan `nodemon`
- Frontend menggunakan Vite dev server dengan HMR (Hot Module Replacement)

## Scripts yang Tersedia

Backend:
- `npm run dev`: Menjalankan server dengan nodemon
- `npm start`: Menjalankan server untuk production

Frontend (Admin & Kasir):
- `npm run dev`: Menjalankan dev server
- `npm run build`: Build untuk production
- `npm run preview`: Preview build production

## Lisensi

MIT