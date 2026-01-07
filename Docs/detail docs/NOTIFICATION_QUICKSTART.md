# 🔔 Quick Start - Notification System

## Setup Cepat (Sudah Selesai ✅)

Sistem notifikasi sudah fully integrated ke dalam aplikasi POS Restoran. Berikut adalah komponen yang sudah dibuat:

### File-file Baru yang Ditambahkan:

1. **Context & Provider**
   - `client/src/shared/context/NotificationContext.jsx` - Global state management
   - Updated: `client/src/App.jsx` - NotificationProvider wrapper

2. **Components**
   - `client/src/shared/components/NotificationCenter.jsx` - UI notifications

3. **Hooks**
   - `client/src/shared/hooks/useOrderNotifications.js` - Order-specific notifications
   - `client/src/kasir/hooks/useCartWithNotification.js` - Cart notifications wrapper

4. **Updated Files**
   - `client/src/kasir/components/KasirLayout.jsx` - NotificationCenter integration
   - `client/src/kasir/pages/KitchenPage.jsx` - Order completion notifications
   - `client/src/kasir/pages/OrderPage.jsx` - Ready for notification usage

5. **Documentation**
   - `NOTIFICATION_SYSTEM.md` - Full documentation
   - `NOTIFICATION_EXAMPLES.md` - Code examples

---

## Penggunaan Cepat

### 1️⃣ Notifikasi Sederhana
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotification();

  return (
    <button onClick={() => addNotification('Berhasil!', 'success')}>
      Trigger Notification
    </button>
  );
}
```

### 2️⃣ Notifikasi dengan Action Button
```jsx
addNotification(
  'Order baru dari Meja 5',
  'success',
  5000,
  {
    label: 'Buka Order',
    onClick: () => navigate('/order/5')
  }
);
```

### 3️⃣ Notifikasi Urgent (Tidak Auto-Dismiss)
```jsx
addNotification(
  '⚠️ Pesanan Meja 3 sudah menunggu 15 menit!',
  'urgent',
  0 // duration 0 = manual close only
);
```

### 4️⃣ Menggunakan useOrderNotifications Hook
```jsx
import { useOrderNotifications } from '@/shared/hooks/useOrderNotifications';

function KitchenPage() {
  const { notifyOrderReady, notifyStockWarning } = useOrderNotifications();

  return (
    <>
      <button onClick={() => notifyOrderReady('ORD-001', 'Meja 5')}>
        Mark Ready
      </button>
      <button onClick={() => notifyStockWarning('Nasi Kuning', 5)}>
        Low Stock
      </button>
    </>
  );
}
```

---

## Notification Types & Colors

| Type | Color | Auto-Dismiss | Usage |
|------|-------|-------------|-------|
| `info` | 🔵 Blue | 5s | General information |
| `success` | 🟢 Green | 5s | Successful actions |
| `warning` | 🟡 Yellow | 5s | Warnings/cautions |
| `error` | 🔴 Red | 6s | Error messages |
| `urgent` | 🟠 Orange | Manual | Critical alerts |

---

## Fitur-fitur yang Sudah Berfungsi

### ✅ Kitchen Page
```jsx
// Saat order selesai dimasak
await api.completeOrder(orderId);
addNotification(
  `✅ Pesanan #${orderId} sudah selesai dimasak!`,
  'success'
);
```

### ✅ Notification Center (Always Visible)
- Tampil di top-right corner
- Support light & dark mode
- Auto-dismiss atau manual close
- Action buttons support
- Badge counter untuk unread

---

## Next Steps - Integrasi di Modul Lain

### Di CartSidebar (Payment)
```jsx
// Saat order berhasil dibayar
const { addNotification } = useNotification();

handleSubmitPayment = async (method) => {
  const result = await api.submitPayment(orderId, method);
  if (result.success) {
    addNotification(
      `✅ Pembayaran diterima! Total: Rp ${result.amount}`,
      'success'
    );
  }
};
```

### Di HistoryPage (Order Status Changes)
```jsx
// Monitor perubahan status order
useEffect(() => {
  const interval = setInterval(async () => {
    const orders = await api.getOrders();
    // Check for status changes dan trigger notifikasi
  }, 5000);
}, []);
```

### Di AdminDashboard
```jsx
// Notifikasi untuk admin
notifyStockWarning('Item X', 5); // Stok tinggal 5
notifyUrgentOrder(10, 25);       // Order pending 25 menit
```

---

## Troubleshooting

### ❌ Notifikasi Tidak Muncul?
1. Pastikan komponen dibungkus dengan `<NotificationProvider>`
2. Cek import path yang benar
3. Lihat browser console untuk error

### ❌ Notifikasi Tidak Auto-Dismiss?
1. Jika `duration` = 0, berarti manual dismiss only (urgent notifications)
2. Untuk auto-dismiss, set `duration` > 0

### ❌ Dark Mode Tidak Bekerja?
1. Pastikan localStorage 'theme' setting tersimpan
2. Verify `isDarkMode` prop dikirim ke NotificationCenter

---

## API Reference

### useNotification() Hook

```jsx
const {
  notifications,        // Array of current notifications
  addNotification,      // Add new notification
  removeNotification,   // Remove by ID
  clearAll             // Clear all notifications
} = useNotification();
```

### addNotification Parameters

```jsx
addNotification(
  message,             // string - Notification message
  type,               // 'info' | 'success' | 'warning' | 'error' | 'urgent'
  duration,           // number - ms until auto-dismiss (0 = no auto-dismiss)
  action              // optional { label: string, onClick: function }
);
```

### useOrderNotifications() Hook

```jsx
const {
  unreadCount,          // Number of pending orders
  notifyOrderReady,     // (orderId, tableName)
  notifyOrderCreated,   // (tableNumber, itemCount)
  notifyOrderPaid,      // (orderId, tableNumber)
  notifyUrgentOrder,    // (tableNumber, durationMinutes)
  notifyStockWarning,   // (itemName, quantity)
  notifyError          // (message)
} = useOrderNotifications(shouldListen);
```

---

## Testing Notifikasi

Buat test component untuk memverifikasi semua notification types:

```jsx
function NotificationTester() {
  const { addNotification } = useNotification();

  return (
    <div className="flex gap-2 flex-wrap p-4">
      <button onClick={() => addNotification('Info message', 'info')}>Info</button>
      <button onClick={() => addNotification('Success!', 'success')}>Success</button>
      <button onClick={() => addNotification('Warning!', 'warning')}>Warning</button>
      <button onClick={() => addNotification('Error!', 'error')}>Error</button>
      <button onClick={() => addNotification('Urgent!', 'urgent', 0)}>Urgent</button>
      
      <button onClick={() => addNotification('With Action', 'info', 5000, {
        label: 'Click Me',
        onClick: () => console.log('Action clicked!')
      })}>Action Button</button>
    </div>
  );
}
```

---

## Video Integration Checklist

- [x] Create NotificationContext
- [x] Create NotificationCenter component
- [x] Integrate NotificationProvider in App.jsx
- [x] Add NotificationCenter to KasirLayout
- [x] Create useOrderNotifications hook
- [x] Create useCartWithNotification hook
- [x] Add notification to KitchenPage (order completion)
- [x] Update OrderPage with useNotification import
- [ ] Add payment notifications to CartSidebar
- [ ] Add order status notifications to HistoryPage
- [ ] Add shift notifications to ShiftDashboard
- [ ] Add inventory notifications to AdminDashboard
- [ ] Implement WebSocket/real-time updates
- [ ] Add sound alerts for urgent notifications
- [ ] Add browser desktop notifications

---

## Support & Documentation

📖 Full documentation: `NOTIFICATION_SYSTEM.md`
📝 Code examples: `NOTIFICATION_EXAMPLES.md`

Untuk pertanyaan atau issues, refer ke documentation files di atas.
