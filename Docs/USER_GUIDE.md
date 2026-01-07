# USER GUIDE - POS Restoran

Panduan lengkap untuk menggunakan sistem POS Restoran baik untuk Admin maupun Kasir.

---

## 📑 Daftar Isi

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Login](#login)
3. [Panel Admin](#panel-admin)
4. [Panel Kasir](#panel-kasir)
5. [Tips & Trik](#tips--trik)
6. [Troubleshooting](#troubleshooting)

---

## Pengenalan Sistem

### Apa itu POS Restoran?
POS Restoran adalah aplikasi manajemen pesanan berbasis web yang dirancang untuk memudahkan operasional restoran modern. Sistem ini terbagi menjadi dua panel utama:

- **Panel Admin**: Untuk pengelolaan menu, kategori, karyawan, meja, laporan, dan pengaturan
- **Panel Kasir**: Untuk pembuatan pesanan, pengolahan pembayaran, dan manajemen shift

### Browser yang Didukung
- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

---

## Login

### Akses Sistem
1. Buka aplikasi di browser: `http://localhost:3000` (atau URL yang sudah dikonfigurasi)
2. Anda akan diarahkan ke halaman login

### Tipe Akun
| Role | Akses | Tujuan |
|------|-------|--------|
| **Admin** | Dashboard, Menu, Kategori, Laporan, Pengaturan, Karyawan, Meja | Pengelolaan sistem |
| **Kasir** | Pesanan, Riwayat, Shift, Dapur | Operasional penjualan |

### Proses Login
1. Masukkan **Username** atau **Email**
2. Masukkan **Password**
3. Klik **"LOGIN"**
4. Sistem akan redirect ke dashboard sesuai role

### Logout
- Klik nama/avatar user di kanan atas
- Pilih **"Logout"**
- Anda akan dikembalikan ke halaman login

---

## Panel Admin

### Dashboard Admin
Halaman pertama saat masuk ke panel admin. Menampilkan:
- Ringkasan statistik penjualan hari ini
- Total pesanan, revenue, dan item terjual
- Grafik penjualan realtime

### 1️⃣ Menu Management

#### Lihat Daftar Menu
1. Klik menu **"Menu Items"** di sidebar
2. Sistem menampilkan tabel semua menu dengan:
   - Foto menu
   - Nama menu
   - Kategori
   - Harga
   - Stok
   - Status (Aktif/Tidak Aktif)
   - Aksi (Edit, Hapus)

#### Tambah Menu Baru
1. Klik tombol **"+ Tambah Menu"** (warna biru)
2. Isi form yang muncul:
   - **Nama Menu**: Nama menu (wajib)
   - **Deskripsi**: Penjelasan singkat
   - **Kategori**: Pilih kategori dari dropdown
   - **Harga**: Harga menu (wajib)
   - **Stok**: Jumlah stok (opsional)
   - **Foto**: Upload gambar menu
3. Klik **"Simpan"** untuk menambah atau **"Batal"** untuk membatalkan

#### Edit Menu
1. Klik tombol **"Edit"** (✏️) pada baris menu yang ingin diubah
2. Form akan terbuka dengan data menu saat ini
3. Ubah data yang diperlukan
4. Klik **"Simpan Perubahan"** atau **"Batal"**

#### Hapus Menu
1. Klik tombol **"Hapus"** (🗑️) pada baris menu
2. Konfirmasi penghapusan di dialog yang muncul
3. Menu akan dihapus dari sistem

### 2️⃣ Kategori Menu

#### Lihat Daftar Kategori
1. Klik **"Menu Categories"** di sidebar
2. Tabel menampilkan semua kategori dengan kolom:
   - Nama kategori
   - Jumlah menu dalam kategori
   - Aksi (Edit, Hapus)

#### Tambah Kategori
1. Klik **"+ Tambah Kategori"**
2. Masukkan **nama kategori** di dialog
3. Klik **"Simpan"**

#### Edit Kategori
1. Klik **"Edit"** pada kategori yang ingin diubah
2. Ubah nama kategori
3. Klik **"Simpan Perubahan"**

#### Hapus Kategori
1. Klik **"Hapus"** pada kategori
2. Konfirmasi penghapusan
3. Kategori akan dihapus (jika tidak ada menu di dalamnya)

### 3️⃣ Manajemen Meja

#### Lihat Layout Meja
1. Klik **"Table Management"** di sidebar
2. Grid menampilkan semua meja dengan:
   - Nomor meja
   - Status (Kosong/Terisi/Reservasi)
   - Jumlah kursi

#### Tambah Meja
1. Klik **"+ Tambah Meja"**
2. Isi form:
   - **Nomor Meja**: ID unik meja
   - **Kapasitas**: Jumlah kursi
   - **Lokasi**: Area/zona meja (opsional)
3. Klik **"Simpan"**

#### Edit Status Meja
1. Klik meja di grid
2. Ubah status dari dropdown:
   - **Kosong**: Meja tersedia
   - **Terisi**: Meja sedang digunakan
   - **Reservasi**: Meja sudah direservasi
3. Klik **"Simpan"**

### 4️⃣ Laporan & Analitik

#### Dashboard Laporan
1. Klik **"Reports"** di sidebar
2. Tab **"Sales"** menampilkan:
   - Grafik penjualan (daily/weekly/monthly)
   - Total revenue
   - Item terlaris
   - Tren penjualan

#### Lihat Detail Pesanan
1. Di tab **"Orders"**, klik pesanan untuk melihat detail:
   - Nomor pesanan
   - Tanggal & waktu
   - Total item
   - Total harga
   - Status pembayaran
   - Daftar item pesanan

#### Filter Laporan
1. Gunakan dropdown **"Period"** untuk filter:
   - Today (Hari ini)
   - This Week (Minggu ini)
   - This Month (Bulan ini)
   - Custom (Pilih tanggal custom)
2. Sistem akan otomatis update grafik & statistik

### 5️⃣ Karyawan

#### Lihat Daftar Karyawan
1. Klik **"Employees"** di sidebar
2. Tabel menampilkan semua karyawan dengan:
   - Nama lengkap
   - Username
   - Email
   - Role (Admin/Kasir)
   - Status

#### Tambah Karyawan
1. Klik **"+ Tambah Karyawan"**
2. Isi form registrasi:
   - **Nama Lengkap**
   - **Email**
   - **Username** (unik)
   - **Password** (minimal 6 karakter)
   - **Confirm Password**
   - **Role** (Admin/Kasir)
3. Klik **"Daftar"**

#### Edit Karyawan
1. Klik **"Edit"** pada karyawan
2. Ubah data yang diperlukan
3. Klik **"Simpan Perubahan"**

#### Hapus Karyawan
1. Klik **"Hapus"** pada karyawan
2. Konfirmasi penghapusan
3. Akun karyawan akan dihapus

### 6️⃣ Pengaturan Sistem

#### Tema & Tampilan
1. Klik **"Settings"** di sidebar
2. Toggle **"Dark Mode"** untuk beralih tema:
   - Light (Putih)
   - Dark (Gelap)
3. Preferensi disimpan otomatis di browser

#### Pengaturan Restoran
- **Nama Restoran**: Edit nama bisnis
- **Alamat**: Lokasi restoran
- **Nomor Telepon**: Kontak customer service
- **Email**: Email bisnis
- **Jam Operasional**: Set jam buka/tutup

#### Tax & Service
- **Pajak (%)**: Persentase pajak yang diterapkan
- **Service Charge (%)**: Biaya layanan
- **Currency**: Mata uang (IDR)

Setiap perubahan akan tersimpan otomatis.

---

## Panel Kasir

### Dashboard Kasir
Halaman utama kasir yang menampilkan:
- Status koneksi (Online/Offline)
- Jumlah pesanan pending
- Quick stats: Total pesanan hari ini, Revenue

### 1️⃣ Pembuatan Pesanan

#### Mulai Pesanan Baru
1. Klik tab **"Order"** (atau menu di sidebar)
2. Pilih **nomor meja** dari grid layout meja:
   - Grid menampilkan semua meja
   - Klik meja yang ingin digunakan
3. Sistem membuka halaman order untuk meja tersebut

#### Tambah Item ke Pesanan
1. **Browse kategori** di sebelah kiri:
   - Klik kategori untuk filter menu
   - Semua kategori dipilih secara default
2. **Pilih menu** dari grid:
   - Klik menu yang ingin dipesan
   - Dialog modal akan muncul
3. **Tentukan jumlah**:
   - Input jumlah item di spinner (+ / -)
   - Lihat harga total akan update otomatis
4. **Tambah catatan** (opsional):
   - Masukkan catatan khusus (misal: "Extra pedas", "Tanpa bawang")
5. Klik **"Tambah ke Keranjang"**

#### Kelola Keranjang

**Sidebar Keranjang** di sebelah kanan menampilkan:
- Daftar item yang sudah dipesan
- Jumlah item
- Harga satuan & subtotal
- Aksi (Edit/Hapus)

**Edit Item**:
1. Klik **tombol edit** (✏️) pada item
2. Ubah jumlah atau catatan
3. Klik **"Update"**

**Hapus Item**:
1. Klik **tombol hapus** (🗑️) pada item
2. Item akan hilang dari keranjang

#### Proses Pembayaran

1. **Review Pesanan**:
   - Cek daftar item di keranjang
   - Pastikan semua benar

2. **Lihat Total**:
   - Subtotal (sebelum pajak)
   - Pajak (jika diaktifkan)
   - Service Charge (jika diaktifkan)
   - **Total Akhir** (warna besar)

3. **Pilih Metode Pembayaran**:
   - **Tunai**: Pembayaran langsung (bayar di tempat)
   - **Kartu**: Pembayaran dengan kartu debit/kredit
   - **QRIS**: Scan QR code pembayaran digital
   - **Cicilan**: Pembayaran bertahap (jika diterima)

4. **Input Pembayaran**:
   - Masukkan nominal yang dibayarkan
   - Sistem auto-calculate kembalian
   - Pastikan saldo cukup

5. **Selesaikan Pesanan**:
   - Klik **"Selesaikan & Cetak Struk"**
   - Pesanan akan tersimpan
   - Struk akan dicetak otomatis
   - Meja akan di-reset untuk pesanan berikutnya

### 2️⃣ Manajemen Shift

#### Mulai Shift
1. Klik tab **"Shift"** di sidebar
2. Klik **"Mulai Shift Baru"**
3. Isi form:
   - **Waktu Mulai**: Auto-fill waktu sekarang
   - **Catatan Awal** (opsional)
4. Klik **"Mulai Shift"**

#### Lihat Shift Aktif
- Tabel menampilkan shift yang sedang berjalan
- Durasi kerja hingga sekarang
- Total pesanan dalam shift ini
- Total revenue shift

#### Akhiri Shift
1. Pada shift yang aktif, klik **"Akhiri Shift"**
2. Konfirmasi dialog muncul
3. Isi **catatan akhir** (opsional)
4. Klik **"Akhiri"**

#### Riwayat Shift
- Menampilkan semua shift yang sudah selesai
- Detail: Durasi, total pesanan, revenue
- Filter berdasarkan tanggal

### 3️⃣ Dapur / Kitchen Display System

#### Monitor Pesanan
1. Klik tab **"Dapur"** di sidebar
2. Sistem menampilkan:
   - **Pesanan Baru** (unread): Pesanan baru yang belum dibaca
   - **Sedang Diproses**: Pesanan yang sedang dimasak
   - **Siap Disajikan**: Pesanan yang sudah ready
   - **Selesai**: Pesanan yang sudah diantar

#### Update Status Pesanan
1. Klik pesanan dari kartu
2. Review daftar item dalam pesanan
3. Klik **"Mulai Proses"** → ubah ke "Sedang Diproses"
4. Saat siap, klik **"Siap Disajikan"**
5. Waiter/kasir akan lihat pesanan siap di list mereka

### 4️⃣ Riwayat Pesanan

#### Lihat Riwayat
1. Klik tab **"Riwayat"** di sidebar
2. Tabel menampilkan semua pesanan:
   - Nomor pesanan
   - Meja
   - Total item
   - Total harga
   - Waktu pesanan
   - Status

#### Cari Pesanan
1. Gunakan **search box** di atas tabel
2. Cari berdasarkan:
   - Nomor pesanan
   - Nomor meja

#### Lihat Detail Pesanan
1. Klik tombol **"mata"** (👁️) untuk preview detail
2. Modal menampilkan:
   - Daftar item lengkap
   - Catatan spesial
   - Total pembayaran
   - Waktu order

#### Print Ulang Struk
1. Klik tombol **"printer"** (🖨️)
2. Struk akan dicetak ulang ke printer

#### Filter Pesanan
1. Gunakan filter di atas tabel:
   - **Status**: All, Completed, Cancelled, Pending
   - **Tanggal**: Filter berdasarkan rentang tanggal

---

## Tips & Trik

### ⚡ Shortcut Keyboard
| Shortcut | Fungsi |
|----------|--------|
| `Tab` | Navigasi antar field di form |
| `Enter` | Submit form / Confirm dialog |
| `Esc` | Close modal / Cancel |

### 💡 Efisiensi
1. **Gunakan Kategori**: Organisir menu per kategori membuat pencarian lebih cepat
2. **Stok Management**: Update stok menu secara berkala untuk menghindari oversell
3. **Notes/Catatan**: Selalu tambahkan catatan spesial pesanan (alergi, preferensi)
4. **Offline Mode**: Kasir bisa tetap membuat pesanan meski internet mati, dan sync otomatis saat online kembali

### 🌙 Dark Mode
- Cocok digunakan di area dengan pencahayaan rendah
- Hemat baterai (untuk device yang mendukung)
- Toggle bisa diakses di header kanan atas

### 📱 Responsive Design
- Aplikasi responsive untuk desktop, tablet, mobile
- Hamburger menu otomatis muncul di layar kecil
- Layout adaptif untuk berbagai ukuran layar

---

## Troubleshooting

### ❌ Tidak Bisa Login
**Problem**: Login gagal, error message muncul

**Solusi**:
1. Pastikan **username/email** benar
2. Cek **password** (case-sensitive)
3. Pastikan akun sudah terdaftar di sistem
4. Cek koneksi internet
5. Clear browser cache: `Ctrl + Shift + Delete`
6. Hubungi admin jika masalah berlanjut

### ❌ Halaman Tidak Muncul
**Problem**: Blank page, loading forever

**Solusi**:
1. Refresh halaman: `Ctrl + R` atau `F5`
2. Clear cache: `Ctrl + Shift + Delete`
3. Cek koneksi internet
4. Coba browser lain
5. Restart aplikasi

### ❌ Foto Menu Tidak Upload
**Problem**: Upload foto gagal

**Solusi**:
1. Pastikan ukuran file < 5MB
2. Format yang didukung: JPG, PNG, WebP
3. Cek koneksi internet
4. Coba upload ke lokasi berbeda
5. Refresh halaman dan coba lagi

### ❌ Pesanan Tidak Muncul di Dapur
**Problem**: Kitchen display tidak menampilkan pesanan baru

**Solusi**:
1. Refresh halaman dapur: `Ctrl + R`
2. Pastikan kasir sudah selesaikan order (jangan pending)
3. Cek koneksi internet semua device
4. Logout dan login kembali di kitchen display

### ⚠️ Mode Offline
Kasir bisa bekerja tanpa internet! Fitur:
- Pesanan disimpan di **localStorage** browser
- Indikator **Offline** akan muncul di header
- Tombol **Sync** akan aktif saat data pending
- Saat online kembali, klik **Sync** untuk upload ke server

### ❌ Data Tidak Tersimpan
**Problem**: Data hilang setelah refresh

**Solusi**:
1. Pastikan Anda mengklik **"Simpan"** / **"Selesaikan"**
2. Tunggu toast notification sukses muncul
3. Check internet connection
4. Jika offline, data di-cache di browser
5. Sync saat online kembali

---

## Support & Bantuan

Jika mengalami masalah:
1. **Chat Support**: Hubungi team support via chat
2. **Email**: support@posrestoran.com
3. **WhatsApp**: [Nomor WhatsApp]
4. **FAQ**: Lihat halaman FAQ di menu Settings

---

**Versi Dokumentasi**: 1.0  
**Last Updated**: Januari 2026  
**Compatible Version**: POS Restoran v2.0+
