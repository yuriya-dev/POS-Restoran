import React, { useState, useEffect } from 'react';
import { api } from '../../shared/services/api';
import { ChefHat, Clock, CheckCircle, RefreshCw, Utensils, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.getKitchenOrders();
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Gagal ambil data dapur", error);
            toast.error("Gagal memuat pesanan");
        } finally {
            setLoading(false);
        }
    };

    // Auto Refresh setiap 30 detik
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleComplete = async (orderId) => {
        setProcessingId(orderId);
        try {
            await api.completeOrder(orderId);
            toast.success(`Order #${orderId} Selesai!`);
            fetchOrders(); // Refresh list segera
        } catch (error) {
            toast.error("Gagal update status");
        } finally {
            setProcessingId(null);
        }
    };

    // Helper untuk durasi (misal: "10 mnt")
    const getTimeElapsed = (dateString) => {
        const diff = new Date() - new Date(dateString);
        const minutes = Math.floor(diff / 60000);
        return `${minutes} mnt`;
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen text-gray-400 dark:text-gray-500 bg-[#F5F7FA] dark:bg-gray-900 transition-colors">
            <RefreshCw className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="font-medium">Memuat Pesanan Dapur...</p>
        </div>
    );

    return (
        <div className="p-6 sm:p-8 min-h-screen bg-[#F5F7FA] dark:bg-gray-900 transition-colors duration-200 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center tracking-tight">
                        <ChefHat className="w-8 h-8 mr-3 text-orange-600 dark:text-orange-500" />
                        Monitor Dapur
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Pantau dan selesaikan pesanan yang masuk secara real-time.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-2xl font-bold shadow-sm border border-orange-200 dark:border-orange-800/50">
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

            {/* Order Grid */}
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
                    <Utensils className="w-24 h-24 mb-4 opacity-20" />
                    <p className="text-xl font-bold">Semua pesanan sudah selesai!</p>
                    <p className="text-sm font-medium opacity-70">Menunggu pesanan baru masuk...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col group">
                            
                            {/* Header Kartu */}
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-5 border-b border-orange-100 dark:border-orange-800/30 flex justify-between items-start rounded-t-[2rem]">
                                <div>
                                    <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">
                                        Order #{order.dailyNumber || order.orderId}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5">{order.orderName}</p>
                                </div>
                                <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/50 shadow-sm">
                                    <Timer className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                                    {getTimeElapsed(order.createdAt)}
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="p-5 flex-grow overflow-y-auto max-h-80 custom-scrollbar">
                                <ul className="space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <li key={idx} className="flex flex-col border-b border-dashed border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-900 dark:text-white text-lg w-8 shrink-0">{item.quantity}x</span>
                                                <span className="flex-grow text-gray-700 dark:text-gray-300 font-medium leading-snug">{item.itemName}</span>
                                            </div>
                                            
                                            {/* Notes */}
                                            {item.notes && (
                                                <div className="mt-2 ml-8">
                                                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-3 py-1.5 rounded-lg inline-block">
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
                                    onClick={() => handleComplete(order.orderId)}
                                    disabled={processingId === order.orderId}
                                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center transition shadow-lg shadow-green-600/20 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processingId === order.orderId ? (
                                        <span className="flex items-center">
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                                        </span>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Selesai Masak
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