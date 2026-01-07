# 📋 Hasil Pengujian Sistem - ADMIN

**Proyek:** POS Restoran  
**Role:** Admin  
**Tanggal Pengujian:** 7 Januari 2026  
**Versi:** 1.0.0

---

## 📌 Daftar Pengujian Admin

### 1. AUTHENTICATION & LOGIN

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| Login | Input: Username (ID kasir valid) + Password benar | Halaman Login ditampilkan | Login berhasil, masuk ke Dashboard Admin | ✅ Valid |
| Login | Input: Username (ID kasir valid) + Password salah | Halaman Login ditampilkan | Menampilkan pesan error "Password tidak cocok" | ✅ Valid |
| Login | Input: Username (ID kasir tidak terdaftar) + Password | Halaman Login ditampilkan | Menampilkan pesan error "User tidak ditemukan" | ✅ Valid |
| Login | Input: Username kosong + Password kosong | Halaman Login ditampilkan | Form validation error, tombol login disabled | ✅ Valid |
| Logout | Click tombol Logout di Dashboard | Admin sudah login | Kembali ke halaman Login, session dihapus | ✅ Valid |
| Session Timeout | Admin idle > 30 menit | Admin sudah login | Otomatis logout dan kembali ke halaman Login | ✅ Valid |

---

### 2. DASHBOARD

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| Dashboard Load | Admin membuka Dashboard | Halaman kosong | Menampilkan semua statistics (revenue, orders, best seller) | ✅ Valid |
| Real-time Clock | Dashboard dibuka | System menampilkan jam | Jam ter-update setiap detik | ✅ Valid |
| Revenue Widget | Dashboard dibuka | Widget kosong | Menampilkan total revenue hari ini | ✅ Valid |
| Total Orders Widget | Dashboard dibuka | Widget kosong | Menampilkan jumlah total orders hari ini | ✅ Valid |
| Best Seller Widget | Dashboard dibuka | Widget kosong | Menampilkan item best seller hari ini | ✅ Valid |
| Sales Chart | Dashboard dibuka | Chart kosong | Menampilkan grafik penjualan per jam/hari | ✅ Valid |
| Pending Orders Alert | Pending orders > 5 | Dashboard tidak ada alert | Notification urgent tampil dengan badge count | ✅ Valid |
| No Pending Alert | Pending orders ≤ 5 | Dashboard kosong | Tidak ada notification urgent | ✅ Valid |
| Greeting Message | Admin login jam pagi | Dashboard menampilkan greeting | Menampilkan "Selamat Pagi, [Name]" | ✅ Valid |
| Greeting Message | Admin login jam sore | Dashboard menampilkan greeting | Menampilkan "Selamat Sore, [Name]" | ✅ Valid |

---

### 3. MENU ITEMS MANAGEMENT

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| View Menu Items | Click Menu Items | Halaman kosong | List semua menu items dengan foto dan harga | ✅ Valid |
| Search Menu | Input nama menu di search box | List semua menu ditampilkan | Menampilkan item sesuai keyword pencarian | ✅ Valid |
| Search Menu - Empty | Input keyword tidak ada | List semua ditampilkan | Menampilkan "Tidak ada hasil" | ✅ Valid |
| Add Menu Item | Click tombol "Add Menu" | Halaman list menu | Modal form tambah menu terbuka | ✅ Valid |
| Add Menu - Valid | Input: nama, harga (valid), kategori, foto | Modal form terbuka | Menu berhasil ditambahkan, notif success muncul | ✅ Valid |
| Add Menu - Invalid | Input: nama kosong, harga negatif | Modal form terbuka | Validation error ditampilkan, menu tidak ditambahkan | ❌ Error |
| Add Menu - Duplicate | Input: nama menu sudah ada | Modal form terbuka | Menampilkan error "Menu sudah terdaftar" | ✅ Valid |
| Upload Foto Menu | Select foto dari device | Modal form terbuka | Foto di-preview sebelum upload | ✅ Valid |
| Upload Foto - Invalid | Upload file bukan gambar | Modal form terbuka | Error "File harus gambar" ditampilkan | ✅ Valid |
| Edit Menu | Click tombol edit di list | Halaman list menu | Modal edit terbuka dengan data menu | ✅ Valid |
| Edit Menu - Save | Update harga, submit form | Modal edit terbuka | Menu berhasil diupdate, notif success muncul | ✅ Valid |
| Delete Menu | Click tombol delete | Halaman list menu | Confirmation dialog muncul | ✅ Valid |
| Delete Menu - Confirm | Click "Yes" di confirmation | Dialog ditampilkan | Menu dihapus, notif success muncul | ✅ Valid |
| Delete Menu - Cancel | Click "Cancel" di confirmation | Dialog ditampilkan | Dialog tutup, menu tidak dihapus | ✅ Valid |
| Pagination | Scroll ke halaman berikutnya | List dengan > 10 item | Menampilkan item halaman berikutnya | ✅ Valid |
| Stock Warning | Stock item < 10 | List menu ditampilkan | Item dengan stok rendah di-highlight warning | ✅ Valid |
| Out of Stock Alert | Stock item = 0 | List menu ditampilkan | Item out of stock di-badge merah urgent | ✅ Valid |

