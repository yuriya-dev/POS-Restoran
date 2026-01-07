# 📋 Fitur Notifikasi - File Summary & Testing Guide

## 🎯 Overview
Sistem notifikasi telah sepenuhnya diintegrasikan ke aplikasi POS Restoran. Fitur ini memberikan feedback real-time kepada pengguna untuk berbagai event penting seperti order baru, order selesai, stock warning, dan situasi urgent lainnya.

---

## 📦 File-File yang Telah Dibuat

### 1. **Context Layer**
```
client/src/shared/context/NotificationContext.jsx
```
- **Fungsi**: Mengelola state notifikasi secara global
- **Exports**: `NotificationProvider`, `useNotification` hook
- **Size**: ~1.5 KB

**Key Functions:**
- `addNotification(message, type, duration, action)` - Tambah notifikasi
- `removeNotification(id)` - Hapus notifikasi
- `clearAll()` - Hapus semua notifikasi

---

### 2. **UI Component**
```
client/src/shared/components/NotificationCenter.jsx
```
- **Fungsi**: Menampilkan notifikasi di UI
- **Props**: notifications, onRemove, isDarkMode
- **Features**: Auto-dismiss, dark mode, action buttons, animations
- **Size**: ~3 KB

**Notification Types:**
- `info` 🔵 - Informasi umum
- `success` 🟢 - Aksi berhasil
- `warning` 🟡 - Peringatan
- `error` 🔴 - Kesalahan
- `urgent` 🟠 - Mendesak (no auto-dismiss)

---

### 3. **Custom Hooks**

#### a. useOrderNotifications.js
```
client/src/shared/hooks/useOrderNotifications.js
```
- **Fungsi**: Notifikasi khusus untuk order-related events
- **Methods**: 
  - `notifyOrderReady(orderId, tableName)`
  - `notifyOrderCreated(tableNumber, itemCount)`
  - `notifyOrderPaid(orderId, tableNumber)`
  - `notifyUrgentOrder(tableNumber, duration)`
  - `notifyStockWarning(itemName, stock)`
  - `notifyError(message)`
- **Size**: ~2 KB

#### b. useCartWithNotification.js
```
client/src/kasir/hooks/useCartWithNotification.js
```
- **Fungsi**: Wrapper untuk Cart operations dengan notifikasi otomatis
- **Methods**:
  - `addToCart(product, notes)` - dengan notifikasi
  - `decreaseQty(itemId, itemName)` - dengan notifikasi
  - `submitOrder(paymentMethod)` - dengan notifikasi
- **Size**: ~2.5 KB

---

### 4. **Updated Components**

#### a. App.jsx
```
client/src/App.jsx
```
**Changes:**
- Import `NotificationProvider`
- Wrap `AppRouter` dengan `NotificationProvider`
- Line ~8: Added import
- Line ~69-71: Added provider wrapper

#### b. KasirLayout.jsx
```
client/src/kasir/components/KasirLayout.jsx
```
**Changes:**
- Import `NotificationCenter`, `useNotification`
- Extract notifications from useNotification hook
- Add NotificationCenter component di awal JSX
- Lines ~1-8: Imports
- Lines ~12-15: useNotification hook
- Lines ~127-135: NotificationCenter component

#### c. KitchenPage.jsx
```
client/src/kasir/pages/KitchenPage.jsx
```
**Changes:**
- Import `useNotification`
- Add notification saat order selesai dimasak
- Lines ~1-6: Imports
- Lines ~9-10: useNotification hook
- Lines ~80-95: Enhanced handleComplete dengan notifikasi

#### d. OrderPage.jsx
```
client/src/kasir/pages/OrderPage.jsx
```
**Changes:**
- Import `useNotification`
- Ready untuk diintegrasikan lebih lanjut
- Lines ~1-8: Imports
- Lines ~12-14: useNotification hook

---

## 📚 Documentation Files

