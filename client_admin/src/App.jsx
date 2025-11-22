// src/App.jsx (atau router.jsx)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import TableManagement from './pages/TableManajement'; // Pastikan nama file sesuai
import Employees from './pages/Employees'; 
import Settings from './pages/Settings';
import Reports from './pages/Reports';

// --- Components ---
import AdminLayout from './components/layout/AdminLayout';

// --- Komponen Protected Route yang Ditingkatkan ---
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    // 1. Tampilkan Loading Spinner saat cek session (PENTING agar tidak auto-logout saat refresh)
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 2. Cek Autentikasi
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Cek Role (Opsional)
    // Asumsi user.role berasal dari database tabel 'users'
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Jika role tidak cocok (misal Kasir coba buka halaman Admin), lempar ke Dashboard
        return <Navigate to="/" replace />; 
    }

    // Render halaman jika aman (support Outlet untuk parent route atau children untuk wrapping langsung)
    return children ? children : <Outlet />;
};

const App = () => {
    return (
        // Urutan Provider: Auth (User) -> Settings (Global Config) -> Data (App Data)
        <AuthProvider>
            <SettingsProvider>
                <DataProvider>
                    <BrowserRouter>
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
                                {/* Dashboard (Bisa diakses semua role) */}
                                <Route index element={<Dashboard />} />
                                
                                {/* Manajemen (Bisa diakses semua role) */}
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