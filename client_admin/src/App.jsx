import React, { useEffect } from 'react';
import './index.css';

import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Context Providers (WAJIB ADA) ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SettingsProvider } from './context/SettingsContext';

// --- Pages ---
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuItems from './pages/MenuItems';
import MenuCategories from './pages/MenuCategories'; 
import TableManagement from './pages/TableManajement'; 
import Employees from './pages/Employees'; 
import Settings from './pages/Settings';
import Reports from './pages/Reports';

// --- Components ---
import AdminLayout from './components/layout/AdminLayout';

// ✅ KOMPONEN BARU: Update Judul Website Otomatis
const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const baseTitle = 'POS Restoran';
        let pageTitle = '';

        switch(path) {
            case '/': pageTitle = 'Dashboard'; break;
            case '/login': pageTitle = 'Login Staff'; break;
            case '/menu': pageTitle = 'Manajemen Menu'; break;
            case '/categories': pageTitle = 'Kategori Menu'; break;
            case '/tables': pageTitle = 'Denah Meja'; break;
            case '/reports': pageTitle = 'Laporan Penjualan'; break;
            case '/employees': pageTitle = 'Kelola Karyawan'; break;
            case '/settings': pageTitle = 'Pengaturan Toko'; break;
            default: pageTitle = '';
        }

        document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
    }, [location]);

    return null; // Komponen ini tidak merender visual apa-apa
};

// --- Komponen Protected Route ---
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; 
    }

    return children ? children : <Outlet />;
};

const App = () => {
    return (
        <AuthProvider>
            <SettingsProvider>
                <DataProvider>
                    <BrowserRouter>
                        {/* ✅ Pasang TitleUpdater di dalam BrowserRouter */}
                        <TitleUpdater />
                        
                        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                        
                        <Routes>
                            {/* Route Public */}
                            <Route path="/login" element={<Login />} />
                            
                            {/* Route Protected (Semua halaman admin) */}
                            <Route 
                                path="/" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'kasir']}>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }
                            >
                                {/* Dashboard */}
                                <Route index element={<Dashboard />} />
                                
                                {/* Manajemen */}
                                <Route path="menu" element={<MenuItems />} />
                                <Route path="categories" element={<MenuCategories />} />
                                <Route path="tables" element={<TableManagement />} />
                                <Route path="reports" element={<Reports />} />
                                
                                {/* --- Rute Khusus ADMIN --- */}
                                <Route 
                                    path="employees" 
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <Employees />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="settings" 
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <Settings />
                                        </ProtectedRoute>
                                    } 
                                />
                            </Route>

                            {/* Redirect 404 ke Dashboard */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </DataProvider>
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;