### 1. NOTIFICATION_SYSTEM.md
- **Pembahasan lengkap** tentang sistem notifikasi
- **Struktur komponen** dan cara kerjanya
- **Contoh penggunaan** untuk berbagai kasus
- **Customization guide** untuk styling dan behavior
- **Future enhancements** yang bisa ditambahkan

### 2. NOTIFICATION_EXAMPLES.md
- **7 contoh kode** untuk berbagai use cases
- **Integration status** untuk semua modul
- **Code snippets** yang langsung bisa digunakan
- **Testing examples** untuk setiap notifikasi type

### 3. NOTIFICATION_QUICKSTART.md (ini adalah file ini)
- **Quick reference guide**
- **API reference** lengkap
- **Troubleshooting tips**
- **Integration checklist** untuk module lain

---

## 🧪 Testing Notification Features

### Test 1: Basic Notification
```jsx
// Di browser console atau dalam component
const { addNotification } = useNotification();
addNotification('Test notification', 'info', 5000);
```
✅ **Expected**: Notifikasi muncul di top-right, disappear after 5 seconds

---

### Test 2: All Notification Types
```jsx
// Create test component
function NotificationTester() {
  const { addNotification } = useNotification();

  return (
    <div className="flex gap-2 p-4">
      <button onClick={() => addNotification('Info', 'info')}>Info</button>
      <button onClick={() => addNotification('Success!', 'success')}>Success</button>
      <button onClick={() => addNotification('Warning!', 'warning')}>Warning</button>
      <button onClick={() => addNotification('Error!', 'error')}>Error</button>
      <button onClick={() => addNotification('Urgent!', 'urgent', 0)}>Urgent</button>
    </div>
  );
}
```
✅ **Expected**: 5 notifikasi dengan warna berbeda, urgent tidak auto-dismiss

---

### Test 3: Notification dengan Action Button
```jsx
const { addNotification } = useNotification();

addNotification(
  'Order baru dari Meja 5',
  'success',
  5000,
  {
    label: 'Buka Order',
    onClick: () => console.log('Action clicked!')
  }
);
```
✅ **Expected**: Notifikasi tampil dengan button, click button trigger console.log

---

### Test 4: Kitchen Page Order Completion
1. Masuk ke **Kitchen Page** (`/kitchen`)
2. Klik **"Selesai"** pada salah satu order
3. Lihat notifikasi "✅ Pesanan #... sudah selesai dimasak!"
✅ **Expected**: Notifikasi muncul dengan tipe success

---

### Test 5: Dark Mode Compatibility
1. Toggle dark mode di header (moon icon)
2. Trigger notifikasi
3. Verifikasi notifikasi color tetap readable dalam dark mode
✅ **Expected**: Notifikasi text dan background contrast tetap baik

---

### Test 6: Multiple Notifications
```jsx
const { addNotification } = useNotification();

// Add multiple notifications quickly
addNotification('Notification 1', 'info');
addNotification('Notification 2', 'success');
addNotification('Notification 3', 'error');
```
✅ **Expected**: Semua notifikasi muncul di stack, bisa di-dismiss individual

---

## 🔌 Integration Checklist

### ✅ Already Integrated
- [x] NotificationContext created
- [x] NotificationCenter UI component
- [x] NotificationProvider in App.jsx
- [x] NotificationCenter in KasirLayout
- [x] useOrderNotifications hook
- [x] useCartWithNotification hook
- [x] KitchenPage order completion notifications
- [x] OrderPage ready for notifications

### ⏳ Ready for Integration (Next Steps)
- [ ] **CartSidebar** - Payment notifications
  ```jsx
  // When payment submitted
  const { notifyOrderPaid } = useOrderNotifications();
  await submitPayment();
  notifyOrderPaid(orderId, tableNumber);
  ```

