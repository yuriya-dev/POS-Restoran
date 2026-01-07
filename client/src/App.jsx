import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Shared Contexts
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { SettingsProvider } from './shared/context/SettingsContext';
import { NotificationProvider } from './shared/context/NotificationContext';

// Admin App
import AdminApp from './admin/App';

// Kasir App
import KasirApp from './kasir/App';

// Login component (akan digabungkan dari kedua)
import Login from './shared/pages/Login';

const AppRouter = () => {
    const { user, loading } = useAuth();
    const [appType, setAppType] = useState(null);

    // Tentukan tipe app berdasarkan role user
    useEffect(() => {
        if (user) {
            // Jika user adalah kasir, gunakan kasir app
            // Jika user adalah admin, gunakan admin app
            if (user.role === 'kasir') {
                setAppType('kasir');
            } else if (user.role === 'admin') {
                setAppType('admin');
            } else {
                setAppType('kasir'); // default ke kasir
            }
        } else {
            setAppType(null);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Jika tidak login, tampilkan login
    if (!user) {
        return (
            <BrowserRouter>
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    // Jika sudah login, render sesuai role
    if (appType === 'kasir') {
        return <KasirApp />;
    } else if (appType === 'admin') {
        return <AdminApp />;
    }

    return null;
};

const App = () => {
    return (
        <AuthProvider>
            <SettingsProvider>
                <NotificationProvider>
                    <AppRouter />
                </NotificationProvider>
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;
