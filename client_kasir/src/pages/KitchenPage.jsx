import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ChefHat, Clock, CheckCircle, RefreshCw, Utensils } from 'lucide-react';
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
            fetchOrders(); // Refresh list
        } catch (error) {
            toast.error("Gagal update status");
        } finally {
            setProcessingId(null);
        }
    };

    // Helper untuk durasi (misal: "10 mnt yang lalu")
    const getTimeElapsed = (dateString) => {
        const diff = new Date() - new Date(dateString);
        const minutes = Math.floor(diff / 60000);
        return `${minutes} mnt`;
    };

    if (loading) return <div className="p-10 text-center">Memuat Pesanan Dapur...</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ChefHat className="w-10 h-10 mr-3 text-orange-600" />
                    Dapur / Kitchen Display
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold">
                        {orders.length} Pesanan Antre
                    </span>
                    <button 
                        onClick={() => { setLoading(true); fetchOrders(); }}
                        className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-gray-600 hover:text-blue-600 transition"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Order Grid */}
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <Utensils className="w-24 h-24 mb-4 opacity-20" />
                    <p className="text-xl font-medium">Semua pesanan sudah selesai!</p>
                    <p className="text-sm">Menunggu pesanan baru...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col animate-in fade-in zoom-in duration-300">
                            
                            {/* Header Kartu */}
                            <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">
                                        Order #{order.dailyNumber || order.orderId}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">{order.orderName}</p>
                                </div>
                                <div className="flex items-center bg-white px-2 py-1 rounded text-xs font-bold text-orange-600 border border-orange-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {getTimeElapsed(order.createdAt)}
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="p-4 grow overflow-y-auto max-h-80 bg-white">
                                <ul className="space-y-3">
                                    {order.items?.map((item, idx) => (
                                        <li key={idx} className="flex flex-col border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-800 text-lg w-8">{item.quantity}x</span>
                                                <span className="grow text-gray-700 font-medium">{item.itemName}</span>
                                            </div>
                                            {item.notes && (
                                                <p className="text-red-500 text-xs italic ml-8 mt-1 bg-red-50 p-1 rounded inline-block self-start">
                                                    Catatan: {item.notes}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer Action */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => handleComplete(order.orderId)}
                                    disabled={processingId === order.orderId}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center transition shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processingId === order.orderId ? (
                                        'Memproses...'
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