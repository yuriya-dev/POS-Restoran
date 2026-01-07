# 🚀 QUICK START - Copy & Paste Ready

Cara cepat menggunakan notification system.

---

## 1️⃣ Import & Setup (2 menit)

### Di file component Anda:

```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function MyComponent() {
  const { addNotification } = useNotification();
  
  // Your code here
}
```

**Itu saja! Sistem sudah siap.**

---

## 2️⃣ Gunakan (Copy-Paste)

### Success
```jsx
addNotification('✅ Berhasil!', 'success');
```

### Error
```jsx
addNotification('❌ Gagal!', 'error');
```

### Warning
```jsx
addNotification('⚠️ Peringatan!', 'warning');
```

### Info
```jsx
addNotification('ℹ️ Informasi', 'info');
```

### Urgent (Manual Dismiss)
```jsx
addNotification('🔴 Alert!', 'urgent', 0);
```

---

## 3️⃣ Real Examples

### Form Submit
```jsx
const handleSubmit = async (data) => {
  try {
    await api.createOrder(data);
    addNotification('✅ Order berhasil dibuat!', 'success');
  } catch (error) {
    addNotification(`❌ ${error.message}`, 'error');
  }
};
```

### Delete Item
```jsx
const handleDelete = async (id, name) => {
  try {
    await api.deleteItem(id);
    addNotification(`✅ "${name}" berhasil dihapus`, 'success');
  } catch (error) {
    addNotification(`❌ Gagal hapus: ${error.message}`, 'error');
  }
};
```

### With Action Button
```jsx
const handleDownload = async () => {
  const file = await api.generateReport();
  addNotification(
    '✅ Report siap download',
    'success',
    5000,
    {
      label: 'Download',
      onClick: () => downloadFile(file)
    }
  );
};
```

### Stock Alert
```jsx
useEffect(() => {
  const checkStock = async () => {
    const items = await api.getMenuItems();
    const lowStock = items.filter(i => i.qty < 10);
    
    if (lowStock.length > 0) {
      addNotification(
        `⚠️ ${lowStock.length} items stok menipis!`,
        'warning',
        0 // Manual dismiss
      );
    }
  };
  
  checkStock();
}, []);
```

---

## 4️⃣ Tipe Notifikasi

```jsx
Type        Color       Duration    Emoji
success     Green       5 second    ✅
error       Red         5 second    ❌
warning     Yellow      5 second    ⚠️
info        Blue        5 second    ℹ️
urgent      Orange      Manual      🔴
```

---

## 5️⃣ Custom Duration

```jsx
// 3 detik
addNotification('Notifikasi pendek', 'success', 3000);

// 10 detik
addNotification('Notifikasi panjang', 'warning', 10000);

// Manual dismiss (click tombol)
addNotification('Alert penting', 'urgent', 0);
```

---

## 6️⃣ Hapus Notifikasi

```jsx
const { removeNotification, clearAll } = useNotification();

// Hapus satu
removeNotification(notificationId);

// Hapus semua
clearAll();
```

---

## 7️⃣ Admin Dashboard Alert

```jsx
// Di Dashboard.jsx atau halaman admin
import { useNotification } from '@/shared/context/NotificationContext';

export default function Dashboard() {
  const { addNotification } = useNotification();
  
  useEffect(() => {
    const data = await api.getDashboardStats();
    
    if (data.pendingOrders > 5) {
      addNotification(
        `⚠️ Ada ${data.pendingOrders} order menunggu!`,
        'urgent',
        0 // Manual dismiss
      );
    }
  }, []);
}
```

---

## 8️⃣ Template Untuk Semua Admin Pages

Gunakan template yang sama untuk setiap admin page:

```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function SomeAdminPage() {
  const { addNotification } = useNotification();
  
  const handleAction = async () => {
    try {
      // Lakukan action
      await api.doSomething();
      
      // Success notification
      addNotification('✅ Berhasil!', 'success');
      
      // Refresh data
      await refreshData();
    } catch (error) {
      // Error notification
      addNotification(`❌ Error: ${error.message}`, 'error');
    }
  };
  
  return (
    <button onClick={handleAction}>Click</button>
  );
}
```

---

## ✨ Contoh Pesan (Copy-Paste)

### Success Messages
```jsx
addNotification('✅ Operasi berhasil', 'success');
addNotification('✅ Data berhasil disimpan', 'success');
addNotification('✅ Order berhasil dibuat', 'success');
addNotification('✅ Employee berhasil ditambahkan', 'success');
addNotification('✅ Menu berhasil diupdate', 'success');
```

### Error Messages
```jsx
addNotification('❌ Terjadi kesalahan', 'error');
addNotification('❌ Data tidak valid', 'error');
addNotification('❌ Gagal simpan data', 'error');
addNotification('❌ Email sudah terdaftar', 'error');
addNotification('❌ Password tidak cocok', 'error');
```

### Warning Messages
```jsx
addNotification('⚠️ Stok menipis', 'warning');
addNotification('⚠️ Versi baru tersedia', 'warning');
addNotification('⚠️ Session akan expired', 'warning');
addNotification('⚠️ Data belum disimpan', 'warning');
```

### Info Messages
```jsx
addNotification('ℹ️ Order baru masuk', 'info');
addNotification('ℹ️ Customer tiba di restoran', 'info');
addNotification('ℹ️ Laporan diproses...', 'info');
```

### Urgent Messages
```jsx
addNotification('🔴 System error!', 'urgent', 0);
addNotification('🔴 Database connection lost!', 'urgent', 0);
addNotification('🔴 Payment failed!', 'urgent', 0);
```

---

## 🎯 Cheat Sheet

```jsx
// Success
addNotification('✅ Success!', 'success');

// Error
addNotification('❌ Error!', 'error');

// Warning
addNotification('⚠️ Warning!', 'warning');

// Info
addNotification('ℹ️ Info!', 'info');

// Urgent (manual dismiss)
addNotification('🔴 Urgent!', 'urgent', 0);

// Custom duration (10 seconds)
addNotification('Message', 'success', 10000);

// With action button
addNotification('Ready', 'success', 5000, {
  label: 'Action',
  onClick: () => {}
});

// Remove one
const { removeNotification } = useNotification();
removeNotification(id);

// Clear all
const { clearAll } = useNotification();
clearAll();
```

---

## 📍 Lokasi untuk Notifikasi

| Lokasi | Tipe | Contoh |
|--------|------|--------|
| Kasir | Top-right | "Order created" |
| Admin | Dropdown | "Employee added" |
| Dashboard | Urgent | "Pending orders alert" |
| Kitchen | Order done | "Order ready" |

---

## ❌ Yang Jangan Lakukan

```jsx
// ❌ Jangan: Sensitive information
addNotification('Password: 12345', 'info');

// ❌ Jangan: Stack traces
addNotification(error.stack, 'error');

// ❌ Jangan: HTML/Scripts
addNotification('<script>alert()</script>', 'info');

// ❌ Jangan: Terlalu panjang
addNotification('Lorem ipsum dolor sit amet...', 'info');
```

---

## ✅ Yang Boleh

```jsx
// ✅ Baik: User-friendly message
addNotification('Gagal simpan data', 'error');

// ✅ Baik: Helpful message
addNotification('Password minimal 8 karakter', 'warning');

// ✅ Baik: Action-oriented
addNotification('File ready to download', 'success');

// ✅ Baik: Emoji for clarity
addNotification('✅ Order confirmed', 'success');
```

---

## 🚀 Mulai Sekarang

1. Copy import statement
2. Gunakan `addNotification()`
3. Lakukan testing
4. Deploy!

**Itu saja! Sudah siap.**

---

## 📖 Butuh Bantuan?

- Contoh lebih: [NOTIFICATION_EXAMPLES.md](NOTIFICATION_EXAMPLES.md)
- Teknis: [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md)
- Testing: [NOTIFICATION_TESTING_GUIDE.md](NOTIFICATION_TESTING_GUIDE.md)
- Admin: [ADMIN_PAGES_NOTIFICATION_INTEGRATION.md](ADMIN_PAGES_NOTIFICATION_INTEGRATION.md)

---

**Selamat menggunakan! 🎉**
