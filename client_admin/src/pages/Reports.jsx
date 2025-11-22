import React, { useState, useMemo } from 'react';
import { 
    BarChart3, DollarSign, ShoppingCart, TrendingUp, Filter, Download, Award, ListOrdered, ChevronDown, 
    ArrowUp, ArrowDown 
} from 'lucide-react';
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

// OPSI FILTER BARU
const STATUS_OPTIONS = [
    { value: 'all', label: 'Semua Status' },
    { value: 'paid', label: 'Lunas' },
    { value: 'active', label: 'Aktif (Pending)' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

const PAYMENT_OPTIONS = [
    { value: 'all', label: 'Semua Metode' },
    { value: 'cash', label: 'Tunai' },
    { value: 'qris', label: 'QRIS' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'other', label: 'Lainnya' },
];

// Fungsi Kalkulasi Metrik (tetap sama)
const calculateMetrics = (orders) => { 
    const getVal = (val) => parseFloat(val) || 0;
    const totalRevenue = orders.reduce((acc, order) => acc + getVal(order.totalAmount), 0);
    const totalTransactions = orders.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const totalCash = orders.filter(o => (o.paymentMethod || '').toLowerCase() === 'cash').reduce((acc, o) => acc + getVal(o.totalAmount), 0);
    const totalNonCash = orders.filter(o => (o.paymentMethod || '').toLowerCase() !== 'cash').reduce((acc, o) => acc + getVal(o.totalAmount), 0);
    const paymentBreakdown = orders.reduce((acc, order) => { 
        const method = order.paymentMethod || 'Lainnya';
        acc[method] = (acc[method] || 0) + 1; 
        return acc; 
    }, {});
    return { totalRevenue, totalTransactions, avgTransaction, totalCash, totalNonCash, paymentBreakdown };
};

const Reports = () => {
    const { orders, settings } = useData(); 
    const [selectedPeriod, setSelectedPeriod] = useState('7days');
    const [customRange, setCustomRange] = useState({ start: null, end: null });
    const [activeTab, setActiveTab] = useState('overview'); 
    
    // STATE UNTUK FILTER TRANSAKSI
    const [filterStatus, setFilterStatus] = useState('paid'); 
    const [filterPaymentMethod, setFilterPaymentMethod] = useState('all'); 

    // ✅ STATE BARU UNTUK SORTIR
    const [sortColumn, setSortColumn] = useState('createdAt'); // Default sorting
    const [sortDirection, setSortDirection] = useState('desc'); // Default descending (terbaru dulu)

    // Logika Pengurutan
    const handleSort = (column) => {
        if (sortColumn === column) {
            // Balik arah jika kolom sama
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set kolom baru, defaultnya descending
            setSortColumn(column);
            setSortDirection('desc');
        }
    };
    
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

    // 2. Filter & Sortir Orders
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders) || orders.length === 0 || !dateRange.start || !dateRange.end) return [];
        
        let result = orders.filter(order => {
            const orderDate = new Date(order.createdAt); 
            
            // Filter 1: Tanggal
            const dateMatch = isWithinInterval(orderDate, { start: dateRange.start, end: dateRange.end });
            
            // Filter 2: Status
            const statusMatch = filterStatus === 'all' || order.status === filterStatus;
            
            // Filter 3: Pembayaran
            const paymentMatch = filterPaymentMethod === 'all' || order.paymentMethod === filterPaymentMethod;

            return dateMatch && statusMatch && paymentMatch;
        });

        // ✅ Logika Sortir
        result.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            // Konversi nilai yang mungkin angka (Order ID, Total, CreatedAt)
            if (sortColumn === 'totalAmount' || sortColumn === 'orderId') {
                valA = parseFloat(valA) || 0;
                valB = parseFloat(valB) || 0;
            } else if (sortColumn === 'createdAt') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            } else {
                // Untuk string, lakukan perbandingan localeCompare
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }

            if (valA < valB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return result;
    }, [orders, dateRange, filterStatus, filterPaymentMethod, sortColumn, sortDirection]); // ✅ Tambah dependencies sort
    
    // 3. Hitung Metrik (tetap sama)
    const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);

    // Fungsi Export Sederhana (tetap sama)
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

    // Format String Tanggal untuk API Top Selling (tetap sama)
    const startDateStr = dateRange.start ? dateRange.start.toISOString() : null;
    const endDateStr = dateRange.end ? dateRange.end.toISOString() : null;
    const taxRate = settings?.taxRate || 0.1;

    // ✅ Komponen Header Kolom Sortable
    const SortableHeader = ({ header, accessor }) => {
        const isCurrentSort = sortColumn === accessor;
        const Icon = isCurrentSort 
            ? (sortDirection === 'asc' ? ArrowUp : ArrowDown) 
            : ArrowUp;
        
        return (
            <div 
                className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleSort(accessor)}
            >
                {header}
                {/* Tampilkan ikon hanya jika kolom bisa disortir */}
                {['orderId', 'createdAt', 'totalAmount'].includes(accessor) && (
                    <Icon className={`w-3 h-3 ml-1 ${isCurrentSort ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
            </div>
        );
    };

    // ✅ Kolom Tabel Transaksi (Menggunakan SortableHeader)
    const transactionColumns = [
        { 
            header: <SortableHeader header='No. Order' accessor='dailyNumber' />,
            accessor: 'dailyNumber', 
            render: (dailyNum, item) => { // Akses dailyNum (kolom utama) dan item (object row)
                // Jika dailyNum (nomor harian) null/0, gunakan orderId global sebagai fallback
                const displayId = dailyNum || item.orderId; 
                
                // Render sebagai ID harian jika ada, atau ID global jika legacy
                return (
                    <span className={`font-mono text-xs font-semibold ${dailyNum ? 'text-blue-600' : 'text-gray-500'}`}>
                        #{displayId}
                    </span>
                );
            }
        },
        { 
            header: <SortableHeader header='Waktu' accessor='createdAt' />,
            accessor: 'createdAt', 
            render: (time) => format(new Date(time), 'dd/MM HH:mm', { locale: id }) 
        },
        { 
            header: 'Status', 
            accessor: 'status', 
            render: (status) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    status === 'paid' ? 'bg-green-100 text-green-800' : status === 'active' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                    {status}
                </span>
            )
        },
        { 
            header: <SortableHeader header='Total' accessor='totalAmount' />, 
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
                            <input type="date" className="border p-2 rounded text-sm" onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))} />
                            <span className="self-center">-</span>
                            <input type="date" className="border p-2 rounded text-sm" onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))} />
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
                    subText={`Metode: ${Object.keys(metrics.paymentBreakdown).join(', ')}`}
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
                                
                                {/* BAR FILTER TRANSAKSI */}
                                <div className="flex space-x-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    {/* Filter Status */}
                                    <div className="relative flex-1">
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none cursor-pointer"
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>

                                    {/* Filter Pembayaran */}
                                    <div className="relative flex-1">
                                        <select
                                            value={filterPaymentMethod}
                                            onChange={(e) => setFilterPaymentMethod(e.target.value)}
                                            className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none cursor-pointer"
                                        >
                                            {PAYMENT_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                                
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