---

### 4. MENU CATEGORIES MANAGEMENT

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| View Categories | Click Menu Categories | Halaman kosong | List semua kategori menu ditampilkan | ✅ Valid |
| Add Category | Click tombol "Add Category" | Halaman list kategori | Modal form tambah kategori terbuka | ✅ Valid |
| Add Category - Valid | Input: nama kategori baru | Modal form terbuka | Kategori berhasil ditambahkan, notif success | ✅ Valid |
| Add Category - Duplicate | Input: nama kategori sudah ada | Modal form terbuka | Error "Kategori sudah terdaftar" ditampilkan | ✅ Valid |
| Add Category - Empty | Input: nama kategori kosong | Modal form terbuka | Validation error ditampilkan | ✅ Valid |
| Edit Category | Click tombol edit | Halaman list kategori | Modal edit terbuka dengan data kategori | ✅ Valid |
| Edit Category - Save | Update nama kategori | Modal edit terbuka | Kategori berhasil diupdate, notif success | ✅ Valid |
| Delete Category | Click tombol delete | Halaman list kategori | Confirmation dialog muncul | ✅ Valid |
| Delete Category - Confirm | Click "Yes" di confirmation | Dialog ditampilkan | Kategori dihapus, notif success muncul | ✅ Valid |
| Delete Category - Has Items | Delete kategori yang punya menu | Dialog ditampilkan | Error "Kategori tidak bisa dihapus (masih ada menu)" | ❌ Error |

---

### 5. TABLE MANAGEMENT

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| View Tables | Click Table Management | Halaman kosong | List semua meja dengan status (Available/Busy) | ✅ Valid |
| Add Table | Click tombol "Add Table" | Halaman list meja | Modal form tambah meja terbuka | ✅ Valid |
| Add Table - Valid | Input: nomor meja, kapasitas | Modal form terbuka | Meja berhasil ditambahkan, notif success | ✅ Valid |
| Add Table - Duplicate | Input: nomor meja sudah ada | Modal form terbuka | Error "Nomor meja sudah terdaftar" | ✅ Valid |
| Add Table - Invalid | Input: nomor negatif, kapasitas 0 | Modal form terbuka | Validation error ditampilkan | ✅ Valid |
| Edit Table | Click tombol edit | Halaman list meja | Modal edit terbuka dengan data meja | ✅ Valid |
| Edit Table - Save | Update kapasitas meja | Modal edit terbuka | Meja berhasil diupdate, notif success | ✅ Valid |
| Delete Table | Click tombol delete | Halaman list meja | Confirmation dialog muncul | ✅ Valid |
| Delete Table - Active Order | Delete meja yang ada order | Dialog ditampilkan | Error "Meja tidak bisa dihapus (ada order aktif)" | ❌ Error |
| Table Status - Available | Meja tidak ada order | List meja ditampilkan | Status meja: "Available" (hijau) | ✅ Valid |
| Table Status - Busy | Meja ada order aktif | List meja ditampilkan | Status meja: "Busy" (merah) | ✅ Valid |

---

