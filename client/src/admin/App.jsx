import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../shared/context/AuthContext';
import { DataProvider } from './context/DataContext';

// ✅ LAZY LOADING: Code splitting untuk mengurangi initial bundle
// Pages akan di-load hanya saat route diakses
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MenuItems = lazy(() => import('./pages/MenuItems'));
const MenuCategories = lazy(() => import('./pages/MenuCategories'));
const TableManagement = lazy(() => import('./pages/TableManajement'));
const Employees = lazy(() => import('./pages/Employees'));
const Settings = lazy(() => import('./pages/Settings'));
const Reports = lazy(() => import('./pages/Reports'));

// Components
import AdminLayout from './components/layout/AdminLayout';

// ✅ Loading Component untuk lazy loaded pages
const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

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

    return null;
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

const AdminApp = () => {
    return (
        <DataProvider>
            <BrowserRouter>
                <TitleUpdater />
                
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'kasir']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={
                            <Suspense fallback={<PageLoader />}>
                                <Dashboard />
                            </Suspense>
                        } />
                        <Route path="menu" element={
                            <Suspense fallback={<PageLoader />}>
                                <MenuItems />
                            </Suspense>
                        } />
                        <Route path="categories" element={
                            <Suspense fallback={<PageLoader />}>
                                <MenuCategories />
                            </Suspense>
                        } />
                        <Route path="tables" element={
                            <Suspense fallback={<PageLoader />}>
                                <TableManagement />
                            </Suspense>
                        } />
                        <Route path="reports" element={
                            <Suspense fallback={<PageLoader />}>
                                <Reports />
                            </Suspense>
                        } />
                        
                        <Route 
                            path="employees" 
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Employees />
                                    </Suspense>
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="settings" 
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Settings />
                                    </Suspense>
                                </ProtectedRoute>
                            } 
                        />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </DataProvider>
    );
};

export default AdminApp;
