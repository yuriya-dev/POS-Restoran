import React, { useState, useMemo, useEffect } from 'react';
import { 
    BarChart3, DollarSign, ShoppingCart, TrendingUp, Download, Award, ListOrdered, ChevronDown, 
    ArrowUp, ArrowDown, Eye
} from 'lucide-react';
import { subDays, startOfMonth, isWithinInterval, format, startOfDay, endOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';

import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import SalesChart from '../components/reports/SalesChart'; 
import TopSellingItems from '../components/reports/TopSellingItems'; 
import ConfirmModal from '../components/common/ConfirmModal'; 
import Pagination from '../components/common/Pagination';
import OrderDetailModal from '../components/common/OrderDetailModal';

import { useData } from '../context/DataContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/helpers';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ... (Kode OPSI FILTER, STATUS_OPTIONS, PAYMENT_OPTIONS tetap sama) ...
const PERIOD_OPTIONS = [
    { label: 'Hari Ini', value: 'today', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
    { label: '7 Hari Terakhir', value: '7days', getRange: () => ({ start: subDays(new Date(), 6), end: new Date() }) },
    { label: 'Bulan Ini', value: 'month', getRange: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
    { label: 'Kustom', value: 'custom', getRange: () => null }, 
];

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

// ... (Fungsi calculateMetrics & OrderDetailModal TETAP SAMA, saya skip biar tidak kepanjangan) ...
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

// --- KOMPONEN UTAMA ---
const Reports = () => {
    const { orders, settings, refreshData } = useData(); 
    const [selectedPeriod, setSelectedPeriod] = useState('7days');
    const [customRange, setCustomRange] = useState({ start: null, end: null });
    const [activeTab, setActiveTab] = useState('overview'); 
    
    // STATE FILTER & SORT
    const [filterStatus, setFilterStatus] = useState('paid'); 
    const [filterPaymentMethod, setFilterPaymentMethod] = useState('all'); 
    const [sortColumn, setSortColumn] = useState('createdAt'); 
    const [sortDirection, setSortDirection] = useState('desc');

    // ✅ STATE PAGINATION BARU
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Tampilkan 10 per halaman

    // STATE DETAIL & VOID
    const [viewOrder, setViewOrder] = useState(null);
    const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
    const [orderToVoid, setOrderToVoid] = useState(null);
    const [isVoiding, setIsVoiding] = useState(false);

    // Reset halaman ke 1 jika filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPeriod, filterStatus, filterPaymentMethod, sortColumn, sortDirection]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const openVoidModal = (order, e) => {
        e.stopPropagation();
        setOrderToVoid(order);
        setIsVoidModalOpen(true);
    };

    const confirmVoid = async () => {
        if (!orderToVoid) return;
        setIsVoiding(true);
        try {
            await api.cancelOrder(orderToVoid.orderId);
            toast.success("Transaksi berhasil dibatalkan & Stok dikembalikan.");
            await refreshData('orders'); 
        } catch (err) {
            console.error(err);
            toast.error("Gagal membatalkan transaksi.");
        } finally {
            setIsVoiding(false);
            setIsVoidModalOpen(false);
            setOrderToVoid(null);
        }
    };
    
    const dateRange = useMemo(() => {
        if (selectedPeriod === 'custom') {
            if (!customRange.start || !customRange.end) return { start: null, end: null };
            return { start: startOfDay(new Date(customRange.start)), end: endOfDay(new Date(customRange.end)) };
        }
        return PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.getRange() || { start: null, end: null };
    }, [selectedPeriod, customRange]);

    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders) || orders.length === 0 || !dateRange.start || !dateRange.end) return [];
        
        let result = orders.filter(order => {
            const orderDate = new Date(order.createdAt); 
            const dateMatch = isWithinInterval(orderDate, { start: dateRange.start, end: dateRange.end });
            const statusMatch = filterStatus === 'all' || order.status === filterStatus;
            const paymentMatch = filterPaymentMethod === 'all' || order.paymentMethod === filterPaymentMethod;
            return dateMatch && statusMatch && paymentMatch;
        });

        result.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];
            if (['totalAmount', 'orderId', 'dailyNumber'].includes(sortColumn)) {
                valA = parseFloat(valA) || 0;
                valB = parseFloat(valB) || 0;
            } else if (sortColumn === 'createdAt') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            } else {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [orders, dateRange, filterStatus, filterPaymentMethod, sortColumn, sortDirection]);
    
    // ✅ LOGIKA SLICING UNTUK PAGINATION
    const paginatedOrders = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredOrders, currentPage, itemsPerPage]);

    const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);

    const handleExport = () => {
        if (filteredOrders.length === 0) return alert("Tidak ada data untuk diexport.");
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Laporan Penjualan", 14, 15);
        doc.setFontSize(10);
        doc.text(`Periode: ${format(dateRange.start, 'dd MMM yyyy', { locale: id })} - ${format(dateRange.end, 'dd MMM yyyy', { locale: id })}`, 14, 22);
        doc.text(`Total Transaksi: ${filteredOrders.length}`, 14, 28);
        doc.text(`Total Omzet: ${formatCurrency(metrics.totalRevenue)}`, 14, 34);

        const tableColumn = ["No.", "Tanggal", "Status", "Total", "Pembayaran"];
        const tableRows = [];
        filteredOrders.forEach((order, index) => {
            tableRows.push([
                order.dailyNumber || (index + 1),
                format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: id }),
                order.status,
                formatCurrency(order.totalAmount),
                order.paymentMethod || "-",
            ]);
        });
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40, styles: { fontSize: 9 }, theme: "grid" });
        doc.save(`laporan_penjualan_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    const startDateStr = dateRange.start ? dateRange.start.toISOString() : null;
    const endDateStr = dateRange.end ? dateRange.end.toISOString() : null;
    const taxRate = settings?.taxRate || 0.1;

    const SortableHeader = ({ header, accessor }) => {
        const isCurrentSort = sortColumn === accessor;
        const Icon = isCurrentSort ? (sortDirection === 'asc' ? ArrowUp : ArrowDown) : ArrowUp;
        return (
            <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort(accessor)}>
                {header}
                {['orderId', 'createdAt', 'totalAmount', 'dailyNumber'].includes(accessor) && (
                    <Icon className={`w-3 h-3 ml-1 ${isCurrentSort ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
            </div>
        );
    };

    const transactionColumns = [
        { 
            header: <SortableHeader header='No.' accessor='dailyNumber' />,
            accessor: 'dailyNumber', 
            render: (dailyNum, item) => <span className="font-mono text-xs font-semibold text-blue-600">#{dailyNum || item.orderId}</span>
        },
        { 
            header: <SortableHeader header='Waktu' accessor='createdAt' />,
            accessor: 'createdAt', 
            render: (time) => format(new Date(time), 'dd/MM HH:mm', { locale: id }) 
        },
        { header: 'Status', accessor: 'status', render: (status) => (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                status === 'paid' ? 'bg-green-100 text-green-800' : status === 'active' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>{status}</span>
        )},
        { header: <SortableHeader header='Total' accessor='totalAmount' />, accessor: 'totalAmount', render: formatCurrency },
        { header: 'Metode', accessor: 'paymentMethod', render: (m) => <span className="capitalize">{m}</span> },
        {
            header: 'Detail',
            accessor: 'actions',
            render: (_, item) => (
                <button onClick={(e) => { e.stopPropagation(); setViewOrder(item); }} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-blue-600 transition" title="Lihat Detail">
                    <Eye className="w-4 h-4" />
                </button>
            )
        },
        { 
            header: 'Aksi',
            render: (_, row) => (
                row.status !== 'cancelled' && (
                    <button onClick={(e) => openVoidModal(row, e)} className="text-red-600 text-xs hover:underline font-medium bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition">
                        Batalkan
                    </button>
                )
            )
        }
    ];
    
    const TabButton = ({ name, icon: Icon, isActive, onClick }) => (
        <button onClick={onClick} className={`flex items-center px-4 py-2 text-base font-medium transition-colors duration-200 border-b-2 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Icon className="w-5 h-5 mr-2" /> {name}
        </button>
    );

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <BarChart3 className="w-6 h-6 mr-2 text-blue-600" /> Laporan Penjualan
                    </h1>
                    <Button variant="secondary" onClick={handleExport} icon={<Download className="w-4 h-4" />} size="sm">Export PDF</Button>
                </div>
                
                {/* Filter Periode */}
                <Card className="p-4 sm:p-6 bg-white shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex flex-wrap gap-2 lg:w-3/4">
                            {PERIOD_OPTIONS.map(opt => (
                                <Button key={opt.value} variant={selectedPeriod === opt.value ? 'primary' : 'secondary'} size="sm" onClick={() => setSelectedPeriod(opt.value)}>{opt.label}</Button>
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

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card title="Total Omzet" value={formatCurrency(metrics.totalRevenue)} icon={DollarSign} color="text-green-600" subText={`${formatCurrency(metrics.totalCash)} (Tunai)`} />
                    <Card title="Jumlah Transaksi" value={metrics.totalTransactions} icon={ShoppingCart} color="text-blue-600" subText={`Rata-rata: ${formatCurrency(metrics.avgTransaction)}`} />
                    <Card title="Non-Tunai" value={formatCurrency(metrics.totalNonCash)} icon={TrendingUp} color="text-indigo-600" subText={`Metode: ${Object.keys(metrics.paymentBreakdown).join(', ')}`} />
                    <Card title="Estimasi Pajak" value={formatCurrency(metrics.totalRevenue * taxRate)} icon={DollarSign} color="text-gray-500" subText={`Tarif: ${(taxRate * 100).toFixed(0)}%`} />
                </div>

                {/* Content */}
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
                                    
                                    <div className="flex space-x-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="relative flex-1">
                                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none cursor-pointer">
                                                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                        </div>
                                        <div className="relative flex-1">
                                            <select value={filterPaymentMethod} onChange={(e) => setFilterPaymentMethod(e.target.value)} className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none cursor-pointer">
                                                {PAYMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    
                                    <Table 
                                        columns={transactionColumns} 
                                        data={paginatedOrders} // ✅ GUNAKAN DATA YANG SUDAH DI-PAGINASI
                                        onRowClick={(row) => { setViewOrder(row); }} 
                                        emptyMessage="Tidak ada data transaksi untuk periode ini." 
                                    />

                                    {/* ✅ KOMPONEN PAGINATION */}
                                    <Pagination 
                                        currentPage={currentPage}
                                        totalItems={filteredOrders.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'top-items' && (
                            <TopSellingItems startDate={startDateStr} endDate={endDateStr} selectedPeriod={PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label} />
                        )}
                    </div>
                </Card>
            </div>

            {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}

            <ConfirmModal
                isOpen={isVoidModalOpen}
                onClose={() => !isVoiding && setIsVoidModalOpen(false)}
                onConfirm={confirmVoid}
                title="Batalkan Transaksi"
                message={`Apakah Anda yakin ingin membatalkan Order #${orderToVoid?.dailyNumber || orderToVoid?.orderId}? Tindakan ini akan mengubah status menjadi "Cancelled", mengembalikan stok, dan mengurangi omzet.`}
                confirmText={isVoiding ? 'Memproses...' : 'Ya, Batalkan'}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                disabled={isVoiding}
            />
        </>
    );
};

export default Reports;