### 6. EMPLOYEES MANAGEMENT

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| View Employees | Click Employees | Halaman kosong | List semua karyawan dengan role (Kasir/Chef) | ✅ Valid |
| Add Employee | Click tombol "Add Employee" | Halaman list karyawan | Modal form tambah karyawan terbuka | ✅ Valid |
| Add Employee - Valid | Input: nama, ID, password, role | Modal form terbuka | Karyawan berhasil ditambahkan, notif success | ✅ Valid |
| Add Employee - Duplicate ID | Input: ID sudah ada | Modal form terbuka | Error "ID karyawan sudah terdaftar" | ✅ Valid |
| Add Employee - Weak Password | Input: password < 6 karakter | Modal form terbuka | Validation error "Password minimal 6 karakter" | ✅ Valid |
| Edit Employee | Click tombol edit | Halaman list karyawan | Modal edit terbuka dengan data karyawan | ✅ Valid |
| Edit Employee - Update Role | Ubah role Kasir → Chef | Modal edit terbuka | Role berhasil diupdate, notif success | ✅ Valid |
| Delete Employee | Click tombol delete | Halaman list karyawan | Confirmation dialog muncul | ✅ Valid |
| Delete Employee - Confirm | Click "Yes" di confirmation | Dialog ditampilkan | Karyawan dihapus, notif success muncul | ✅ Valid |
| Employee Status | Karyawan aktif | List ditampilkan | Status "Active" dengan badge hijau | ✅ Valid |
| Search Employee | Input nama di search box | List semua karyawan | Filter berdasarkan nama/ID | ✅ Valid |

---

### 7. REPORTS & ANALYTICS

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| View Reports | Click Reports | Halaman kosong | Dashboard reports dengan berbagai chart | ✅ Valid |
| Sales Chart | Reports page dibuka | Chart kosong | Menampilkan grafik penjualan per jam/hari/bulan | ✅ Valid |
| Top Selling Items | Reports page dibuka | Widget kosong | Menampilkan top 5 item terlaris | ✅ Valid |
| Payment Methods | Reports page dibuka | Widget kosong | Breakdown pembayaran (Cash/Credit/E-wallet) | ✅ Valid |
| Non-Cash Card | Click filter "Non-Tunai" | Report penuh ditampilkan | Hanya menampilkan transaksi non-cash | ✅ Valid |
| Revenue Growth | Check revenue trend | Chart ditampilkan | Menampilkan pertumbuhan revenue | ✅ Valid |
| Generate Report | Click "Generate Report" | Reports page dibuka | PDF report ter-download | ✅ Valid |
| Export Data | Click "Export as Excel" | Reports page dibuka | File Excel ter-download dengan data | ✅ Valid |
| Date Range Filter | Select custom date range | Reports kosong | Update reports sesuai range terpilih | ✅ Valid |
| Order Details Modal | Click order di reports | Reports ditampilkan | Modal detail order muncul dengan items | ✅ Valid |

---

### 8. SETTINGS & CONFIGURATION

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| View Settings | Click Settings | Halaman kosong | Form pengaturan sistem ditampilkan | ✅ Valid |
| Update Restoran Name | Input nama restoran baru | Settings form ditampilkan | Nama tersimpan, notif success muncul | ✅ Valid |
| Update Address | Input alamat baru | Settings form ditampilkan | Alamat tersimpan, notif success muncul | ✅ Valid |
| Update Phone | Input nomor telepon | Settings form ditampilkan | Nomor tersimpan, notif success muncul | ✅ Valid |
| Save Settings | Click "Save" button | Settings form terisi | Settings tersimpan, halaman reload | ✅ Valid |
| Reset to Default | Click "Reset to Default" | Settings sudah diubah | Confirmation dialog muncul | ✅ Valid |
| Reset - Confirm | Click "Yes" di confirmation | Dialog ditampilkan | Settings kembali default, notif success | ✅ Valid |
| Database Backup | Click "Backup Database" | Settings page dibuka | Backup file ter-download | ✅ Valid |
| Clear Cache | Click "Clear Cache" | Settings page dibuka | Cache dihapus, notif success muncul | ✅ Valid |

---

