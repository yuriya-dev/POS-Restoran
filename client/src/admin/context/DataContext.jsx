import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../../shared/services/api'; // Import API Service yang baru dibuat
import toast from 'react-hot-toast';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // 1. State awal array kosong (karena data belum ditarik dari server)
    const [state, setState] = useState({
        users: [],
        menuItems: [],
        categories: [],
        orders: [],
        tables: [], 
    });
    const [loading, setLoading] = useState(true); // Default true saat load awal
    const [error, setError] = useState(null);

    // 2. Fungsi Load Data Utama (Mengambil semua data sekaligus saat start)
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            // Promise.all agar request berjalan paralel (lebih cepat)
            const [usersRes, menusRes, catsRes, ordersRes, tablesRes] = await Promise.all([
                api.getUsers().catch(() => ({ data: [] })), // Fallback empty array jika error
                api.getMenuItems(),
                api.getCategories(),
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

    // Jalankan saat komponen di-mount
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Helper untuk refresh entity tertentu saja
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

    // --- CRUD USERS (KARYAWAN) ---
    // Create User (Register)
    const createUser = async (userData) => {
        await toast.promise(
            api.register(userData),
            {
                loading: 'Menambahkan karyawan...',
                success: 'Karyawan berhasil ditambahkan!',
                error: (err) => err.response?.data?.message || 'Gagal menambahkan karyawan.'
            }
        );
        await refreshData('users');
    };

    const updateUser = async (id, userData) => {
        await toast.promise(
            api.updateUser(id, userData),
            {
                loading: 'Memperbarui data...',
                success: 'Data karyawan diperbarui!',
                error: 'Gagal update data.'
            }
        );
        await refreshData('users');
    };

    // Delete User
const deleteUser = async (id) => {
        await toast.promise(
            api.deleteUser(id),
            {
                loading: 'Menghapus karyawan...',
                success: 'Karyawan dihapus.',
                error: (err) => err.response?.data?.message || 'Gagal menghapus.'
            }
        );
        await refreshData('users');
    };

    // --- CRUD DINING TABLES ---
    const createTable = async (data) => {
        try {
            await api.createTable(data);
            await refreshData('tables'); // Refresh data dari server agar sinkron
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };
    
    const updateTable = async (id, data) => {
        try {
            await api.updateTable(id, data);
            await refreshData('tables');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteTable = async (id) => {
        try {
            await api.deleteTable(id);
            await refreshData('tables');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // --- CRUD MENU CATEGORIES ---
    const createCategory = async (data) => {
        await toast.promise(
            api.createCategory(data),
            {
                loading: 'Menambahkan kategori...',
                success: 'Kategori berhasil ditambahkan!',
                error: (err) => err.response?.data?.message || 'Gagal menambahkan.'
            }
        );
        await refreshData('categories');
    };
    
    const updateCategory = async (id, data) => {
        await toast.promise(
            api.updateCategory(id, data),
            {
                loading: 'Menyimpan perubahan...',
                success: 'Kategori berhasil diperbarui!',
                error: (err) => err.response?.data?.message || 'Gagal update.'
            }
        );
        await refreshData('categories');
    };

    const deleteCategory = async (id) => {
        await toast.promise(
            api.deleteCategory(id),
            {
                loading: 'Menghapus kategori...',
                success: 'Kategori dihapus.',
                error: (err) => err.response?.data?.message || 'Gagal menghapus.'
            }
        );
        await refreshData('categories');
    };

    // --- CRUD MENU ITEMS ---
    // Tidak perlu getMenuItems manual karena sudah ada di state & refreshData
    
    const createMenuItem = async (data) => {
        try {
            await api.createMenuItem(data);
            await refreshData('menuItems');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const updateMenuItem = async (id, data) => {
        try {
            await api.updateMenuItem(id, data);
            await refreshData('menuItems');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteMenuItem = async (id) => {
        try {
            await api.deleteMenuItem(id);
            await refreshData('menuItems');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };
    
    // --- VALUE EXPORT ---
    const value = {
        ...state,
        loading,
        error,
        refreshData,
        // Users (Employees)
        createUser,
        updateUser,
        deleteUser,
        // Categories
        createCategory, updateCategory, deleteCategory,
        // Menu Items
        createMenuItem, updateMenuItem, deleteMenuItem, // +createMenuItem
        // Dining Tables
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