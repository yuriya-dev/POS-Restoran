import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

// Pages & Components
import Login from './pages/Login';
import TableMap from './pages/TableMap';
import OrderPage from './pages/OrderPage';
import ShiftDashboard from './pages/ShiftDashboard';
import KitchenPage from './pages/KitchenPage';
import HistoryPage from './pages/HistoryPage';
import KasirLayout from './components/KasirLayout';

// Title Updater untuk Kasir
const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const baseTitle = 'POS Kasir';
        let pageTitle = '';

        // Logic Judul Halaman Kasir
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
    
    // Jika tidak ada user, lempar ke login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    // Jika ada anak (children), render anak tersebut. Jika tidak, render Outlet (untuk nested routes)
    return children ? children : <Outlet />;
};

const App = () => {
    return (
        <AuthProvider>
            <SettingsProvider>
                <CartProvider>
                    <BrowserRouter>
                        {/* TitleUpdater */}
                        <TitleUpdater />

                        <Routes>
                            {/* Route Public */}
                            <Route path="/login" element={<Login />} />

                            {/* Route Protected: Semua halaman di dalam ini butuh login */}
                            <Route element={<ProtectedRoute><KasirLayout /></ProtectedRoute>}>
                                {/* Halaman Utama: Denah Meja */}
                                <Route index element={<TableMap />} />
                                
                                {/* Halaman Order (POS) */}
                                <Route path="/order/:tableId" element={<OrderPage />} />
                                
                                {/* Halaman Shift & Laporan */}
                                <Route path="/shift" element={<ShiftDashboard />} />

                                {/* Halaman Kitchen */}
                                <Route path="/kitchen" element={<KitchenPage />} />

                                {/* Halaman History */}
                                <Route path="/history" element={<HistoryPage />} />
                            </Route>

                            {/* Catch-all Redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;