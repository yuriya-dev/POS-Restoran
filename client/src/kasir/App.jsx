import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import TableMap from './pages/TableMap';
import OrderPage from './pages/OrderPage';
import ShiftDashboard from './pages/ShiftDashboard';
import KitchenPage from './pages/KitchenPage';
import HistoryPage from './pages/HistoryPage';

// Components
import KasirLayout from './components/KasirLayout';

// Title Updater untuk Kasir
const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const baseTitle = 'POS Kasir';
        let pageTitle = '';

        if (path === '/login') pageTitle = 'Login Kasir';
        else if (path === '/') pageTitle = 'Denah Meja';
        else if (path.startsWith('/order/')) pageTitle = 'Order Pesanan';
        else if (path === '/shift') pageTitle = 'Shift & Laporan';
        else if (path === '/kitchen') pageTitle = 'Monitor Dapur';
        else if (path === '/history') pageTitle = 'Riwayat Transaksi';
        
        document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
    }, [location]);

    return null;
};

// Komponen Penjaga (Satpam)
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children ? children : <Outlet />;
};

const KasirApp = () => {
    return (
        <CartProvider>
            <BrowserRouter>
                <TitleUpdater />

                <Routes>
                    <Route element={<ProtectedRoute><KasirLayout /></ProtectedRoute>}>
                        <Route index element={<TableMap />} />
                        <Route path="/order/:tableId" element={<OrderPage />} />
                        <Route path="/shift" element={<ShiftDashboard />} />
                        <Route path="/kitchen" element={<KitchenPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
};

export default KasirApp;
