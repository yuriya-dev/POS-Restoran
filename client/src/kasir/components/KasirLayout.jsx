import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { api } from '../../shared/services/api'; // Import API untuk sync
import { LogOut, LayoutDashboard, Utensils, ChefHat, History as HistoryIcon, Moon, Sun, Menu, X, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import ConfirmModal from '../../shared/components/common/ConfirmModal';
import NotificationCenter from '../../shared/components/NotificationCenter';
import NotificationDropdown from '../../shared/components/common/NotificationDropdown';
import { useNotification } from '../../shared/context/NotificationContext';
import toast from 'react-hot-toast';

const KasirLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications, removeNotification, clearAll } = useNotification();

    // State UI
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

    // State Offline Mode
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineCount, setOfflineCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    // Effect: Theme
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Effect: Deteksi Koneksi & Data Offline
    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);
        
        const checkOfflineData = () => {
            const data = JSON.parse(localStorage.getItem('offline_orders') || '[]');
            setOfflineCount(data.length);
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        // Polling cek localStorage setiap 2 detik (agar angka update realtime saat order disimpan)
        const interval = setInterval(checkOfflineData, 2000);
        checkOfflineData(); // Cek awal

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
            clearInterval(interval);
        };
    }, []);

    // Fungsi Sync Data
    const handleSync = async () => {
        if (!isOnline) return toast.error("Masih offline! Cari sinyal dulu.");
        
        const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
        if (offlineOrders.length === 0) return;

        setIsSyncing(true);
        const toastId = toast.loading("Mengupload data offline...");
        
        let failedOrders = [];

        for (const order of offlineOrders) {
            try {
                // Bersihkan properti temp sebelum kirim ke server
                const { tempId: _, isOffline: __, savedAt: ___, ...payload } = order;
                await api.createOrder(payload);
                // Successfully synced
            } catch (error) {
                console.error("Gagal sync order:", error);
                failedOrders.push(order); // Kembalikan ke antrian jika gagal
            }
        }

        // Update LocalStorage dengan sisa yang gagal (jika ada)
        if (failedOrders.length > 0) {
            localStorage.setItem('offline_orders', JSON.stringify(failedOrders));
            toast.error(`Sync selesai sebagian. ${failedOrders.length} gagal.`, { id: toastId });
        } else {
            localStorage.removeItem('offline_orders');
            toast.success("Semua data tersinkronisasi!", { id: toastId });
        }
        
        setOfflineCount(failedOrders.length);
        setIsSyncing(false);
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleLogoutClick = () => setIsLogoutModalOpen(true);
    const confirmLogout = () => {
        logout();
        navigate('/login');
        setIsLogoutModalOpen(false);
    };

    const isOrderPage = location.pathname.startsWith('/order/');

    // Helper Nav Item
    const NavItem = ({ to, icon: IconComponent, label, onClick }) => {
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
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] dark:bg-gray-900 flex flex-col transition-colors duration-200 font-sans">
            
            {/* Notification Center */}
            <NotificationCenter 
                notifications={notifications}
                onRemove={(id) => {
                    if (id === 'all') {
                        clearAll();
                    } else {
                        removeNotification(id);
                    }
                }}
                isDarkMode={isDarkMode}
            />
            
            {/* Header */}
            {!isOrderPage && (
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm transition-colors duration-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                                    <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">POS Kasir</h1>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Restaurant</p>
                                </div>
                            </div>

                            <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-700 ml-4">
                                <NavItem to="/" icon={Utensils} label="Order" />
                                <NavItem to="/shift" icon={LayoutDashboard} label="Shift" />
                                <NavItem to="/history" icon={HistoryIcon} label="Riwayat" />
                                <NavItem to="/kitchen" icon={ChefHat} label="Dapur" />
                            </nav>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            
                            {/* ✅ NOTIFICATION BELL - Controlled mode */}
                            <NotificationDropdown 
                                notifications={notifications}
                                onRemove={removeNotification}
                                onClearAll={clearAll}
                                isOpen={isNotificationDropdownOpen}
                                onToggle={setIsNotificationDropdownOpen}
                            />

                            {/* ✅ INDIKATOR OFFLINE / SYNC */}
                            <div className={`flex items-center px-3 py-1.5 rounded-xl border transition-all ${
                                isOnline 
                                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                                    : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                            }`}>
                                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                
                                {/* Tombol Sync jika ada data offline */}
                                {offlineCount > 0 && (
                                    <button 
                                        onClick={handleSync}
                                        disabled={!isOnline || isSyncing}
                                        className="ml-2 flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                                        {isSyncing ? 'Syncing...' : `${offlineCount} Pending`}
                                    </button>
                                )}
                            </div>

                            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-all focus:outline-none active:scale-95">
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                            <div className="hidden sm:flex flex-col items-end">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{user?.fullName || user?.username}</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-100 dark:border-blue-800">{user?.role}</span>
                            </div>
                            
                            <button onClick={handleLogoutClick} className="group flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 active:scale-95">
                                <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                <span className="hidden sm:block font-bold text-sm">Keluar</span>
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-5 fade-in duration-200">
                            <div className="flex flex-col gap-2">
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

            <main className="flex-grow h-full overflow-hidden relative z-0">
                <Outlet />
            </main>

            <ConfirmModal 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Konfirmasi Keluar"
                message="Apakah Anda yakin ingin keluar dari sesi kasir ini?"
                confirmText="Ya, Keluar"
                cancelText="Batal"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
            />
        </div>
    );
};

export default KasirLayout;