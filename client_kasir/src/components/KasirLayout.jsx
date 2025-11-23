import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Utensils, ChefHat, History, Menu } from 'lucide-react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';

const KasirLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-20">

                {/* Left: Logo */}
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-800 hidden sm:block">POS Kasir</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-lg">
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

                {/* Right Side (Profile + Logout) */}
                <div className="flex items-center space-x-3">

                    {/* Profile - Desktop only */}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.fullName || user?.username}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{user?.role}</p>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Keluar"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {open && (
                <div className="sm:hidden bg-white border-b px-4 py-3 space-y-2 shadow-md animate-fadeIn">
                    <Link 
                        onClick={() => setOpen(false)}
                        to="/"
                        className={`block px-3 py-2 rounded-md font-medium ${
                            location.pathname === '/' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Order
                    </Link>

                    <Link 
                        onClick={() => setOpen(false)}
                        to="/shift"
                        className={`block px-3 py-2 rounded-md font-medium ${
                            location.pathname === '/shift' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Shift
                    </Link>

                    <Link 
                        onClick={() => setOpen(false)}
                        to="/history"
                        className={`block px-3 py-2 rounded-md font-medium ${
                            location.pathname === '/history' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Riwayat
                    </Link>

                    <Link 
                        onClick={() => setOpen(false)}
                        to="/kitchen"
                        className={`block px-3 py-2 rounded-md font-medium ${
                            location.pathname === '/kitchen' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Dapur
                    </Link>
                </div>
            )}

            <main className="grow h-full overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default KasirLayout;
