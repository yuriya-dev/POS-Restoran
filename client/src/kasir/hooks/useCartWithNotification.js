import React, { useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../../shared/context/NotificationContext';

/**
 * Hook untuk menambah item ke cart dengan notifikasi
 * Wrapper dari useCart dengan tambahan notifikasi feedback
 */
export const useCartWithNotification = () => {
    const { 
        cartItems, 
        addToCart: originalAddToCart, 
        decreaseQty, 
        updateNotes, 
        setSelectedTable,
        clearCart,
        submitOrder
    } = useCart();
    
    const { addNotification } = useNotification();

    const addToCartWithNotification = useCallback((product, notes = '') => {
        // Cek jika item sudah ada di cart
        const existingItem = cartItems.find(item => item.itemId === product.itemId);
        
        // Call original addToCart
        originalAddToCart(product, notes);

        // Trigger notifikasi
        if (existingItem) {
            addNotification(
                `${product.name} (qty +1)`,
                'info',
                3000
            );
        } else {
            addNotification(
                `${product.name} ditambahkan ke keranjang`,
                'success',
                3000,
                {
                    label: 'Lihat Keranjang',
                    onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                }
            );
        }
    }, [cartItems, originalAddToCart, addNotification]);

    const decreaseQtyWithNotification = useCallback((itemId, itemName) => {
        decreaseQty(itemId);
        addNotification(
            `${itemName} dikurangi`,
            'info',
            2000
        );
    }, [decreaseQty, addNotification]);

    const submitOrderWithNotification = useCallback(async (paymentMethod, paymentProof = null) => {
        try {
            const result = await submitOrder(paymentMethod, paymentProof);
            
            if (result.success) {
                addNotification(
                    `✅ Order berhasil dibuat! No. Order: #${result.orderId}`,
                    'success',
                    5000
                );
            }
            return result;
        } catch (error) {
            addNotification(
                `❌ Gagal membuat order: ${error.message}`,
                'error',
                5000
            );
            throw error;
        }
    }, [submitOrder, addNotification]);

    return {
        cartItems,
        addToCart: addToCartWithNotification,
        decreaseQty: decreaseQtyWithNotification,
        updateNotes,
        setSelectedTable,
        clearCart,
        submitOrder: submitOrderWithNotification,
    };
};
