import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages & Components
import Login from './pages/Login';
import TableMap from './pages/TableMap';
import OrderPage from './pages/OrderPage';
import ShiftDashboard from './pages/ShiftDashboard';
import KitchenPage from './pages/KitchenPage';
import KasirLayout from './components/KasirLayout';

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
            <CartProvider>
                <BrowserRouter>
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
                        </Route>

                        {/* Catch-all Redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;