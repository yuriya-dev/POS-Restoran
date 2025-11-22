import React, { useState, useMemo } from 'react';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, Filter, Download, Award, ListOrdered } from 'lucide-react';
import { subDays, startOfMonth, isWithinInterval, format, startOfDay, endOfDay } from 'date-fns';
import { id } from 'date-fns/locale';

import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import SalesChart from '../components/reports/SalesChart'; 
import TopSellingItems from '../components/reports/TopSellingItems'; 
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';

// Pilihan Filter Periode
const PERIOD_OPTIONS = [
    { label: 'Hari Ini', value: 'today', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
    { label: '7 Hari Terakhir', value: '7days', getRange: () => ({ start: subDays(new Date(), 6), end: new Date() }) },
    { label: 'Bulan Ini', value: 'month', getRange: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
    { label: 'Kustom', value: 'custom', getRange: () => null }, 
];

// Fungsi Kalkulasi Metrik
const calculateMetrics = (orders) => { 
    // Helper: Pastikan nilai dikonversi ke Number, jika null/error jadi 0
    const getVal = (val) => parseFloat(val) || 0;

    const totalRevenue = orders.reduce((acc, order) => acc + getVal(order.totalAmount), 0);
    const totalTransactions = orders.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    const totalCash = orders
        .filter(o => (o.paymentMethod || '').toLowerCase() === 'cash')
        .reduce((acc, o) => acc + getVal(o.totalAmount), 0);

    const totalNonCash = orders
        .filter(o => (o.paymentMethod || '').toLowerCase() !== 'cash')
        .reduce((acc, o) => acc + getVal(o.totalAmount), 0);
        
    const paymentBreakdown = orders.reduce((acc, order) => { 
        const method = order.paymentMethod || 'Lainnya';
        acc[method] = (acc[method] || 0) + 1; 
        return acc; 
    }, {});

    return { totalRevenue, totalTransactions, avgTransaction, totalCash, totalNonCash, paymentBreakdown };
};

const Reports = () => {
    const { orders, settings } = useData(); // Ambil orders dari context
    const [selectedPeriod, setSelectedPeriod] = useState('7days');
    const [customRange, setCustomRange] = useState({ start: null, end: null });
    const [activeTab, setActiveTab] = useState('overview'); 
    
    // 1. Tentukan Rentang Tanggal
    const dateRange = useMemo(() => {
        if (selectedPeriod === 'custom') {
            if (!customRange.start || !customRange.end) return { start: null, end: null };
            return { 
                start: startOfDay(new Date(customRange.start)), 
                end: endOfDay(new Date(customRange.end)) 
            };
        }
        return PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.getRange() || { start: null, end: null };
    }, [selectedPeriod, customRange]);

    // 2. Filter Orders (Client Side Filtering untuk Overview)
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders) || orders.length === 0 || !dateRange.start || !dateRange.end) return [];
        
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt); 
            return isWithinInterval(orderDate, { start: dateRange.start, end: dateRange.end });
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [orders, dateRange]);
    
    // 3. Hitung Metrik
    const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);

    // Fungsi Export Sederhana
    const handleExport = () => {
        if(filteredOrders.length === 0) return alert("Tidak ada data untuk diexport.");
        
        const dataStr = JSON.stringify(filteredOrders, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `laporan_penjualan_${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Format String Tanggal untuk API Top Selling
    const startDateStr = dateRange.start ? dateRange.start.toISOString() : null;
    const endDateStr = dateRange.end ? dateRange.end.toISOString() : null;

    // Pajak Settings
    const taxRate = settings?.taxRate || 0.1;

    // Kolom Tabel Transaksi
    const transactionColumns = [
        { 
            header: 'No. Order', 
            accessor: 'orderId', 
            render: (id) => <span className="font-mono text-xs">#{id}</span>
        },
        { 
            header: 'Waktu', 
            accessor: 'createdAt', 
            render: (time) => format(new Date(time), 'dd/MM HH:mm', { locale: id }) 
        },
        { 
            header: 'Info', 
            accessor: 'orderName', 
            render: (name) => <span className="font-medium">{name || '-'}</span> 
        },
        { 
            header: 'Total', 
            accessor: 'totalAmount', 
            render: formatCurrency 
        },
        { 
            header: 'Metode', 
            accessor: 'paymentMethod', 
            render: (method) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    (method || '').toLowerCase() === 'cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {method || '-'}
                </span>
            )
        },
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

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-blue-600" /> Laporan Penjualan
                </h1>
                <Button variant="secondary" onClick={handleExport} icon={<Download className="w-4 h-4" />} size="sm">
                    Export Data
                </Button>
            </div>
            
            {/* Filter Periode */}
            <Card className="p-4 sm:p-6 bg-white shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="flex flex-wrap gap-2 lg:w-3/4">
                        {PERIOD_OPTIONS.map(opt => (
                            <Button 
                                key={opt.value} 
                                variant={selectedPeriod === opt.value ? 'primary' : 'secondary'} 
                                size="sm" 
                                onClick={() => setSelectedPeriod(opt.value)}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                    {selectedPeriod === 'custom' && (
                        <div className="flex gap-2 w-full lg:w-auto">
                            <input 
                                type="date" 
                                className="border p-2 rounded text-sm" 
                                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))} 
                            />
                            <span className="self-center">-</span>
                            <input 
                                type="date" 
                                className="border p-2 rounded text-sm" 
                                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))} 
                            />
                        </div>
                    )}
                </div>
            </Card>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card 
                    title="Total Omzet" 
                    value={formatCurrency(metrics.totalRevenue)} 
                    icon={DollarSign} 
                    color="text-green-600" 
                    subText={`${formatCurrency(metrics.totalCash)} (Tunai)`}
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
                    subText={`Metode: ${Object.keys(metrics.paymentBreakdown).length} Tipe`}
                />
                <Card 
                    title="Estimasi Pajak" 
                    value={formatCurrency(metrics.totalRevenue * taxRate)} 
                    icon={DollarSign} 
                    color="text-gray-500"
                    subText={`Tarif: ${(taxRate * 100).toFixed(0)}%`}
                />
            </div>

            {/* Tabs Content */}
            <Card className="p-0 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex space-x-4 px-6 pt-4">
                        <TabButton name="Overview & Transaksi" icon={ListOrdered} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <TabButton name="Item Terlaris" icon={Award} isActive={activeTab === 'top-items'} onClick={() => setActiveTab('top-items')} />
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Grafik */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Grafik Penjualan</h3>
                                <div className="h-64 bg-gray-50 rounded-lg border border-gray-100 p-4">
                                    <SalesChart orders={filteredOrders} period={selectedPeriod} />
                                </div>
                            </div>

                            {/* Tabel */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-between">
                                    <span>Riwayat Transaksi</span>
                                    <span className="text-sm font-normal text-gray-500">Total: {filteredOrders.length}</span>
                                </h3>
                                <Table 
                                    columns={transactionColumns} 
                                    data={filteredOrders} 
                                    emptyMessage="Tidak ada data transaksi untuk periode ini." 
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'top-items' && (
                        <TopSellingItems 
                            startDate={startDateStr} 
                            endDate={endDateStr} 
                            selectedPeriod={PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label} 
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Reports;