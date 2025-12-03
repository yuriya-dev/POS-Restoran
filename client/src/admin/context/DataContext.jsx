import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../../shared/services/api';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [state, setState] = useState({
        users: [],
        menuItems: [],
        categories: [],
        orders: [],
        tables: [], 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper untuk refresh entity
    const refreshData = useCallback(async (entity) => {
        try {
            let res;
            switch (entity) {
                case 'users': res = await api.getUsers(); break;
                case 'menuItems': res = await api.getMenuItems(); break;
                case 'categories': res = await api.getCategories(); break;
                case 'tables': res = await api.getTables(); break;
                case 'orders': res = await api.getOrders(); break;
                default: return;
            }
            setState(prev => ({ ...prev, [entity]: res.data }));
        } catch (err) {
            console.error(`Gagal refresh ${entity}:`, err);
        }
    }, []);

    // 1. Load Data Awal
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersRes, menusRes, catsRes, ordersRes, tablesRes] = await Promise.all([
                api.getUsers().catch(() => ({ data: [] })),
                api.getMenuItems().catch(() => ({ data: [] })),
                api.getCategories().catch(() => ({ data: [] })),
                api.getOrders().catch(() => ({ data: [] })),
                api.getTables().catch(() => ({ data: [] })),
            ]);

            setState({
                users: usersRes.data || [],
                menuItems: menusRes.data || [],
                categories: catsRes.data || [],
                orders: ordersRes.data || [],
                tables: tablesRes.data || [],
            });
        } catch (err) {
            console.error("Gagal memuat data:", err);
            setError("Gagal terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // ✅ FITUR BARU: Polling Otomatis (Update Stok & Order tiap 30 detik)
    // Ini memastikan Admin melihat stok yang berkurang meski tidak refresh halaman
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData('menuItems'); // Update Stok
            refreshData('orders');    // Update Laporan Penjualan
            refreshData('tables');    // Update Status Meja
        }, 30000); // 30 Detik

        return () => clearInterval(interval);
    }, [refreshData]);

    // --- CRUD USERS ---
    const createUser = async (userData) => {
        await toast.promise(api.register(userData), {
            loading: 'Menambahkan karyawan...',
            success: 'Karyawan berhasil ditambahkan!',
            error: (err) => err.response?.data?.message || 'Gagal menambahkan.'
        });
        await refreshData('users');
    };

    const updateUser = async (id, userData) => {
        await toast.promise(api.updateUser(id, userData), {
            loading: 'Update data...',
            success: 'Data berhasil diperbarui!',
            error: 'Gagal update.'
        });
        await refreshData('users');
    };

    const deleteUser = async (id) => {
        await toast.promise(api.deleteUser(id), {
            loading: 'Menghapus...',
            success: 'Karyawan dihapus.',
            error: (err) => err.response?.data?.message || 'Gagal menghapus.'
        });
        await refreshData('users');
    };

    // --- CRUD MENU ITEMS (FIXED: Hapus Toast internal untuk mencegah Double Toast) ---
    const createMenuItem = async (data) => {
        // Biarkan error dilempar agar bisa ditangkap oleh UI (MenuItemForm)
        await api.createMenuItem(data);
        await refreshData('menuItems');
    };

    const updateMenuItem = async (id, data) => {
        await api.updateMenuItem(id, data);
        await refreshData('menuItems');
    };

    const deleteMenuItem = async (id) => {
        await api.deleteMenuItem(id);
        await refreshData('menuItems');
    };

    // --- CRUD CATEGORIES ---
    const createCategory = async (data) => {
        await toast.promise(api.createCategory(data), {
            loading: 'Menambah kategori...',
            success: 'Kategori ditambahkan!',
            error: 'Gagal menambah kategori.'
        });
        await refreshData('categories');
    };
    
    const updateCategory = async (id, data) => {
        await toast.promise(api.updateCategory(id, data), {
            loading: 'Update kategori...',
            success: 'Kategori diperbarui!',
            error: 'Gagal update kategori.'
        });
        await refreshData('categories');
    };

    const deleteCategory = async (id) => {
        await toast.promise(api.deleteCategory(id), {
            loading: 'Menghapus kategori...',
            success: 'Kategori dihapus.',
            error: 'Gagal hapus kategori.'
        });
        await refreshData('categories');
    };

    // --- CRUD TABLES ---
    const createTable = async (data) => {
        await toast.promise(api.createTable(data), {
            loading: 'Menambah meja...',
            success: 'Meja ditambahkan!',
            error: 'Gagal menambah meja.'
        });
        await refreshData('tables');
    };
    
    const updateTable = async (id, data) => {
        await toast.promise(api.updateTable(id, data), {
            loading: 'Update meja...',
            success: 'Meja diperbarui!',
            error: 'Gagal update meja.'
        });
        await refreshData('tables');
    };

    const deleteTable = async (id) => {
        await toast.promise(api.deleteTable(id), {
            loading: 'Menghapus meja...',
            success: 'Meja dihapus.',
            error: 'Gagal hapus meja.'
        });
        await refreshData('tables');
    };

    const value = {
        ...state,
        loading,
        error,
        refreshData,
        // Users
        createUser, updateUser, deleteUser,
        // Menu Items
        createMenuItem, updateMenuItem, deleteMenuItem,
        // Categories
        createCategory, updateCategory, deleteCategory,
        // Tables
        diningTables: state.tables, 
        createTable, updateTable, deleteTable,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);