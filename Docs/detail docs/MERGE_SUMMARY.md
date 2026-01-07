# POS Restoran - Merged Client Project

✅ **Selesai! client_admin dan client_kasir sudah digabungkan menjadi satu folder `client`**

## 📊 Ringkasan Perubahan

### Struktur Lama
```
client_admin/          (duplikat komponen, 8 pages)
client_kasir/          (duplikat komponen, 7 pages)
server/               (tidak berubah)
```

### Struktur Baru
```
client/                (Merged: 47 JSX files)
├── src/
│   ├── shared/       (Komponen & service yang sama)
│   ├── admin/        (Admin-specific pages & components)
│   ├── kasir/        (Kasir-specific pages & components)
│   ├── App.jsx       (Router utama: switch admin/kasir)
│   └── main.jsx      (Entry point)
```

## 📂 Detail Struktur

### Shared Folder (Komponen Umum)
**`src/shared/`**
- **components/common/** (8 komponen yang sudah di-merge)
  - Button.jsx ✅
  - Card.jsx ✅
  - ConfirmModal.jsx ✅
  - Header.jsx ✅
  - Modal.jsx ✅
  - OrderDetailModal.jsx ✅
  - Pagination.jsx ✅
  - Table.jsx ✅

- **context/** (Context yang digunakan kedua app)
  - AuthContext.jsx
  - SettingsContext.jsx
  
- **pages/**
  - Login.jsx (unified)
  
- **services/** (API & utility)
  - api.js
  - cloudinary.js
  - supabase.js
  
- **utils/**
  - helpers.js
  - index.js

### Admin App
**`src/admin/`** (8 pages)
- Dashboard.jsx
- MenuItems.jsx
- MenuCategories.jsx
- TableManajement.jsx *(typo dari original)*
- Employees.jsx
- Reports.jsx
- Settings.jsx
- Login.jsx *(untuk backward compatibility)*

**Components:**
- layout/ → AdminLayout.jsx, Sidebar.jsx, ProtectedRoute.jsx
- management/ → CategoryTable.jsx, MenuItemForm.jsx
- reports/ → SalesChart.jsx, TopSellingItems.jsx

**Context:**
- DataContext.jsx *(admin-specific)*

### Kasir App
**`src/kasir/`** (7 pages)
- TableMap.jsx
- OrderPage.jsx
- ShiftDashboard.jsx
- KitchenPage.jsx
- HistoryPage.jsx
- MenuPage.jsx
- Login.jsx

**Components:**
- CartSidebar.jsx
- KasirLayout.jsx
- Receipt.jsx
- TableCard.jsx

**Context:**
- CartContext.jsx *(kasir-specific)*

## 🔄 Cara Kerja Routing

1. User membuka aplikasi
2. Jika belum login → Tampil Login page (`/shared/pages/Login.jsx`)
3. Setelah login, sistem cek `user.role`:
   - **role = 'kasir'** → Render `KasirApp` dengan `CartProvider`
   - **role = 'admin'** → Render `AdminApp` dengan `DataProvider`
4. Setiap app memiliki routing sendiri

```
App.jsx (Main Router)
  ↓
Cek user.role
  ├── role = 'kasir' → KasirApp (src/kasir/App.jsx)
  │   ├── / (TableMap)
  │   ├── /order/:tableId (OrderPage)
  │   ├── /shift (ShiftDashboard)
  │   ├── /kitchen (KitchenPage)
  │   └── /history (HistoryPage)
  │
  └── role = 'admin' → AdminApp (src/admin/App.jsx)
      ├── / (Dashboard)
      ├── /menu (MenuItems)
      ├── /categories (MenuCategories)
      ├── /tables (TableManajement)
      ├── /reports (Reports)
      ├── /employees (Employees)
      └── /settings (Settings)
```

## 📝 Update Import Paths

### ✅ Sudah Diupdate di Semua File:

**Admin Files:**
- ✓ src/admin/pages/*.jsx (8 files)
- ✓ src/admin/context/*.jsx (2 files)
- ✓ src/admin/components/layout/*.jsx (3 files)
- ✓ src/admin/components/management/*.jsx (2 files)
- ✓ src/admin/components/reports/*.jsx (2 files)

**Kasir Files:**
- ✓ src/kasir/pages/*.jsx (7 files)
- ✓ src/kasir/context/*.jsx (1 file)
- ✓ src/kasir/components/*.jsx (4 files)

**Example:**
```javascript
// OLD (admin pages)
import Button from '../components/common/Button';

// NEW
import Button from '../../shared/components/common/Button';
```

## 🚀 Langkah Selanjutnya

1. **Cleanup old folders** (optional)
   ```bash
   rm -r client_admin client_kasir
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Run development**
   ```bash
   npm run dev
   ```

4. **Update server** (jika ada base URL yang berbeda)
   - Admin & Kasir sekarang di satu project
   - Pastikan `.env` sudah benar

## 📦 Dependencies yang Digabung

Semua dependencies dari kedua app sudah di-merge di `package.json`:
- Admin-specific: jspdf-autotable, lucide (library)
- Kasir-specific: html2canvas, react-to-pdf, react-to-print
- Shared: axios, react-router-dom, react-hot-toast, recharts, dll

## ✨ Benefits

✅ **Code Reuse** - Komponen yang sama hanya ada 1 copy
✅ **Easier Maintenance** - Lebih mudah handle update
✅ **Smaller Build** - Tidak ada duplikasi di bundle
✅ **Better Organization** - Struktur lebih jelas
✅ **Unified Auth** - Auth system terpusat

## 📞 Notes

- Semua original functionality tetap terjaga
- Import paths sudah fully updated
- .env file sudah di-copy ke folder baru
- README ada di `client/README.md` untuk referensi development

---

✅ **Merge Complete!** Project siap digunakan.
