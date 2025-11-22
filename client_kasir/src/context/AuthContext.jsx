import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(undefined); // ✅ Set initial value to undefined

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('pos_kasir_user');
        if (stored) setUser(JSON.parse(stored));
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.login({ username, password });
            if (res.data.success) {
                const userData = res.data.user;
                // Validasi Role: Hanya Kasir (atau Admin) yang boleh masuk POS
                if (userData.role !== 'kasir' && userData.role !== 'admin') {
                    throw new Error("Akses ditolak. Bukan akun kasir.");
                }
                setUser(userData);
                localStorage.setItem('pos_kasir_user', JSON.stringify(userData));
                return true;
            }
        } catch (err) {
            throw err.response?.data?.message || err.message;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pos_kasir_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // ✅ Tambahkan pengecekan ini
    if (context === undefined) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider. Cek App.jsx.');
    }
    return context;
}