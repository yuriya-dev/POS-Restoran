import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as db from '../api/db';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [state, setState] = useState({
        users: db.getAll('users'),
        menuItems: db.getAll('menu_items'),
        categories: db.getAll('menu_categories'),
        orders: db.getAll('orders'),
        // Kunci 'diningTables' diubah menjadi 'tables' agar konsisten dengan state
        tables: db.getAll('dining_tables'), 
    });
    const [loading, setLoading] = useState(false);

    const refreshData = useCallback((entity) => {
        setLoading(true);
        // Simulasi delay
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                [entity]: db.getAll(entity)
            }));
            setLoading(false);
        }, 100);
    }, []);

    // --- CRUD DINING TABLES ---
    const createTable = async (data) => {
        // ID meja harus unik, menggunakan 'meja_id' sebagai kunci
        const newTable = db.create('dining_tables', data, 'meja_id'); 
        refreshData('tables');
        return newTable;
    };
    
    const updateTable = async (id, data) => {
        // Menggunakan 'meja_id' sebagai kunci update
        const updatedTable = db.update('dining_tables', id, data, 'meja_id');
        refreshData('tables');
        return updatedTable;
    };

    const deleteTable = async (id) => {
        // Menggunakan 'meja_id' sebagai kunci hapus
        const success = db.remove('dining_tables', id, 'meja_id');
        if(success) refreshData('tables');
        return success;
    };


    // --- CRUD MENU CATEGORIES ---
    const createCategory = async (data) => {
        const newCat = db.create('menu_categories', data, 'kategori_id');
        refreshData('categories');
        return newCat;
    };
    
    const updateCategory = async (id, data) => {
        const updatedCat = db.update('menu_categories', id, data, 'kategori_id');
        refreshData('categories');
        return updatedCat;
    };

    const deleteCategory = async (id) => {
        const success = db.remove('menu_categories', id, 'kategori_id');
        if(success) refreshData('categories');
        return success;
    };

    // --- CRUD MENU ITEMS (placeholder) ---
    const getMenuItems = useCallback(() => refreshData('menuItems'), [refreshData]);
    
    const updateMenuItem = async (item) => {
        const updatedItem = db.update('menu_items', item.item_id, item, 'item_id');
        refreshData('menuItems');
        return updatedItem;
    };

    const deleteMenuItem = async (id) => {
        const success = db.remove('menu_items', id, 'item_id');
        if(success) refreshData('menuItems');
        return success;
    };
    
    // --- VALUE EXPORT ---
    const value = {
        ...state,
        loading,
        refreshData,
        // Categories
        createCategory, updateCategory, deleteCategory,
        // Menu Items
        getMenuItems, updateMenuItem, deleteMenuItem,
        // Dining Tables (Baru Ditambahkan)
        diningTables: state.tables, // Menggunakan alias untuk kemudahan akses di komponen
        createTable, updateTable, deleteTable,
        // Others (Users, Orders, etc. will be added here)
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);