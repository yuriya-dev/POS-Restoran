// components/reports/SalesChart.jsx

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { BarChart3 } from 'lucide-react'; // <-- PERBAIKAN: Import BarChart3
import { formatCurrency } from '../../utils/helpers'; // <-- PERBAIKAN: Import formatCurrency

// --- FUNGSI PREPARASI DATA CHART ---
/**
 * Mengelompokkan pesanan berdasarkan tanggal dan menghitung omzet harian.
 * @param {Array} orders - Daftar pesanan yang akan diproses.
 * @param {string} period - Periode yang akan ditampilkan (saat ini tidak digunakan, tetapi dipertahankan).
 */
const prepareChartData = (orders = [], period) => { // <-- Safety default orders = []
    
    // Periksa jika orders bukan array atau kosong
    if (!Array.isArray(orders) || orders.length === 0) {
        return [];
    }

    // Kelompokkan data berdasarkan Hari
    const dailyData = orders.reduce((acc, order) => {
        // Pastikan order memiliki waktu_pesan yang valid
        if (order.waktu_pesan) {
            const dateKey = format(parseISO(order.waktu_pesan), 'yyyy-MM-dd');
            acc[dateKey] = acc[dateKey] || { date: dateKey, revenue: 0, transactions: 0 };
            acc[dateKey].revenue += order.total_bayar;
            acc[dateKey].transactions += 1;
        }
        return acc;
    }, {});
    
    // Ubah menjadi array dan format tanggal
    return Object.values(dailyData)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => ({
            ...item,
            // Format tanggal yang lebih informatif untuk sumbu X
            name: format(parseISO(item.date), 'dd/MM (EEE)', { locale: id }), 
            // Diskalakan ke K Rupiah agar mudah dilihat di sumbu Y chart
            revenue: Math.round(item.revenue / 1000) 
        }));
};

/**
 * Komponen Grafik Penjualan (Omzet dan Jumlah Transaksi)
 * @param {object} props - Mengandung orders (dari DataContext) dan period.
 */
const SalesChart = ({ orders, period }) => {
    // Memproses data hanya jika orders atau period berubah
    const data = useMemo(() => prepareChartData(orders, period), [orders, period]);

    if (data.length === 0) {
        return (
            <div className="h-80 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200 p-4">
                <BarChart3 className="w-8 h-8 mr-2 mb-2 text-gray-400" />
                <span className="text-center">Tidak ada data penjualan yang cukup untuk ditampilkan.</span>
                <span className="text-sm mt-1 text-gray-400">Pastikan ada pesanan dengan status 'completed'.</span>
            </div>
        );
    }
    
    return (
        <div className="w-full h-80 p-0 md:p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#6b7280" // Gray-500
                        padding={{ left: 10, right: 10 }}
                        fontSize={12}
                    />
                    <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickFormatter={(value) => `Rp ${value}K`}
                    />
                    <Tooltip 
                        labelFormatter={(label) => `Tanggal: ${label}`}
                        // Menggunakan formatCurrency untuk Omzet, dan memastikan Omzet dikembalikan ke nilai aslinya (dikali 1000)
                        formatter={(value, name) => [
                            name === 'Omzet (K)' ? formatCurrency(value * 1000) : value, 
                            name === 'Omzet (K)' ? 'Omzet' : 'Transaksi'
                        ]}
                        contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px',
                            padding: '8px'
                        }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    <Line 
                        type="monotone" 
                        yAxisId={0}
                        dataKey="revenue" 
                        name="Omzet (K)" 
                        stroke="#1D4ED8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }} 
                    />
                    <Line 
                        type="monotone" 
                        yAxisId={0}
                        dataKey="transactions" 
                        name="Transaksi" 
                        stroke="#059669"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;