### 9. DARK MODE & UI

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| Toggle Dark Mode | Click toggle dark mode | Light mode aktif | Aplikasi berubah ke dark mode | ✅ Valid |
| Dark Mode - Persistent | Toggle dark mode, reload page | Dark mode aktif | Dark mode masih aktif setelah reload | ✅ Valid |
| Responsive Design | Buka di mobile (375px) | Desktop view | Layout responsive, menu menjadi hamburger | ✅ Valid |
| Responsive Design | Buka di tablet (768px) | Desktop view | Layout responsive, elemen ter-arrange | ✅ Valid |
| Sidebar Navigation | Click sidebar items | Sidebar aktif | Navigasi ke halaman terkait, highlight active | ✅ Valid |

---

### 10. NOTIFICATIONS SYSTEM

| Nama Menu | Aksi Aktor | Kondisi Awal System | Kondisi Akhir System | Status |
|-----------|-----------|-------------------|-------------------|--------|
| Notification Bell | Click Bell icon di header | Header ditampilkan | Dropdown notification modal terbuka | ✅ Valid |
| Notification Count Badge | Ada pending orders > 5 | Header ditampilkan | Badge count muncul di Bell icon | ✅ Valid |
| Delete Notification | Click trash icon | Notification list ditampilkan | Notifikasi dihapus dari list | ✅ Valid |
| Clear All Notifications | Click "Clear All" button | Notification list ditampilkan | Semua notifikasi dihapus | ✅ Valid |
| Click Outside Dropdown | Click area di luar dropdown | Dropdown terbuka | Dropdown otomatis tertutup | ✅ Valid |
| Action Notification | Notifikasi dengan action button | Notifikasi ditampilkan | Click action → callback executed | ✅ Valid |
| Success Notification | Operasi berhasil (Add/Edit) | Operasi dijalankan | Notifikasi hijau tampil auto-dismiss | ✅ Valid |
| Error Notification | Operasi gagal (API error) | Operasi dijalankan | Notifikasi merah tampil auto-dismiss | ✅ Valid |
| Warning Notification | Stok menipis atau alert | Condition terpenuhi | Notifikasi kuning tampil dengan pesan | ✅ Valid |

---

## 📊 Summary Pengujian Admin

| Kategori | Total Test | Valid | Error | Status |
|----------|-----------|-------|-------|--------|
| Authentication & Login | 6 | 6 | 0 | ✅ PASS |
| Dashboard | 10 | 10 | 0 | ✅ PASS |
| Menu Items Management | 14 | 13 | 1 | ⚠️ PASS* |
| Menu Categories | 9 | 8 | 1 | ⚠️ PASS* |
| Table Management | 10 | 8 | 2 | ⚠️ PASS* |
| Employees Management | 10 | 10 | 0 | ✅ PASS |
| Reports & Analytics | 9 | 9 | 0 | ✅ PASS |
| Settings & Configuration | 9 | 9 | 0 | ✅ PASS |
| Dark Mode & UI | 5 | 5 | 0 | ✅ PASS |
| Notifications System | 8 | 8 | 0 | ✅ PASS |
| **TOTAL** | **90** | **86** | **4** | **⚠️ 95.6%** |

\* Error handling perlu perbaikan untuk edge cases

---

## 🔧 Issues Found

### Issue #1: Menu Add Validation (ERROR)
- **Ditemukan pada:** Add Menu - Invalid case
- **Deskripsi:** Validation untuk harga negatif belum berfungsi
- **Solusi:** Tambahkan min="0" pada input harga
- **Priority:** Medium

### Issue #2: Delete Kategori dengan Items (ERROR)
- **Ditemukan pada:** Delete Category - Has Items case
- **Deskripsi:** Sistem memungkinkan delete kategori yang masih punya menu items
- **Solusi:** Tambahkan backend validation sebelum delete
- **Priority:** High

### Issue #3: Delete Meja dengan Order Aktif (ERROR)
- **Ditemukan pada:** Delete Table - Active Order case
- **Deskripsi:** Sistem tidak cek apakah meja masih ada order aktif
- **Solusi:** Tambahkan validation di backend
- **Priority:** High

---

## ✅ Rekomendasi

1. **Prioritas High:** Fix delete meja dan kategori dengan validasi backend
2. **Prioritas Medium:** Tambahkan client-side validation untuk input numerik
3. **Prioritas Low:** Test lebih lanjut dengan multiple browser

---

**Tester:** QA Team  
**Tanggal:** 7 Januari 2026  
**Approved By:** Senior Developer
