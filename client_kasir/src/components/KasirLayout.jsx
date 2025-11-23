import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Utensils, ChefHat, History } from 'lucide-react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';

const KasirLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Handler Logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-20">
                
                {/* Logo & Navigasi Kiri */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">POS Kasir</h1>
                    </div>

                    {/* Menu Navigasi */}
                    <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <Link 
                            to="/" 
                            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                                location.pathname === '/' 
                                ? 'bg-white text-blue-700 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            <Utensils className="w-4 h-4 mr-2" /> Order
                        </Link>
                        <Link 
                            to="/shift" 
                            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                                location.pathname === '/shift' 
                                ? 'bg-white text-blue-700 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Shift
                        </Link>
                        <Link 
                            to="/history" 
                            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                                location.pathname === '/history' 
                                ? 'bg-white text-blue-700 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                        <History className="w-4 h-4 mr-2" /> Riwayat
                        </Link>
                        <Link 
                            to="/kitchen" 
                            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                                location.pathname === '/kitchen' 
                                ? 'bg-white text-blue-700 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            <ChefHat className="w-4 h-4 mr-2" /> Dapur
                        </Link>
                    </nav>
                </div>

                {/* Profil & Logout Kanan */}
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.fullName || user?.username}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Keluar"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Konten Halaman */}
            <main className="grow h-full overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default KasirLayout;