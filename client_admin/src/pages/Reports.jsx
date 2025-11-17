// pages/Reports.jsx (Versi Diperbarui & Diperbaiki)

import React, { useState, useMemo } from 'react';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, Filter, Download, Award, ListOrdered } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import SalesChart from '../components/reports/SalesChart'; 
import TopSellingItems from '../components/reports/TopSellingItems'; 
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';
import { subDays, startOfMonth, isWithinInterval, format } from 'date-fns';
import { id } from 'date-fns/locale';

// Pilihan Filter Periode
const PERIOD_OPTIONS = [
    { label: 'Hari Ini', value: 'today', getRange: () => ({ start: new Date(), end: new Date() }) },
    { label: '7 Hari Terakhir', value: '7days', getRange: () => ({ start: subDays(new Date(), 6), end: new Date() }) },
    { label: 'Bulan Ini', value: 'month', getRange: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
    { label: 'Kustom', value: 'custom', getRange: () => null }, 
];

// Fungsi Kalkulasi Metrik (Dipertahankan)
const calculateMetrics = (orders) => { 
    const totalRevenue = orders.reduce((acc, order) => acc + order.total_bayar, 0);
    const totalTransactions = orders.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    return { 
        totalRevenue,
        totalTransactions,
        avgTransaction,
        totalCash: orders.filter(o => o.metode_bayar === 'tunai').reduce((acc, o) => acc + o.total_bayar, 0),
        totalNonCash: orders.filter(o => o.metode_bayar !== 'tunai').reduce((acc, o) => acc + o.total_bayar, 0),
        paymentBreakdown: orders.reduce((acc, order) => { acc[order.metode_bayar] = (acc[order.metode_bayar] || 0) + 1; return acc; }, {})
    };
};


const Reports = () => {
    // settings mungkin null/undefined saat inisialisasi
    const { orders, settings } = useData(); 
    const [selectedPeriod, setSelectedPeriod] = useState('7days');
    const [customRange, setCustomRange] = useState({ start: null, end: null });
    const [activeTab, setActiveTab] = useState('overview'); 
    
    const dateRange = useMemo(() => {
        if (selectedPeriod === 'custom') return customRange;
        return PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.getRange() || { start: null, end: null };
    }, [selectedPeriod, customRange]);

    const filteredOrders = useMemo(() => {
        // Cek jika orders adalah array dan ada data
        if (!Array.isArray(orders) || orders.length === 0 || !dateRange || !dateRange.start || !dateRange.end) return [];
        
        const start = new Date(dateRange.start); start.setHours(0, 0, 0, 0);
        const end = new Date(dateRange.end); end.setHours(23, 59, 59, 999);
        
        return orders.filter(order => {
            const orderDate = new Date(order.waktu_pesan);
            return isWithinInterval(orderDate, { start, end });
        }).sort((a, b) => new Date(b.waktu_pesan) - new Date(a.waktu_pesan));
    }, [orders, dateRange]);
    
    const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);


    // Kolom Tabel Transaksi
    const transactionColumns = [
        { header: 'No. Pesanan', accessor: 'order_id', render: (id) => `#${id.split('-')[1]}` },
        { header: 'Waktu', accessor: 'waktu_pesan', render: (time) => format(new Date(time), 'HH:mm:ss', { locale: id }) },
        { header: 'Meja', accessor: 'meja_id', render: (id) => id.toUpperCase() },
        { header: 'Total Bayar', accessor: 'total_bayar', render: formatCurrency },
        { header: 'Metode Bayar', accessor: 'metode_bayar', render: (method) => (
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium capitalize ${
                method === 'tunai' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
                {method}
            </span>
        )},
    ];
    
    const TabButton = ({ name, icon: Icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-2 text-base font-medium transition-colors duration-200 border-b-2 
                        ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            <Icon className="w-5 h-5 mr-2" />
            {name}
        </button>
    );

    // Dapatkan nilai pajak dengan nilai default 0 jika settings undefined
    const pajakPersen = settings?.pajak_persen || 0;
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><BarChart3 className="w-6 h-6 mr-2 text-blue-600" /> Laporan Penjualan</h1>
            
            {/* Filter Periode */}
            <Card title="Filter Periode" icon={Filter} className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="flex flex-wrap gap-2 lg:w-3/4">
                        {PERIOD_OPTIONS.map(opt => (
                            <Button key={opt.value} variant={selectedPeriod === opt.value ? 'primary' : 'secondary'} size="sm" onClick={() => setSelectedPeriod(opt.value)}>
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                    {selectedPeriod === 'custom' && (
                        <div className="flex space-x-2 w-full lg:w-1/4">
                            <input type="date" className="border p-2 rounded-lg w-1/2" onChange={(e) => setCustomRange(prev => ({ ...prev, start: new Date(e.target.value) }))} />
                            <input type="date" className="border p-2 rounded-lg w-1/2" onChange={(e) => setCustomRange(prev => ({ ...prev, end: new Date(e.target.value) }))} />
                        </div>
                    )}
                </div>
            </Card>

            {/* Overview Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="Total Omzet" 
                    value={formatCurrency(metrics.totalRevenue)} 
                    icon={DollarSign} 
                    color="text-green-600" 
                    subText={`${formatCurrency(metrics.totalCash)} Tunai`}
                />
                <Card 
                    title="Jumlah Transaksi" 
                    value={metrics.totalTransactions} 
                    icon={ShoppingCart} 
                    color="text-blue-600"
                    subText={`Rata-rata: ${formatCurrency(metrics.avgTransaction)}`}
                />
                 <Card 
                    title="Non-Tunai" 
                    value={formatCurrency(metrics.totalNonCash)} 
                    icon={TrendingUp} 
                    color="text-indigo-600"
                    subText={`Metode Terbanyak: ${Object.keys(metrics.paymentBreakdown).reduce((a, b) => (metrics.paymentBreakdown[a] || 0) > (metrics.paymentBreakdown[b] || 0) ? a : b, 'N/A')}`}
                />
                <Card 
                    title="Pajak Diterima" 
                    // PERBAIKAN: Menggunakan pajakPersen yang sudah dicek
                    value={formatCurrency(metrics.totalRevenue * (pajakPersen / 100))} 
                    icon={DollarSign} 
                    color="text-gray-500"
                    subText={`Tarif: ${pajakPersen}%`}
                />
            </div>

            {/* Area Tab Laporan */}
            <Card className="p-0">
                <div className="border-b border-gray-200">
                    <div className="flex space-x-4 px-6 pt-4">
                        <TabButton name="Overview & Transaksi" icon={ListOrdered} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <TabButton name="Item Terlaris" icon={Award} isActive={activeTab === 'top-items'} onClick={() => setActiveTab('top-items')} />
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Grafik Penjualan */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2" /> Grafik Penjualan Harian</h3>
                                <SalesChart orders={filteredOrders} period={selectedPeriod} />
                            </div>

                            {/* Daftar Transaksi Harian */}
                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold flex items-center"><ListOrdered className="w-5 h-5 mr-2" /> Daftar Transaksi Detail ({filteredOrders.length})</h3>
                                    <Button variant="secondary" onClick={() => {/* handleExport() */ alert('Fungsi Export dipanggil')}} icon={<Download className="w-4 h-4" />} size="sm">
                                        Export (JSON)
                                    </Button>
                                </div>
                                <Table columns={transactionColumns} data={filteredOrders} emptyMessage="Tidak ada transaksi yang tercatat dalam periode ini." />
                            </div>
                        </div>
                    )}

                    {activeTab === 'top-items' && (
                        <TopSellingItems filteredOrders={filteredOrders} selectedPeriod={selectedPeriod} />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Reports;