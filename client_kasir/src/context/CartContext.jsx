import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // State Keranjang: Array of { itemId, name, price, quantity, notes, image_url }
    const [cartItems, setCartItems] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null); // Menyimpan meja yang sedang aktif

    // Tambah Item ke Cart
    const addToCart = (product, notes = '') => {
        setCartItems((prev) => {
            // Cek jika item sudah ada
            const existingItem = prev.find((item) => item.itemId === product.itemId);
            
            if (existingItem) {
                // Jika ada, update quantity
                return prev.map((item) =>
                    item.itemId === product.itemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Jika belum, tambah baru
                return [...prev, { ...product, quantity: 1, notes }];
            }
        });
    };

    // Kurangi Qty
    const decreaseQty = (itemId) => {
        setCartItems((prev) => 
            prev.map(item => {
                if (item.itemId === itemId) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            }).filter(item => item.quantity > 0) // Hapus jika qty jadi 0
        );
    };

    // Update Notes
    const updateNotes = (itemId, newNotes) => {
        setCartItems(prev => 
            prev.map(item => item.itemId === itemId ? { ...item, notes: newNotes } : item)
        );
    };

    // Hapus Item
    const removeFromCart = (itemId) => {
        setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
    };

    // Kosongkan Cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Kalkulasi Total
    const cartTotals = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Ambil taxRate dari settings nanti, sementara hardcode 10%
        const taxRate = 0.10; 
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        return { subtotal, tax, total, totalQty };
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        decreaseQty,
        removeFromCart,
        updateNotes,
        clearCart,
        cartTotals,
        selectedTable,
        setSelectedTable
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);