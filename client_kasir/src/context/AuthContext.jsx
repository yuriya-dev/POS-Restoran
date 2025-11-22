import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Inisialisasi default null untuk mendeteksi missing provider
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek localStorage saat aplikasi dimuat
        const storedUser = localStorage.getItem('pos_kasir_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Gagal parse user", e);
                localStorage.removeItem('pos_kasir_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.login({ username, password });
            if (res.data.success) {
                const userData = res.data.user;
                // Validasi: Hanya kasir atau admin yang boleh masuk sini
                if (userData.role !== 'kasir' && userData.role !== 'admin') {
                    throw new Error("Akses ditolak. Akun ini bukan untuk POS Kasir.");
                }
                
                setUser(userData);
                localStorage.setItem('pos_kasir_user', JSON.stringify(userData));
                return true;
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login gagal';
            throw msg;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pos_kasir_user');
    };

    // Jangan render children sampai status auth selesai dicek (loading false)
    // Ini penting agar ProtectedRoute tidak salah melempar ke login
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading POS...</div>;
    }

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider. Cek wrapping di App.jsx.');
    }
    return context;
};