// ./api/db.js (Versi Final yang Direvisi)

import { initialDbState } from './data'; // <-- Menggunakan IMPORT ES Module

const DB_KEY = 'pos_restaurant_db';

const loadDb = () => {
    const storedDb = localStorage.getItem(DB_KEY);
    if (storedDb) {
        return JSON.parse(storedDb);
    }
    
    // Jika tidak ada data, inisialisasi dengan data dummy dari import
    saveDb(initialDbState);
    return initialDbState;
};

const saveDb = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Panggil loadDb untuk inisialisasi dan memuat data
const db = loadDb();

export const getAll = (entity) => {
    return db[entity] || [];
};

export const findById = (entity, id, key = 'id') => {
    return (db[entity] || []).find(item => item[key] === id);
};

export const create = (entity, data, idKey = 'id') => {
    // Penambahan ID: Gunakan waktu sebagai dasar ID yang lebih unik
    const newId = `${entity.slice(0, 1)}${Date.now().toString().slice(-6)}`;
    const newItem = { 
        [idKey]: newId, 
        ...data, 
        created_at: new Date().toISOString() 
    };
    db[entity] = [...(db[entity] || []), newItem];
    saveDb(db);
    return newItem;
};

export const update = (entity, id, data, idKey = 'id') => {
    const index = (db[entity] || []).findIndex(item => item[idKey] === id);
    if (index !== -1) {
        // Buat salinan dan perbarui item
        db[entity] = db[entity].map((item, idx) => {
            if (idx === index) {
                return { ...item, ...data, updated_at: new Date().toISOString() };
            }
            return item;
        });
        saveDb(db);
        return db[entity][index]; // Mengembalikan item yang diperbarui
    }
    return null;
};

export const remove = (entity, id, idKey = 'id') => {
    const initialLength = (db[entity] || []).length;
    db[entity] = (db[entity] || []).filter(item => item[idKey] !== id);
    saveDb(db);
    return (db[entity] || []).length !== initialLength;
};

// Khusus untuk Settings (non-array entity)
export const getSettings = () => db.settings;

export const updateSettings = (newSettings) => {
    db.settings = { ...db.settings, ...newSettings };
    saveDb(db);
    return db.settings;
};

// Export semua fungsi sebagai dbFunctions
export const dbFunctions = {
    getAll,
    findById,
    create,
    update,
    remove,
    getSettings,
    updateSettings,
};
// Catatan: Jika Anda ingin mengimpor fungsi ini sebagai satu objek di Context, 
// Anda mungkin ingin menambahkan 'export default dbFunctions;'
// Namun, jika Anda menggunakan import { getAll, create } from './db', 
// struktur ini sudah benar.