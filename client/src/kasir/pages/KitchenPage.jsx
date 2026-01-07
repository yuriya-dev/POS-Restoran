import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../shared/services/api';
import { useNotification } from '../../shared/context/NotificationContext';
import { ChefHat, Clock, CheckCircle, RefreshCw, Utensils, Timer, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const { addNotification } = useNotification();

    // 1. Fetch Orders dengan Logika Offline Fallback + Merge Local Data
    const fetchOrders = useCallback(async () => {
        let serverData = [];
        let offlineData = [];

        // A. Ambil Data Offline Lokal (Pesanan yang belum tersync)
        try {
            const localOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
            // Mapping format local order agar sesuai tampilan dapur
            offlineData = localOrders.map(o => ({
                ...o,
                orderId: `OFF-${o.tempId}`, // ID Sementara
                dailyNumber: 'OFF',         // Penanda Offline
                createdAt: o.savedAt || new Date().toISOString(),
                isOffline: true,            // Flag khusus
                items: o.items.map(i => ({  // Normalisasi nama field item
                    itemName: i.name,
                    quantity: i.quantity,
                    notes: i.notes
                }))
            }));
        } catch (e) {
            console.error("Gagal baca offline storage", e);
        }

        // B. Ambil Data Server
        try {
            const res = await api.getKitchenOrders();
            serverData = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            
            // SUKSES: Update Cache
            localStorage.setItem('cached_kitchen_orders', JSON.stringify(serverData));

        } catch (_err) {
            console.warn("Koneksi server dapur gagal:", _err);

            // ERROR: Ambil dari Cache Server terakhir
            const cachedData = localStorage.getItem('cached_kitchen_orders');
            if (cachedData) {
                serverData = JSON.parse(cachedData);
                if (!navigator.onLine) { 
                    toast("Mode Offline Aktif", {
                        icon: <WifiOff className="w-4 h-4 text-orange-500" />,
                        style: { borderRadius: '10px', background: '#333', color: '#fff' },
                    });
                }
            }
        } finally {
            // C. GABUNGKAN DATA (Lokal di atas, Server di bawah)
            // Filter agar tidak ada duplikasi jika sync baru saja terjadi
            const combinedOrders = [...offlineData, ...serverData];
            
            // Sortir berdasarkan waktu (FIFO - First In First Out)
            combinedOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            setOrders(combinedOrders);
            setLoading(false);
        }
    }, []);

    // Auto Refresh setiap 30 detik
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handleComplete = async (orderId, isOffline) => {
        if (isOffline) {
            toast.error("Pesanan Offline belum masuk server. Lakukan Sync dulu di kasir!", {
                icon: <WifiOff className="text-red-500"/>
            });
            return;
        }

        if (!navigator.onLine) {
            toast.error("Tidak bisa update status saat Offline!", {
                icon: <WifiOff className="text-red-500" />
            });
            return;
        }

        setProcessingId(orderId);
        try {
            await api.completeOrder(orderId);
            toast.success(`Order #${orderId} Selesai!`);
            
            // 🔔 Tambahkan notifikasi
            addNotification(
                `✅ Pesanan #${orderId} sudah selesai dimasak!`,
                'success',
                5000,
                {
                    label: 'Lihat Detail',
                    onClick: () => window.location.href = `/`
                }
            );
            
            fetchOrders(); // Refresh list segera
        } catch (err) {
            console.error("Error updating order status:", err);
            toast.error("Gagal update status");
            addNotification("Gagal menyelesaikan pesanan", 'error', 4000);
        } finally {
            setProcessingId(null);
        }
    };

    const getTimeElapsed = (dateString) => {
        const diff = new Date() - new Date(dateString);
        const minutes = Math.floor(diff / 60000);
        return `${minutes} mnt`;
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[80vh] text-gray-400 dark:text-gray-500 bg-[#F5F7FA] dark:bg-gray-900 transition-colors">
            <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="font-medium">Memuat Pesanan Dapur...</p>
        </div>
    );

    return (
        <div className="p-6 sm:p-8 min-h-screen bg-[#F5F7FA] dark:bg-gray-900 transition-colors duration-200 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center tracking-tight">
                        <ChefHat className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-500" />
                        Monitor Dapur
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Pantau dan selesaikan pesanan yang masuk secara real-time.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-2xl font-bold shadow-sm border border-blue-200 dark:border-blue-800/50">
                        {orders.length} Pesanan Antre
                    </span>
                    <button 
                        onClick={() => { setLoading(true); fetchOrders(); }}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all active:scale-95"
                        title="Refresh Data"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
                    <Utensils className="w-24 h-24 mb-4 opacity-20" />
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Semua pesanan sudah selesai!</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Menunggu pesanan baru masuk...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className={`
                            rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col group
                            ${order.isOffline 
                                ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
                        `}>
                            {/* Header Kartu */}
                            <div className={`p-5 border-b flex justify-between items-start rounded-t-[2rem] ${order.isOffline ? 'border-orange-200 bg-orange-100/50' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30'}`}>
                                <div>
                                    <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">
                                        {order.isOffline ? '⚠️ OFFLINE' : `#${order.dailyNumber || order.orderId}`}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5">{order.orderName}</p>
                                </div>
                                <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                    <Timer className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                                    {getTimeElapsed(order.createdAt)}
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="p-5 flex-grow overflow-y-auto max-h-80 custom-scrollbar">
                                <ul className="space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <li key={idx} className="flex flex-col border-b border-dashed border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-900 dark:text-white text-lg w-8 shrink-0">{item.quantity}x</span>
                                                <span className="flex-grow text-gray-700 dark:text-gray-300 font-medium leading-snug">{item.itemName}</span>
                                            </div>
                                            
                                            {item.notes && (
                                                <div className="mt-2 ml-8">
                                                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 px-3 py-1.5 rounded-lg inline-block">
                                                        📝 {item.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer Action */}
                            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 mt-auto rounded-b-[2rem]">
                                <button
                                    onClick={() => handleComplete(order.orderId, order.isOffline)}
                                    disabled={processingId === order.orderId || order.isOffline}
                                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                                        order.isOffline 
                                            ? 'bg-gray-400 text-white' 
                                            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                                    }`}
                                >
                                    {processingId === order.orderId ? (
                                        <span className="flex items-center">
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                                        </span>
                                    ) : (
                                        <>
                                            {order.isOffline ? <WifiOff className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                                            {order.isOffline ? 'Menunggu Sync' : 'Selesai Masak'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenPage;