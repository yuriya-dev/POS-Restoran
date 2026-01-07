import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../shared/services/api';
import { usePDF } from 'react-to-pdf';
import { Receipt } from '../components/Receipt';
import { Printer, Search, CalendarClock, Eye, RefreshCw, ReceiptText, WifiOff } from 'lucide-react'; // Tambah WifiOff
import { formatCurrency } from '../../shared/utils/helpers';
import Pagination from '../../shared/components/common/Pagination'; 
import OrderDetailModal from '../../shared/components/common/OrderDetailModal';
import toast from 'react-hot-toast';

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);
    const [viewOrder, setViewOrder] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); 

    const { toPDF, targetRef } = usePDF({filename: 'reprint_struk.pdf'});

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        
        let serverData = [];
        let offlineData = [];

        // 1. Ambil Data Offline (Transaksi yang belum di-sync)
        try {
            const localPending = JSON.parse(localStorage.getItem('offline_orders') || '[]');
            // Mapping agar strukturnya sama dengan data server
            offlineData = localPending.map(o => ({
                ...o,
                orderId: `OFF-${o.tempId}`, // ID Sementara
                dailyNumber: 'OFF',         // Penanda belum sync
                createdAt: o.savedAt,       // Waktu simpan lokal
                isOffline: true             // Flag khusus
            }));
        } catch (e) {
            console.error("Gagal baca storage offline", e);
        }

        // 2. Ambil Data Server (Dengan Fallback Cache)
        try {
            const res = await api.getOrders();
            serverData = res.data || [];
            
            // ✅ SUKSES: Update Cache untuk penggunaan offline nanti
            localStorage.setItem('cached_history_orders', JSON.stringify(serverData));

        } catch (error) {
            console.warn("Gagal koneksi server, menggunakan cache lokal.");
            
            // ✅ ERROR/OFFLINE: Ambil dari Cache Server terakhir
            const cachedServerData = localStorage.getItem('cached_history_orders');
            if (cachedServerData) {
                serverData = JSON.parse(cachedServerData);
                
                // Beri notifikasi jika user benar-benar offline
                if (!navigator.onLine) {
                    toast("Mode Offline: Menampilkan riwayat tersimpan", {
                        icon: <WifiOff className="w-4 h-4 text-orange-500" />,
                        style: { borderRadius: '10px', background: '#333', color: '#fff' },
                    });
                }
            }
        } finally {
            // 3. Gabungkan & Filter Data (Hanya Hari Ini)
            const allOrders = [...offlineData, ...serverData];
            const today = new Date().toDateString();
            
            const todayOrders = allOrders.filter(order => {
                const orderDate = new Date(order.createdAt).toDateString();
                return orderDate === today;
            });

            // Sort: Terbaru di atas
            todayOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setOrders(todayOrders);
            setLoading(false);
        }
    };

    const handlePrint = (order) => {
        const receiptData = {
            ...order,
            items: order.items || [], 
            date: order.createdAt,
            cashier: 'Reprint' 
        };
        setSelectedOrderForPrint(receiptData);
        setTimeout(() => toPDF(), 500);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => 
            o.orderName?.toLowerCase().includes(search.toLowerCase()) ||
            String(o.dailyNumber || o.orderId).includes(search)
        );
    }, [orders, search]);

    const paginatedOrders = useMemo(() => {
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return filteredOrders.slice(firstIndex, lastIndex);
    }, [filteredOrders, currentPage, itemsPerPage]);

    // Helper untuk Badge Status dengan Dark Mode
    const getStatusStyle = (status, isOffline) => {
        if (isOffline) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
        
        switch(status) {
            case 'paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="h-full bg-[#F5F7FA] dark:bg-gray-900 flex flex-col overflow-hidden font-sans transition-colors duration-200">
            
            {/* Header & Search */}
            <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight flex items-center">
                        <CalendarClock className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
                        Riwayat Hari Ini
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Daftar transaksi yang tercatat pada sesi ini.
                    </p>
                </div>

                {/* Search Bar Modern */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari No. Order / Nama..." 
                        className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 outline-none font-medium shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            
            {/* Hidden Receipt untuk PDF Generator */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                 <Receipt ref={targetRef} data={selectedOrderForPrint} />
            </div>

            {/* Content Area */}
            <main className="flex-grow px-8 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[55vh] text-gray-400 dark:text-gray-500 bg-[#F5F7FA] dark:bg-gray-900 transition-colors">
                        <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p className="font-medium">Memuat riwayat transaksi...</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full transition-colors duration-200">
                        
                        {/* Empty State */}
                        {filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-400 dark:text-gray-600 space-y-4">
                                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-full">
                                    <ReceiptText className="w-16 h-16 opacity-50" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Belum ada transaksi hari ini</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">Transaksi yang selesai akan muncul di sini.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* List Header (Desktop) */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <div className="col-span-4 pl-2">Detail Order</div>
                                    <div className="col-span-3 text-center">Status</div>
                                    <div className="col-span-3 text-right">Total</div>
                                    <div className="col-span-2 text-center">Aksi</div>
                                </div>

                                {/* Scrollable List */}
                                <div className="flex-grow overflow-y-auto custom-scrollbar">
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {paginatedOrders.map(order => (
                                            <div key={order.orderId} className="p-4 md:px-6 md:py-5 hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 group">
                                                <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                                                    
                                                    {/* Info Order */}
                                                    <div className="col-span-4 w-full flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 border ${
                                                            order.isOffline 
                                                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200'
                                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                        }`}>
                                                            {order.isOffline ? (
                                                                <WifiOff className="w-5 h-5" />
                                                            ) : (
                                                                <>
                                                                    <span className="text-[10px] uppercase opacity-70">NO</span>
                                                                    <span className="text-lg leading-none">#{order.dailyNumber || '?'}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">{order.orderName || 'Tanpa Nama'}</h3>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                <span className="font-medium">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                                                <span className="uppercase font-bold">{order.paymentMethod}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="col-span-3 w-full md:text-center flex md:justify-center">
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${getStatusStyle(order.status, order.isOffline)}`}>
                                                            {order.isOffline ? 'Offline / Pending' : order.status}
                                                        </span>
                                                    </div>

                                                    {/* Total Amount */}
                                                    <div className="col-span-3 w-full md:text-right flex justify-between md:block">
                                                        <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">Total</span>
                                                        <p className="font-extrabold text-gray-900 dark:text-white font-mono text-base">
                                                            {formatCurrency(order.totalAmount)}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Actions */}
                                                    <div className="col-span-2 w-full flex justify-center items-center gap-2">
                                                        <button 
                                                            onClick={() => setViewOrder(order)} 
                                                            className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>

                                                        <button 
                                                            onClick={() => handlePrint(order)} 
                                                            className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-400 hover:shadow-sm transition-all"
                                                            title="Cetak Ulang Struk"
                                                        >
                                                            <Printer className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
                                    <Pagination 
                                        currentPage={currentPage}
                                        totalItems={filteredOrders.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>

            {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
        </div>
    );
};

export default HistoryPage;