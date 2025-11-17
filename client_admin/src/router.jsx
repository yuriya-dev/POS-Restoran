// router.jsx (Versi Final)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuItems from './pages/MenuItems';
import Settings from './pages/Settings';
import MenuCategories from './pages/MenuCategories'; 
import Employees from './pages/Employees'; 
import Reports from './pages/Reports'; // Laporan Penjualan

import AdminLayout from './components/layout/AdminLayout';
import { useAuth } from './context/AuthContext';

// Komponen Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth(); // Asumsi useAuth mengembalikan user object

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role check (jika diperlukan)
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect non-admin user ke dashboard
        return <Navigate to="/" replace />; 
    }

    return children;
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route 
                    path="/" 
                    element={
                        // Semua yang ada di AdminLayout adalah rute yang dilindungi
                        <ProtectedRoute allowedRoles={['admin', 'kasir']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    
                    {/* Rute Manajemen */}
                    <Route path="menu" element={<MenuItems />} />
                    <Route path="categories" element={<MenuCategories />} />
                    
                    {/* Rute Khusus Admin */}
                    <Route path="employees" element={<ProtectedRoute allowedRoles={['admin']}><Employees /></ProtectedRoute>} />
                    <Route path="settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
                    
                    {/* Rute Laporan */}
                    <Route path="reports" element={<Reports />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;