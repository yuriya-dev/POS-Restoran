import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../../shared/services/api';
import { formatCurrency } from '../../shared/utils/helpers';
import { 
    DollarSign, Lock, Unlock, Printer, TrendingUp, ShoppingBag, 
    AlertTriangle, CheckCircle, BarChart3, Wallet 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { usePDF } from 'react-to-pdf'; 

const ShiftDashboard = () => {
    const { user } = useAuth();
    
    const [activeShift, setActiveShift] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [summary, setSummary] = useState(null);
    const [startCashInput, setStartCashInput] = useState('');
    const [endCashInput, setEndCashInput] = useState('');
    
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [shiftReport, setShiftReport] = useState(null); 

    // Setup PDF Generator untuk Laporan Shift
    const { toPDF, targetRef } = usePDF({filename: `laporan_shift_${new Date().toISOString().slice(0,10)}.pdf`});

    useEffect(() => { checkShiftStatus(); }, [user]);

    // Handle ESC Key untuk Modal Tutup Shift
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && showCloseModal) {
                setShowCloseModal(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showCloseModal]);

    const checkShiftStatus = async () => {
        try {
            const res = await api.getShiftActive(user.userId);
            if (res.data.data) {
                setActiveShift(res.data.data);
                loadDashboardData();
            } else {
                setActiveShift(null);
            }
        } catch (error) {
            console.error("Cek shift gagal:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardData = async () => {
        try {
            const res = await api.getShiftSummary();
            setSummary(res.data);
        } catch (error) {
            console.error("Load summary gagal:", error);
        }
    };

    const handleStartShift = async (e) => {
        e.preventDefault();
        if (!startCashInput) return toast.error("Masukkan modal awal");
        try {
            await api.startShift({ userId: user.userId, startCash: parseFloat(startCashInput) });
            toast.success("Shift Kasir Dibuka!");
            setStartCashInput('');
            checkShiftStatus();
        } catch (error) {
            toast.error("Gagal buka shift");
        }
    };

    const handleCalculateClose = () => {
        if (!endCashInput || !summary) return;
        const startCash = Number(activeShift.startCash);
        const cashSales = Number(summary.summary.totalCash);
        const actualEndCash = Number(endCashInput);
        const expectedEndCash = startCash + cashSales;
        const difference = actualEndCash - expectedEndCash;

        setShiftReport({
            kasir: user.fullName,
            startTime: activeShift.startTime,
            endTime: new Date().toISOString(),
            startCash,
            cashSales,
            nonCashSales: Number(summary.summary.totalNonCash),
            totalSales: Number(summary.summary.totalSales),
            expectedEndCash,
            actualEndCash,
            difference
        });
        
        setShowCloseModal(false); 
    };

    const confirmCloseShift = async () => {
        try {
            await api.endShift({
                shiftId: activeShift.shiftId,
                endCash: shiftReport.actualEndCash
            });
            toast.success("Shift Ditutup. Silakan cetak struk.");
            setActiveShift(null); 
        } catch (error) {
            toast.error("Gagal simpan tutup shift");
        }
    };

    // --- RENDER UI ---

    if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Memuat Data Shift...</div>;

    // CASE 1: TAMPILAN STRUK AKHIR (REPORT)
    if (shiftReport) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden max-w-lg w-full border border-gray-100 dark:border-gray-700">
                    {/* Area yang akan di-PDF-kan (Tetap putih agar hasil print bersih) */}
                    <div ref={targetRef} className="p-8 bg-white text-gray-900">
                        <div className="text-center mb-8 pb-6 border-b-2 border-dashed border-gray-100">
                            {/* Ubah warna hijau ke biru */}
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Laporan Tutup Shift</h2>
                            <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleString('id-ID')}</p>
                            <p className="text-gray-500 text-sm font-medium mt-1">Kasir: {shiftReport.kasir}</p>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Waktu Buka</span>
                                <span className="font-medium text-gray-900">{new Date(shiftReport.startTime).toLocaleTimeString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Modal Awal</span>
                                <span className="font-medium text-gray-900">{formatCurrency(shiftReport.startCash)}</span>
                            </div>
                            
                            <div className="h-px bg-gray-100 my-2"></div>
                            
                            <div className="flex justify-between text-gray-600">
                                <span>Penjualan Tunai</span>
                                {/* Ubah warna hijau ke biru */}
                                <span className="font-medium text-blue-600">+{formatCurrency(shiftReport.cashSales)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Penjualan Non-Tunai</span>
                                <span className="font-medium text-purple-600">{formatCurrency(shiftReport.nonCashSales)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                <span>Total Omzet</span>
                                <span>{formatCurrency(shiftReport.totalSales)}</span>
                            </div>

                            <div className="h-px bg-gray-100 my-2"></div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between text-gray-500">
                                    <span>Seharusnya di Laci</span>
                                    <span className="font-medium">{formatCurrency(shiftReport.expectedEndCash)}</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-bold text-lg">
                                    <span>Aktual di Laci</span>
                                    <span>{formatCurrency(shiftReport.actualEndCash)}</span>
                                </div>
                                {/* Ubah warna hijau ke biru jika balance */}
                                <div className={`flex justify-between font-bold text-sm px-3 py-2 rounded-lg ${shiftReport.difference === 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                    <span>Selisih</span>
                                    <span>{shiftReport.difference > 0 ? '+' : ''}{formatCurrency(shiftReport.difference)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                        <button 
                            onClick={() => toPDF()} 
                            className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-black dark:hover:bg-gray-600 transition shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <Printer className="w-5 h-5 mr-3" /> Simpan PDF
                        </button>
                        
                        {!activeShift && ( 
                             <button 
                                onClick={() => setShiftReport(null)}
                                className="w-full py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                Kembali ke Menu Utama
                            </button>
                        )}

                        {activeShift && (
                             <button 
                                onClick={confirmCloseShift}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 active:scale-95"
                            >
                                Konfirmasi Tutup Shift
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // CASE 2: FORM BUKA SHIFT
    if (!activeShift) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full border border-gray-100 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-blue-50/50 dark:ring-blue-900/20">
                            <Unlock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Buka Shift</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Siapkan modal awal untuk memulai operasional hari ini.</p>
                    </div>
                    <form onSubmit={handleStartShift}>
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Modal Awal</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold text-xl group-focus-within:text-blue-600 transition-colors">Rp</span>
                                </div>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-blue-600 focus:ring-0 outline-none text-3xl font-bold text-gray-900 dark:text-white transition-all placeholder-gray-300"
                                    placeholder="0"
                                    value={startCashInput}
                                    onChange={(e) => setStartCashInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95 transform">
                            Buka Kasir Sekarang
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // CASE 3: DASHBOARD KASIR (Jika shift aktif)
    return (
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto bg-[#F5F7FA] dark:bg-gray-900 min-h-full transition-colors duration-200">
            {/* Header Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center tracking-tight">
                        <BarChart3 className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" /> 
                        Dashboard Shift
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            {/* Ganti warna indikator aktif ke biru */}
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Aktif sejak {new Date(activeShift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => setShowCloseModal(true)}
                    className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition flex items-center shadow-sm active:scale-95"
                >
                    <Lock className="w-5 h-5 mr-2" /> Tutup Shift
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sales Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-24 h-24 text-blue-600 transform rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-sm uppercase tracking-wide">Total Penjualan</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{formatCurrency(summary?.summary.totalSales || 0)}</p>
                        <div className="mt-4 flex gap-2">
                            {/* Ganti warna hijau ke biru */}
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg flex items-center">
                                <Wallet className="w-3 h-3 mr-1" /> Cash: {formatCurrency(summary?.summary.totalCash || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Transactions Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag className="w-24 h-24 text-purple-600 transform -rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-sm uppercase tracking-wide">Total Transaksi</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{summary?.summary.totalTransactions || 0}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Pesanan hari ini</p>
                    </div>
                </div>

                {/* Top Item Card (Mini) */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2rem] shadow-xl shadow-blue-200 dark:shadow-blue-900/20 text-white relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-blue-200 font-medium mb-1 text-sm uppercase tracking-wide">Paling Laris</p>
                            <h3 className="text-2xl font-bold line-clamp-2">
                                {summary?.topItems?.[0]?.name || 'Belum ada data'}
                            </h3>
                        </div>
                        <div className="mt-4">
                            <span className="text-4xl font-black">{summary?.topItems?.[0]?.qty || 0}</span>
                            <span className="text-blue-200 text-sm ml-2">porsi terjual</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Grafik Penjualan Hari Ini */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] transition-colors">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-8 text-lg">Aktivitas Penjualan</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={summary?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#9ca3af" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tick={{fontSize: 12}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    stroke="#9ca3af" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={val => `${val/1000}k`} 
                                    tick={{fontSize: 12}}
                                />
                                <Tooltip 
                                    cursor={{stroke: '#d1d5db', strokeWidth: 1}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', padding: '12px', backgroundColor: '#fff' }}
                                    formatter={(value) => [<span className="font-bold text-blue-600">{formatCurrency(value)}</span>, 'Omzet']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#2563eb" 
                                    strokeWidth={4} 
                                    dot={{r:4, fill:'#2563eb', strokeWidth: 2, stroke:'#fff'}} 
                                    activeDot={{r:8, strokeWidth: 0}} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Items List */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center text-lg">
                        <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" /> Menu Populer
                    </h3>
                    <div className="space-y-6">
                        {summary?.topItems?.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
                                        ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                          idx === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 
                                          idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-400'}`}>
                                        {idx + 1}
                                    </span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">{item.qty}x</span>
                            </div>
                        ))}
                        {(!summary?.topItems?.length) && (
                            <div className="text-center py-10 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                Belum ada data penjualan
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Input Tutup Kasir */}
            {showCloseModal && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all"
                    onClick={() => setShowCloseModal(false)}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-[2rem] w-full max-w-md p-8 animate-in fade-in zoom-in duration-200 shadow-2xl border border-white/50 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50 dark:ring-red-900/20">
                                <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Tutup Shift</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Hitung uang fisik di laci kasir Anda.</p>
                        </div>
                        
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Total Uang Fisik</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold text-lg group-focus-within:text-red-500 transition-colors">Rp</span>
                                </div>
                                <input 
                                    type="number"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-2xl font-bold text-gray-900 dark:text-white transition-all placeholder-gray-300"
                                    placeholder="0"
                                    value={endCashInput}
                                    onChange={(e) => setEndCashInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowCloseModal(false)} 
                                className="flex-1 py-3.5 text-gray-600 dark:text-gray-300 font-bold bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition active:scale-95"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleCalculateClose}
                                className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition active:scale-95"
                            >
                                Hitung & Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftDashboard;