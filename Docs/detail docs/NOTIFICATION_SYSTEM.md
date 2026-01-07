# Sistem Notifikasi POS Restoran

## Overview
Fitur notifikasi telah diintegrasikan ke dalam sistem POS untuk memberikan feedback real-time kepada pengguna tentang perubahan status order, pesanan darurat, dan kondisi sistem.

## Komponen & Files

### 1. **NotificationContext.jsx**
File: `client/src/shared/context/NotificationContext.jsx`

Context yang mengelola state notifikasi secara global menggunakan React Context API.

**Fungsi:**
- `addNotification(message, type, duration, action)` - Menambah notifikasi baru
- `removeNotification(id)` - Menghapus notifikasi berdasarkan ID
- `clearAll()` - Menghapus semua notifikasi

**Tipe Notifikasi:**
- `info` - Informasi umum (biru)
- `success` - Aksi berhasil (hijau)
- `warning` - Peringatan (kuning)
- `error` - Kesalahan (merah)
- `urgent` - Mendesak, tidak auto-dismiss (oranye, dengan animasi bounce)

### 2. **NotificationCenter.jsx**
File: `client/src/shared/components/NotificationCenter.jsx`

Komponen UI yang menampilkan notifikasi di sudut kanan atas layar.

**Props:**
```jsx
<NotificationCenter 
  notifications={array}      // Array notifikasi dari context
  onRemove={function}        // Callback untuk remove notifikasi
  isDarkMode={boolean}       // Flag untuk dark mode
/>
```

**Fitur:**
- Tampil auto-dismiss sesuai duration
- Support action button dengan callback
- Dark mode support
- Animasi slide-in

### 3. **useOrderNotifications.js**
File: `client/src/shared/hooks/useOrderNotifications.js`

Custom Hook untuk mengelola notifikasi spesifik order.

**Penggunaan:**
```jsx
const {
  unreadCount,           // Jumlah order pending
  notifyOrderReady,      // Order siap dipanggil
  notifyOrderCreated,    // Order baru dibuat
  notifyOrderPaid,       // Pembayaran diterima
  notifyUrgentOrder,     // Order menunggu terlalu lama
  notifyStockWarning,    // Stok item menipis
  notifyError            // Error umum
} = useOrderNotifications(shouldListen);
```

## Integrasi di Halaman

### KasirLayout.jsx
- Import `NotificationCenter` dan `useNotification`
- Tampilkan NotificationCenter di awal JSX untuk always visible

### KitchenPage.jsx
- Saat order selesai (`handleComplete`), trigger `addNotification` dengan tipe 'success'
- Notifikasi memberitahu pesanan sudah siap untuk dipanggil

### OrderPage.jsx
- Import `useNotification` untuk integrasi di masa depan
- Bisa menambahkan notifikasi saat order baru dibuat

## Contoh Penggunaan

### Menampilkan Notifikasi Info
```jsx
const { addNotification } = useNotification();

addNotification(
  "Menu sedang diperbarui",
  'info',
  5000
);
```

### Notifikasi dengan Action Button
```jsx
addNotification(
  "Order baru dari Meja 5",
  'success',
  5000,
  {
    label: 'Lihat Order',
    onClick: () => navigate('/order/5')
  }
);
```

### Notifikasi Urgent (Tidak Auto-Dismiss)
```jsx
addNotification(
  "⚠️ Pesanan Meja 3 sudah menunggu 15 menit!",
  'urgent',
  0 // duration = 0 berarti manual dismiss
);
```

### Using useOrderNotifications Hook
```jsx
import { useOrderNotifications } from '@/shared/hooks/useOrderNotifications';

function OrderComponent() {
  const { notifyOrderReady, notifyUrgentOrder } = useOrderNotifications();
  
  const handleOrderComplete = () => {
    notifyOrderReady('ORD-001', 'Meja 5');
  };
}
```

## Styling & Customization

Notifikasi menggunakan Tailwind CSS dengan support:
- **Light Mode**: Background putih, border abu-abu
- **Dark Mode**: Background gelap, border abu-abu gelap
- **Type-specific colors**: Setiap tipe punya warna unik

Untuk customize style, edit class di `NotificationCenter.jsx`:
```jsx
const getStyles = (type) => {
  switch(type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 ...';
    // dll
  }
}
```

## Auto-Dismiss Behavior

- **info, success, warning, error**: Auto-dismiss sesuai parameter `duration` (default 5000ms)
- **urgent**: Tidak auto-dismiss (duration = 0), harus diklik manual untuk dismiss
- Tombol X di notifikasi selalu bisa close manual

## Integrasi dengan API

Untuk polling order updates:
```jsx
// Di KasirLayout atau komponen provider
useEffect(() => {
  const interval = setInterval(async () => {
    const orders = await api.getOrders();
    // Logic untuk detect perubahan status
    // Trigger notifikasi jika ada perubahan
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

## TODO - Future Enhancements

1. ✅ Basic notification system
2. ⬜ Sound notification untuk urgent orders
3. ⬜ Desktop/Browser notification API integration
4. ⬜ Notification history/log
5. ⬜ Notification settings (enable/disable tipe notifikasi)
6. ⬜ Multi-language support untuk notifikasi
7. ⬜ Real-time WebSocket integration untuk order updates
8. ⬜ Badge counter untuk unread notifications

## Troubleshooting

**Notifikasi tidak muncul:**
- Pastikan `NotificationProvider` di-wrap di root App component
- Cek browser console untuk error

**Notifikasi tidak auto-dismiss:**
- Verifikasi parameter `duration` bukan 0 untuk non-urgent notifications
- Check clearTimeout tidak di-call di useEffect cleanup

**Dark mode tidak bekerja:**
- Pastikan `isDarkMode` prop di-pass ke `NotificationCenter`
- Verifikasi localStorage theme setting tersimpan dengan benar
