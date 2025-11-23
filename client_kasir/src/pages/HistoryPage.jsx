import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { usePDF } from 'react-to-pdf';
import { Receipt } from '../components/Receipt';
import { Printer, Search, CalendarClock, Eye, X, Receipt as ReceiptIcon } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

// --- SUB-COMPONENT: MODAL DETAIL ---
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    const items = order.items || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <ReceiptIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Detail Order
                        </h3>
                        <p className="text-sm text-gray-500">
                            #{order.dailyNumber || order.orderId}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Info Utama */}
                    <div className="flex justify-between items-center mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase">Meja / Pelanggan</p>
                            <p className="font-bold text-gray-800">{order.orderName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-600 font-bold uppercase">Metode Bayar</p>
                            <p className="font-bold text-gray-800 capitalize">{order.paymentMethod}</p>
                        </div>
                    </div>

                    {/* List Item */}
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">Item Pesanan</h4>
                    <div className="space-y-3 mb-6">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                    <span className="bg-gray-100 text-gray-700 font-bold w-6 h-6 flex items-center justify-center rounded text-xs mt-0.5">
                                        {item.quantity}x
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 leading-tight">{item.itemName}</p>
                                        {item.notes && (
                                            <p className="text-[10px] text-orange-600 italic mt-1 bg-orange-50 px-1.5 py-0.5 rounded inline-block">
                                                {item.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-600">
                                    {formatCurrency(item.totalPrice)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Summary Total */}
                    <div className="space-y-2 pt-4 border-t border-dashed border-gray-300">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Pajak</span>
                            <span>{formatCurrency(order.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button 
                        onClick={onClose}
                        className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null); // Khusus print
    const [viewOrder, setViewOrder] = useState(null); // Khusus modal detail
    
    // PDF Generator
    const { toPDF, targetRef } = usePDF({filename: 'reprint_struk.pdf'});

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await api.getTodayOrders();
            setOrders(res.data || []);
        } catch (error) {
            console.error("Gagal load history", error);
        } finally {
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
        
        // Beri jeda sedikit agar state ter-render sebelum print
        setTimeout(() => toPDF(), 500);
    };

    // Filter pencarian lokal
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
                 <Receipt ref={targetRef} data={selectedOrderForPrint} />
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
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right mr-2">
                                            <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${order.status==='paid'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                        {/* ✅ Tombol Lihat Detail (Eye) */}
                                        <button 
                                            onClick={() => setViewOrder(order)} 
                                            className="p-2.5 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition shadow-sm"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>

                                        {/* Tombol Print */}
                                        <button 
                                            onClick={() => handlePrint(order)} 
                                            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition shadow-sm"
                                            title="Cetak Ulang Struk"
                                        >
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal Detail */}
            {viewOrder && (
                <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />
            )}
        </div>
    );
};

export default HistoryPage;