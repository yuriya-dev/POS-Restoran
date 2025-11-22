import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { 
    DollarSign, Lock, Unlock, Printer, TrendingUp, ShoppingBag, 
    AlertTriangle, CheckCircle, BarChart3 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { usePDF } from 'react-to-pdf'; // ✅ Gunakan ini

const ShiftDashboard = () => {
    const { user } = useAuth();
    
    const [activeShift, setActiveShift] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [summary, setSummary] = useState(null);
    const [startCashInput, setStartCashInput] = useState('');
    const [endCashInput, setEndCashInput] = useState('');
    
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [shiftReport, setShiftReport] = useState(null); 

    // ✅ Setup PDF Generator untuk Laporan Shift
    const { toPDF, targetRef } = usePDF({filename: `laporan_shift_${new Date().toISOString().slice(0,10)}.pdf`});

    // ... (useEffect dan fungsi fetch tetap sama) ...
    useEffect(() => { checkShiftStatus(); }, [user]);

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

    if (loading) return <div className="p-10 text-center">Memuat Data Shift...</div>;

    // CASE 1: TAMPILAN STRUK AKHIR (REPORT)
    if (shiftReport) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Area yang akan di-PDF-kan */}
                    <div ref={targetRef} className="p-8 bg-white">
                        <div className="text-center mb-6 border-b pb-4 border-dashed">
                            <h2 className="text-2xl font-bold text-gray-800">Laporan Tutup Shift</h2>
                            <p className="text-gray-500 text-sm">{new Date().toLocaleString()}</p>
                            <p className="text-gray-500 text-sm">Kasir: {shiftReport.kasir}</p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex justify-between"><span>Waktu Buka</span><span>{new Date(shiftReport.startTime).toLocaleTimeString()}</span></div>
                            <div className="flex justify-between"><span>Modal Awal</span><span>{formatCurrency(shiftReport.startCash)}</span></div>
                            <div className="border-t border-dashed my-2"></div>
                            <div className="flex justify-between font-semibold"><span>Penjualan Tunai</span><span>{formatCurrency(shiftReport.cashSales)}</span></div>
                            <div className="flex justify-between"><span>Penjualan Non-Tunai</span><span>{formatCurrency(shiftReport.nonCashSales)}</span></div>
                            <div className="flex justify-between font-bold text-blue-600"><span>Total Omzet</span><span>{formatCurrency(shiftReport.totalSales)}</span></div>
                            <div className="border-t border-dashed my-2"></div>
                            <div className="flex justify-between"><span>Total Uang di Laci (Sistem)</span><span>{formatCurrency(shiftReport.expectedEndCash)}</span></div>
                            <div className="flex justify-between font-bold"><span>Uang Fisik (Aktual)</span><span>{formatCurrency(shiftReport.actualEndCash)}</span></div>
                            <div className={`flex justify-between font-bold p-2 rounded ${shiftReport.difference === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <span>Selisih</span><span>{formatCurrency(shiftReport.difference)}</span>
                            </div>
                        </div>
                        <div className="mt-8 text-center text-xs text-gray-400"><p>Dicetak otomatis oleh sistem POS</p></div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="p-6 bg-gray-50 border-t flex flex-col gap-3">
                        <button 
                            onClick={() => toPDF()} // ✅ Gunakan toPDF
                            className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold flex items-center justify-center hover:bg-gray-900"
                        >
                            <Printer className="w-5 h-5 mr-2" /> Download Laporan (PDF)
                        </button>
                        
                        {!activeShift && ( 
                             <button onClick={() => setShiftReport(null)} className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                                Kembali ke Menu Utama
                            </button>
                        )}

                        {activeShift && (
                             <button onClick={confirmCloseShift} className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">
                                Konfirmasi Tutup Shift
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // CASE 2: FORM BUKA SHIFT (Sama seperti sebelumnya)
    if (!activeShift) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Unlock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Buka Shift Kasir</h2>
                        <p className="text-gray-500">Masukkan modal awal di laci kasir.</p>
                    </div>
                    <form onSubmit={handleStartShift}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modal Awal (Rp)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-bold">Rp</span>
                                </div>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-lg font-medium"
                                    placeholder="0"
                                    value={startCashInput}
                                    onChange={(e) => setStartCashInput(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                            Buka Kasir
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // CASE 3: DASHBOARD KASIR (Sama seperti sebelumnya)
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <BarChart3 className="w-7 h-7 mr-3 text-blue-600" /> Dashboard Shift
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Shift Aktif sejak {new Date(activeShift.startTime).toLocaleTimeString()}
                    </div>
                </div>
                <button onClick={() => setShowCloseModal(true)} className="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-red-200 transition flex items-center">
                    <Lock className="w-5 h-5 mr-2" /> Tutup Shift
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">Total Penjualan</span>
                        <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary?.summary.totalSales || 0)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">Tunai (Cash)</span>
                        <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary?.summary.totalCash || 0)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">Total Transaksi</span>
                        <div className="p-2 bg-purple-50 rounded-lg"><ShoppingBag className="w-5 h-5 text-purple-600" /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{summary?.summary.totalTransactions || 0} <span className="text-sm font-normal text-gray-400">Order</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                    <h3 className="font-bold text-gray-800 mb-6">Grafik Penjualan (Per Jam)</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={summary?.chartData || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="time" stroke="#9ca3af" tickFormatter={val => `${val}`} />
                            <YAxis stroke="#9ca3af" tickFormatter={val => `${val/1000}k`} />
                            <Tooltip formatter={(value) => [formatCurrency(value), 'Omzet']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" /> Menu Terlaris
                    </h3>
                    <div className="space-y-4">
                        {summary?.topItems?.length > 0 ? (
                            summary.topItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-600 mr-3">
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">{item.qty} x</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">Belum ada penjualan</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Input Tutup Kasir */}
            {showCloseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Tutup Shift Kasir</h3>
                        <p className="text-gray-500 text-sm mb-6">Hitung uang fisik di laci dan masukkan jumlahnya.</p>
                        
                        <label className="block text-sm font-bold text-gray-700 mb-2">Total Uang Tunai (Aktual)</label>
                        <input 
                            type="number"
                            className="w-full border-2 border-gray-200 rounded-xl p-3 mb-6 focus:border-blue-500 outline-none text-lg font-bold"
                            placeholder="Rp 0"
                            value={endCashInput}
                            onChange={(e) => setEndCashInput(e.target.value)}
                            autoFocus
                        />
                        
                        <div className="flex gap-3">
                            <button onClick={() => setShowCloseModal(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Batal</button>
                            <button onClick={handleCalculateClose} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Lanjut</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftDashboard;