/**
 * TESTING & USAGE EXAMPLES - Notification System
 * 
 * File ini menunjukkan berbagai cara menggunakan sistem notifikasi
 * yang telah diintegrasikan ke dalam aplikasi POS Restoran.
 */

// =====================================================
// EXAMPLE 1: Basic Usage - Menggunakan useNotification Hook
// =====================================================
/*
import { useNotification } from '@/shared/context/NotificationContext';

function MyComponent() {
  const { addNotification, removeNotification, clearAll } = useNotification();

  const showSuccessNotif = () => {
    addNotification('Operasi berhasil!', 'success', 5000);
  };

  const showErrorNotif = () => {
    addNotification('Terjadi kesalahan!', 'error', 5000);
  };

  return (
    <div>
      <button onClick={showSuccessNotif}>Show Success</button>
      <button onClick={showErrorNotif}>Show Error</button>
    </div>
  );
}
*/

// =====================================================
// EXAMPLE 2: Notifikasi dengan Action Button
// =====================================================
/*
const { addNotification } = useNotification();

// Notifikasi dengan tombol aksi
addNotification(
  'Order baru dari Meja 5',
  'info',
  5000,
  {
    label: 'Buka Order',
    onClick: () => {
      console.log('User clicked action button');
      // Lakukan sesuatu saat button diklik
    }
  }
);
*/

// =====================================================
// EXAMPLE 3: Notifikasi Urgent (Non-dismissable otomatis)
// =====================================================
/*
const { addNotification } = useNotification();

// Notifikasi urgent tidak auto-dismiss, harus diklik
addNotification(
  '⚠️ Pesanan Meja 3 sudah menunggu 20 menit!',
  'urgent',
  0 // duration = 0 berarti tidak auto-dismiss
);
*/

// =====================================================
// EXAMPLE 4: Menggunakan di dalam async function
// =====================================================
/*
import { useNotification } from '@/shared/context/NotificationContext';
import { api } from '@/shared/services/api';

function OrderForm() {
  const { addNotification } = useNotification();

  const handleSubmitOrder = async (orderData) => {
    try {
      const response = await api.createOrder(orderData);
      
      addNotification(
        `✅ Order #${response.data.orderId} berhasil dibuat!`,
        'success',
        5000,
        {
          label: 'Lihat Detail',
          onClick: () => navigate(`/orders/${response.data.orderId}`)
        }
      );
    } catch (error) {
      addNotification(
        `❌ Gagal membuat order: ${error.message}`,
        'error',
        6000
      );
    }
  };

  return <button onClick={() => handleSubmitOrder(data)}>Submit Order</button>;
}
*/

// =====================================================
// EXAMPLE 5: Menggunakan useOrderNotifications Hook
// =====================================================
/*
import { useOrderNotifications } from '@/shared/hooks/useOrderNotifications';

function KitchenDashboard() {
  const {
    unreadCount,
    notifyOrderReady,
    notifyOrderCreated,
    notifyOrderPaid,
    notifyUrgentOrder,
    notifyStockWarning
  } = useOrderNotifications();

  return (
    <div>
      <p>Pending Orders: {unreadCount}</p>
      
      <button onClick={() => notifyOrderReady('ORD-123', 'Meja 5')}>
        Order Siap
      </button>
      
      <button onClick={() => notifyOrderCreated(5, 3)}>
        Order Baru
      </button>
      
      <button onClick={() => notifyStockWarning('Nasi Kuning', 5)}>
        Warning Stok
      </button>
    </div>
  );
}
*/

// =====================================================
// EXAMPLE 6: Menggunakan useCartWithNotification Hook
// =====================================================
/*
import { useCartWithNotification } from '@/kasir/hooks/useCartWithNotification';

function OrderPage() {
  const { addToCart, submitOrder } = useCartWithNotification();
  // addToCart dan submitOrder sekarang otomatis menampilkan notifikasi

  const handleAddItem = (item) => {
    addToCart(item); // Auto notification: "Item ditambahkan ke keranjang"
  };

  const handleSubmit = async (paymentMethod) => {
    try {
      await submitOrder(paymentMethod); // Auto notification: "Order berhasil dibuat"
    } catch (error) {
      // Error notification sudah ditampilkan otomatis
    }
  };

  return (
    <div>
      <button onClick={() => handleAddItem(menuItem)}>Add to Cart</button>
      <button onClick={() => handleSubmit('cash')}>Submit Order</button>
    </div>
  );
}
*/

// =====================================================
// EXAMPLE 7: Notifikasi di dalam useEffect (Polling)
// =====================================================
/*
import { useEffect } from 'react';
import { useNotification } from '@/shared/context/NotificationContext';
import { api } from '@/shared/services/api';

function OrderMonitor() {
  const { addNotification } = useNotification();
  
  useEffect(() => {
    let lastOrderCount = 0;

    const interval = setInterval(async () => {
      try {
        const response = await api.getOrders();
        const pendingOrders = response.data.filter(o => o.status === 'active');
        
        if (pendingOrders.length > lastOrderCount) {
          const newOrders = pendingOrders.length - lastOrderCount;
          addNotification(
            `📋 ${newOrders} order baru masuk!`,
            'info',
            5000
          );
        }
        
        lastOrderCount = pendingOrders.length;
      } catch (error) {
        console.error('Error polling orders:', error);
      }
    }, 5000); // Poll setiap 5 detik

    return () => clearInterval(interval);
  }, [addNotification]);

  return <div>Order Monitor Active</div>;
}
*/

// =====================================================
// EXAMPLE 8: Notifikasi Types dan Default Duration
// =====================================================
/*
Notifikasi Types:
- 'info'      - Informasi umum, auto-dismiss 5000ms (biru)
- 'success'   - Aksi berhasil, auto-dismiss 5000ms (hijau)
- 'warning'   - Peringatan, auto-dismiss 5000ms (kuning)
- 'error'     - Kesalahan, auto-dismiss 6000ms (merah)
- 'urgent'    - Mendesak, NO auto-dismiss, perlu manual click (oranye)

Custom duration:
addNotification('Message', 'success', 10000); // 10 detik
addNotification('Message', 'error', 0);      // Tidak ada auto-dismiss (manual close)
*/

// =====================================================
// CURRENT INTEGRATION STATUS
// =====================================================
/*
✅ SUDAH INTEGRATED:
1. KasirLayout.jsx - NotificationCenter component displayed
2. KitchenPage.jsx - notifyOrderReady saat order selesai
3. OrderPage.jsx - useNotification hook imported
4. App.jsx - NotificationProvider wrapped

⬜ SIAP UNTUK INTEGRATION (Tinggal dipakai):
1. CartSidebar - Notify saat order payment
2. HistoryPage - Notify saat order berubah status
3. ShiftDashboard - Notify shift start/end
4. AdminDashboard - Notify inventory updates
*/

export default {};
