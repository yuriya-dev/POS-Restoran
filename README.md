# 🍽️ Sistem POS Restoran (Fullstack)

Aplikasi Point of Sale (POS) berbasis web modern yang dirancang untuk manajemen restoran yang efisien. Sistem ini terintegrasi penuh mulai dari manajemen menu, inventaris, hingga laporan keuangan real-time.

Solusi ini terdiri dari tiga modul utama yang saling terhubung:

* **API Server (server)**: Backend RESTful yang menangani logika bisnis dan database.
* **Dashboard Admin (client_admin)**: Pusat kontrol untuk manajer/pemilik restoran.
* **Antarmuka Kasir (client_kasir)**: Aplikasi frontend khusus untuk operasional harian staf.

---

## 🌟 Fitur Utama

### 👨‍💼 Admin Dashboard (client_admin)

* Dashboard Analitik Real-time: Grafik penjualan harian, ringkasan omzet, dan statistik item terlaris.
* Manajemen Menu Lengkap: Tambah, edit, hapus, dan non-aktifkan menu makanan/minuman. Dukungan upload gambar.
* Kategori Menu: Pengelompokan menu dinamis dengan ikon kustom.
* Manajemen Meja (Table Map): Pengaturan layout meja (Dine-in) dan titik layanan (Takeaway/Delivery).
* Manajemen Karyawan (RBAC): Kelola akun Admin dan Kasir dengan kontrol akses berbasis peran.
* Laporan Transaksi: Filter riwayat transaksi berdasarkan tanggal, status (Lunas/Pending/Batal), dan metode pembayaran.
* Pengaturan Restoran: Konfigurasi pajak, biaya layanan (service charge), info struk, dan logo restoran.

### 🏪 Kasir Interface (client_kasir)

* Login Cepat: Akses khusus yang disederhanakan untuk staf kasir.
* Denah Meja Visual: Indikator status meja (Hijau: Kosong, Merah: Terisi).
* Pencatatan Pesanan Cepat: Keranjang belanja responsif dengan kalkulasi otomatis.
* Multi-Metode Pembayaran: Dukungan pembayaran Tunai, QRIS, dan Debit.

### 🚀 Backend Server (server)

* RESTful API: Dibangun dengan Node.js & Express.
* Database PostgreSQL: Menggunakan Supabase.
* Keamanan: Autentikasi kustom dengan password hashing (Bcrypt).
* Image Hosting: Integrasi Cloudinary untuk penyimpanan aset gambar.

---

## 📂 Struktur Proyek

```
root/
├── client_admin/    # Frontend: Dashboard Admin (React + Vite + Tailwind)
├── client_kasir/    # Frontend: Antarmuka Kasir (React + Vite + Tailwind)
└── server/          # Backend: REST API (Node.js + Express)
```

---

## 🛠️ Panduan Instalasi & Menjalankan

### **1. Persiapan Database (Supabase)**

Untuk menggunakan database PostgreSQL di Supabase, ikuti langkah berikut:

#### **Langkah 1 — Buat Project Supabase**

