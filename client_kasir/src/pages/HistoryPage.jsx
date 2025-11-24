import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { usePDF } from 'react-to-pdf';
import { Receipt } from '../components/Receipt';
import { Printer, Search, CalendarClock, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import Pagination from '../components/common/Pagination'; 
import OrderDetailModal from '../components/common/OrderDetailModal';

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
        setTimeout(() => toPDF(), 500);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => 
            o.orderName?.toLowerCase().includes(search.toLowerCase()) ||
            String(o.dailyNumber).includes(search)
        );
    }, [orders, search]);

    const paginatedOrders = useMemo(() => {
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return filteredOrders.slice(firstIndex, lastIndex);
    }, [filteredOrders, currentPage, itemsPerPage]);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <CalendarClock className="w-7 h-7 mr-3 text-blue-600" />
                        Riwayat Hari Ini
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Transaksi yang tercatat pada sesi ini.</p>
                </div>

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
            
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                 <Receipt ref={targetRef} data={selectedOrderForPrint} />
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Memuat riwayat...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden grow flex flex-col">
                    {filteredOrders.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">Belum ada transaksi hari ini.</div>
                    ) : (
                        <div className="grow overflow-y-auto">
                            <div className="divide-y divide-gray-100">
                                {paginatedOrders.map(order => (
                                    <div key={order.orderId} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
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

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right mr-2">
                                                <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${order.status==='paid'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            
                                            <button onClick={() => setViewOrder(order)} className="p-2.5 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition shadow-sm">
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            <button onClick={() => handlePrint(order)} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition shadow-sm">
                                                <Printer className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {filteredOrders.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={filteredOrders.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}

            {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
        </div>
    );
};

export default HistoryPage;