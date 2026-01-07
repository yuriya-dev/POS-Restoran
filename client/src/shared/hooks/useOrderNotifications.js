import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

/**
 * Hook untuk mengelola order notifications
 * Gunakan di komponen yang perlu menampilkan notifikasi order updates
 */
export const useOrderNotifications = (shouldListen = true) => {
    const { addNotification } = useNotification();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!shouldListen) return;

        // Setup polling untuk cek order updates setiap 5 detik
        const pollInterval = setInterval(async () => {
            try {
                // Cek apakah ada order yang statusnya berubah
                const response = await api.getOrders();
                if (response.data) {
                    // Logic untuk detect perubahan status bisa ditambahkan di sini
                    const pendingOrders = response.data.filter(o => o.status === 'active');
                    setUnreadCount(pendingOrders.length);
                }
            } catch (error) {
                console.error('Error polling orders:', error);
            }
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [shouldListen, addNotification]);

    // Fungsi untuk menampilkan notifikasi order
    const notifyOrderReady = (orderId, tableName) => {
        addNotification(
            `Pesanan dari Meja ${tableName} siap!`,
            'success',
            5000,
            {
                label: 'Lihat Detail',
                onClick: () => window.location.href = `/order/${orderId}`
            }
        );
    };

    const notifyOrderCreated = (tableNumber, itemCount) => {
        addNotification(
            `Order baru dari Meja ${tableNumber} (${itemCount} item)`,
            'info',
            5000
        );
    };

    const notifyOrderPaid = (orderId, tableNumber) => {
        addNotification(
            `Meja ${tableNumber} sudah membayar Order #${orderId}`,
            'success',
            4000
        );
    };

    const notifyUrgentOrder = (tableNumber, duration) => {
        addNotification(
            `⚠️ Pesanan Meja ${tableNumber} sudah menunggu ${duration} menit!`,
            'urgent',
            0 // Tidak auto-dismiss
        );
    };

    const notifyStockWarning = (itemName, stock) => {
        addNotification(
            `⚠️ Stok ${itemName} tinggal ${stock} pcs`,
            'warning',
            5000
        );
    };

    const notifyError = (message) => {
        addNotification(message, 'error', 6000);
    };

    return {
        unreadCount,
        notifyOrderReady,
        notifyOrderCreated,
        notifyOrderPaid,
        notifyUrgentOrder,
        notifyStockWarning,
        notifyError,
    };
};