1. Masuk ke [https://supabase.com](https://supabase.com)
2. Login menggunakan akun GitHub atau email
3. Klik **New Project**
4. Isi detail project:

   * **Project Name**: pos-restoran
   * **Database Password**: buat password yang aman
   * **Region**: pilih terdekat (misal: Southeast Asia)
5. Klik **Create Project**

#### **Langkah 2 — Ambil Credensial API**

1. Buka menu **Project Settings** → **API**
2. Salin:

   * **Project URL** → ini adalah `SUPABASE_URL`
   * **service_role key** → ini adalah `SUPABASE_SERVICE_ROLE_KEY` (⚠️ sangat sensitif)

Contoh format:

```
SUPABASE_URL=https://abcdxyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh... (panjang)
```

#### **Langkah 3 — Membuat Tabel Database**

Anda dapat membuat tabel melalui:

* Menu **Table Editor** → **New Table**
* Atau import file SQL project Anda

---

### **2. Konfigurasi Backend (server)**

```
cd server
npm install
```

Buat file `.env`:

```
PORT=5001
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...

CLOUDINARY_CLOUD_NAME=nama_cloud_anda
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

Jalankan server:

```
npm run dev
```

---

### **3. Konfigurasi Client Admin (client_admin)**

```
cd client_admin
npm install
```

Buat file `.env`:

```
VITE_API_URL=http://localhost:5001/api
VITE_CLOUDINARY_CLOUD_NAME=nama_cloud_anda
VITE_CLOUDINARY_UPLOAD_PRESET=pos_preset_unsigned
```

Jalankan:

```
npm run dev
```

Akses: [http://localhost:5173](http://localhost:5173)

---

### **4. Konfigurasi Client Kasir (client_kasir)**

```
cd client_kasir
npm install
```

Buat file `.env`:

```
VITE_API_URL=http://localhost:5001/api
```

Jalankan:

```
npm run dev
```

Akses: [http://localhost:5174](http://localhost:5174)

---

## 🔑 Akun Demo Default

| Role  | Username | Password | Akses                     |
| ----- | -------- | -------- | ------------------------- |
| Admin | admin    | admin123 | Full Akses (client_admin) |
| Kasir | kasir01  | kasir123 | POS Only (client_kasir)   |

---

## 📚 Dokumentasi API Singkat

**Base URL:** [http://localhost:5001/api](http://localhost:5001/api)

### Authentication

* POST /auth/login — Login user
* POST /auth/register — Register (Admin only)

### Menu & Inventory

* GET /menu-items
* POST /menu-items
* PUT /menu-items/:id
* DELETE /menu-items/:id

### Transactions

* GET /orders
* POST /orders

### Reports

* GET /reports/top-selling

### Management

* GET /users
* GET /tables

---

## 🧩 Arsitektur & Monorepo

Sistem POS ini menggunakan **arsitektur monorepo** yang terdiri dari 3 aplikasi utama:

* **Backend API (server)** — Express + Supabase PostgreSQL
* **Frontend Admin (client_admin)** — React + Vite + Tailwind
* **Frontend Kasir (client_kasir)** — React + Vite + Tailwind

### Prasyarat

* Node.js v16+
* npm
* Akun Supabase (PostgreSQL)

### Struktur Monorepo

```
pos_restoran/
├── server/               # Backend API
│   ├── controllers/      # Controller logika bisnis
│   ├── routes/           # Definisi routes
│   ├── middleware/       # Middleware (auth, validation, dll)
│   ├── config/           # Konfigurasi database
│   └── server.js         # Entry point
├── client_admin/         # Frontend Admin
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
└── client_kasir/         # Frontend Kasir
    └── src/
        ├── pages/
        ├── components/
        └── services/
```

## 🚀 Instalasi Proyek

1. Clone repository
2. Install dependencies

```
cd server && npm install
cd ../client_admin && npm install
cd ../client_kasir && npm install
```

## ▶️ Menjalankan Aplikasi

### **1. Menggunakan Script Helper**

```
chmod +x run-all.sh
./run-all.sh
```

### **2. Menjalankan Manual (Terminal Terpisah)**

Backend:

```
cd server
npm run dev
# http://localhost:5001
```

Frontend Admin:

```
cd client_admin
npm run dev
# http://localhost:5173
```

Frontend Kasir:

```
cd client_kasir
npm run dev -- --port 5174
# http://localhost:5174
```

## 🔗 URL Aplikasi

* Backend: [http://localhost:5001](http://localhost:5001)
* Admin Dashboard: [http://localhost:5173](http://localhost:5173)
* Kasir Interface: [http://localhost:5174](http://localhost:5174)

## 🛠 Teknologi Utama

### Backend

* Express.js
* Supabase PostgreSQL
* CORS
* Nodemon

### Frontend Admin

* React (Vite)
* Axios
* React Router DOM
* Recharts
* Tailwind CSS

### Frontend Kasir

* React (Vite)
* Axios
* React Router DOM
* React Icons
* Tailwind CSS

## 🧪 Scripts

Backend:

* `npm run dev`
* `npm start`

Frontend:

* `npm run dev`
* `npm run build`
* `npm run preview`

## 📄 Lisensi

MIT

## 🤝 Kontribusi & Pengembangan

Proyek ini dikembangkan sebagai bagian dari tugas implementasi sistem informasi restoran (RPL).

**Pengembang Utama:** Wahyu Tri Cahya (NIM: 240202889)

Dibuat dengan ❤️ menggunakan React, Node.js, & Supabase
