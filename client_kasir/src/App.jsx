import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import TableMap from './pages/TableMap';
import MenuPage from './pages/MenuPage';
import KasirLayout from './components/KasirLayout'; 

// Simple Protected Route
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Route Utama yang Dilindungi */}
                <Route element={<ProtectedRoute><KasirLayout /></ProtectedRoute>}>
                    {/* Landing page setelah login adalah Denah Meja */}
                    <Route index element={<TableMap />} /> 
                    
                    {/* Halaman Order (diasumsikan route-nya nanti /order/:tableId) */}
                    <Route path="/order/:tableId" element={<MenuPage />} /> 
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;