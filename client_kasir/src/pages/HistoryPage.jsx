import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { usePDF } from 'react-to-pdf';
import { Receipt } from '../components/Receipt';
import { Printer, Search, CalendarClock, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // PDF Generator
    const { toPDF, targetRef } = usePDF({filename: 'reprint_struk.pdf'});

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Mengambil order hari ini (filter=today sudah kita siapkan di api.js)
            const res = await api.getTodayOrders();
            setOrders(res.data || []);
        } catch (error) {
            console.error("Gagal load history", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (order) => {
        // Format data agar sesuai dengan komponen Receipt
        // Pastikan items di-join di backend (orderController)
        const receiptData = {
            ...order,
            items: order.items || [], 
            date: order.createdAt,
            cashier: 'Reprint' // Bisa diganti nama kasir asli jika ada di data
        };
        setSelectedOrder(receiptData);
        
        // Beri jeda sedikit agar state ter-render sebelum print
        setTimeout(() => toPDF(), 500);
    };

    // Filter pencarian lokal (berdasarkan ID atau Nama Order)
    const filteredOrders = orders.filter(o => 
        o.orderName?.toLowerCase().includes(search.toLowerCase()) ||
        String(o.dailyNumber).includes(search)
    );

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <CalendarClock className="w-7 h-7 mr-3 text-blue-600" />
                        Riwayat Hari Ini
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Transaksi yang tercatat pada sesi ini.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-64">
                    <input 
                        type="text" 
                        placeholder="Cari No. Order / Nama..." 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
            </div>
            
            {/* Hidden Receipt untuk PDF Generator */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                 <Receipt ref={targetRef} data={selectedOrder} />
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Memuat riwayat...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {filteredOrders.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">Belum ada transaksi hari ini.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredOrders.map(order => (
                                <div key={order.orderId} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                                    
                                    {/* Info Kiri */}
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-50 text-blue-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold border border-blue-100">
                                            <span className="text-[10px] uppercase text-blue-400">NO</span>
                                            <span className="text-lg leading-none">#{order.dailyNumber || '?'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{order.orderName || 'Tanpa Nama'}</h3>
                                            <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
                                                <span>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                <span>•</span>
                                                <span className="uppercase">{order.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Kanan & Aksi */}
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${order.status==='paid'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handlePrint(order)} 
                                            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm group"
                                            title="Cetak Ulang Struk"
                                        >
                                            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;