- [ ] **HistoryPage** - Order status monitoring
  ```jsx
  // Poll untuk order status changes
  useEffect(() => {
    const interval = setInterval(async () => {
      const orders = await api.getOrders();
      // Check status changes dan trigger notifikasi
    }, 5000);
  }, []);
  ```

- [ ] **ShiftDashboard** - Shift notifications
  ```jsx
  // On shift start/end
  addNotification(`Shift ${shiftId} dimulai`, 'success');
  ```

- [ ] **AdminDashboard** - Admin alerts
  ```jsx
  // Low inventory warning
  const { notifyStockWarning } = useOrderNotifications();
  notifyStockWarning('Nasi Kuning', 3);
  ```

---

## 📏 Size & Performance

| File | Size | Impact |
|------|------|--------|
| NotificationContext.jsx | 1.5 KB | Minimal |
| NotificationCenter.jsx | 3 KB | Minimal |
| useOrderNotifications.js | 2 KB | Minimal |
| useCartWithNotification.js | 2.5 KB | Minimal |
| **Total** | **~8.5 KB** | **Negligible** |

**Performance Notes:**
- Context-based, no external dependencies
- Auto-dismiss menggunakan setTimeout (efficient)
- Component renders efficiently dengan React
- Dark mode toggle tidak memaksa full re-render

---

## 🎨 Customization

### Mengubah Warna Notifikasi
Edit `getStyles()` function di `NotificationCenter.jsx`:
```jsx
const getStyles = (type) => {
  switch(type) {
    case 'success':
      return 'bg-emerald-50 dark:bg-emerald-900/20 ...'; // Ubah warna sini
  }
}
```

### Mengubah Position
Edit JSX di `NotificationCenter.jsx`:
```jsx
<div className="fixed top-4 right-4 z-50 ..."> {/* Ubah top-4 right-4 sini */}
```

### Mengubah Animation
Edit className di notification item:
```jsx
className={`... animate-in slide-in-from-right-5 fade-in duration-300 ...`}
// Bisa ganti dengan: slide-in-from-top, bounce-in, zoom-in, dll
```

---

## 🐛 Troubleshooting

### Issue: Notifikasi tidak muncul
**Solutions:**
1. Verifikasi `NotificationProvider` memwrap App
2. Cek import path benar
3. Lihat browser console untuk error
4. Verifikasi component dalam Outlet atau Provider scope

### Issue: Notifikasi tidak auto-dismiss
**Solutions:**
1. Jika `duration = 0`, berarti sengaja (urgent notifications)
2. Untuk auto-dismiss, set `duration > 0`
3. Default duration: 5000ms

### Issue: Dark mode tidak bekerja
**Solutions:**
1. Pastikan `isDarkMode` prop dikirim ke NotificationCenter
2. Verifikasi `localStorage.getItem('theme')` ada
3. Check document.documentElement punya class 'dark'

---

## 📞 Support Resources

- **Dokumentasi Lengkap**: `NOTIFICATION_SYSTEM.md`
- **Code Examples**: `NOTIFICATION_EXAMPLES.md`
- **API Reference**: Lihat section di atas atau doc file
- **Browse Source**: 
  - Context: `client/src/shared/context/NotificationContext.jsx`
  - Component: `client/src/shared/components/NotificationCenter.jsx`
  - Hooks: `client/src/shared/hooks/` & `client/src/kasir/hooks/`

---

## ✨ Next Phase

Setelah semua modul terintegrasi dengan notifikasi, pertimbangkan:
1. **WebSocket Integration** - Real-time updates tanpa polling
2. **Sound Notifications** - Audio alert untuk urgent orders
3. **Browser Desktop Notifications** - Notification saat app tidak fokus
4. **Notification History** - Simpan dan akses notifikasi sebelumnya
5. **User Preferences** - Allow user untuk customize notification types

---

**Status**: ✅ **PRODUCTION READY**

Sistem notifikasi sudah siap digunakan dan dapat langsung diintegrasikan ke berbagai modul aplikasi sesuai kebutuhan.
