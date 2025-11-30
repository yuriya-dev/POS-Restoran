import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Utensils, ChefHat, History as HistoryIcon, Moon, Sun, Menu, X } from 'lucide-react'; // ✅ Tambah Menu & X
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import ConfirmModal from '../../shared/components/common/ConfirmModal';

const KasirLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State untuk Modal Logout
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    // ✅ State untuk Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State Dark Mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // Effect untuk apply class 'dark' ke HTML element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    
    const handleLogoutClick = () => setIsLogoutModalOpen(true);

    const confirmLogout = () => {
        logout();
        navigate('/login');
        setIsLogoutModalOpen(false);
    };

    // Cek apakah halaman saat ini adalah halaman Order
    const isOrderPage = location.pathname.startsWith('/order/');

    // Komponen Link Navigasi Custom (Updated untuk support onClick di mobile)
    const NavItem = ({ to, icon: Icon, label, onClick }) => {
        const isActive = location.pathname === to;
        return (
            <Link 
                to={to} 
                onClick={onClick}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2
                    ${isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
            >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] dark:bg-gray-900 flex flex-col transition-colors duration-200 font-sans">
            {/* Header hanya ditampilkan jika BUKAN halaman Order */}
            {!isOrderPage && (
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm transition-colors duration-200">
                    
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {/* ✅ Tombol Hamburger (Mobile Only) */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            {/* Logo & Brand */}
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                                    <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">POS Kasir</h1>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Restaurant</p>
                                </div>
                            </div>

                            {/* Menu Navigasi Desktop (Hidden on Mobile) */}
                            <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-700 ml-4">
                                <NavItem to="/" icon={Utensils} label="Order" />
                                <NavItem to="/shift" icon={LayoutDashboard} label="Shift" />
                                <NavItem to="/history" icon={HistoryIcon} label="Riwayat" />
                                <NavItem to="/kitchen" icon={ChefHat} label="Dapur" />
                            </nav>
                        </div>

                        {/* Area Kanan: User, Theme, Logout */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            
                            {/* Toggle Dark Mode */}
                            <button 
                                onClick={toggleDarkMode}
                                className="p-2 sm:p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-all duration-200 focus:outline-none active:scale-95"
                                title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                            {/* User Profile Info (Desktop Only) */}
                            <div className="hidden sm:flex flex-col items-end">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{user?.fullName || user?.username}</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-100 dark:border-blue-800">
                                    {user?.role}
                                </span>
                            </div>
                            
                            {/* Tombol Logout */}
                            <button 
                                onClick={handleLogoutClick}
                                className="group flex items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 active:scale-95"
                                title="Keluar"
                            >
                                <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                <span className="hidden sm:block font-bold text-sm">Keluar</span>
                            </button>
                        </div>
                    </div>

                    {/* ✅ Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-5 fade-in duration-200">
                            <div className="flex flex-col gap-2">
                                {/* Tampilkan Info User di Mobile */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl mb-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
                                        {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">{user?.fullName || user?.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{user?.role}</p>
                                    </div>
                                </div>

                                <NavItem to="/" icon={Utensils} label="Order" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavItem to="/shift" icon={LayoutDashboard} label="Shift" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavItem to="/history" icon={HistoryIcon} label="Riwayat" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavItem to="/kitchen" icon={ChefHat} label="Dapur" onClick={() => setIsMobileMenuOpen(false)} />
                            </div>
                        </div>
                    )}
                </header>
            )}

            {/* Main Content Area */}
            <main className="flex-grow h-full overflow-hidden relative z-0">
                <Outlet />
            </main>

            {/* Modal Konfirmasi Logout */}
            <ConfirmModal 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Konfirmasi Logout"
                message="Apakah Anda yakin ingin keluar dari sesi kasir ini?"
                confirmText="Ya, Keluar"
                cancelText="Batal"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
            />
        </div>
    );
};

export default KasirLayout;