import React, { useMemo, memo } from 'react'; // 1. Import memo
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

// --- FUNGSI PREPARASI DATA ---
const prepareChartData = (orders = [], period) => {
    if (!Array.isArray(orders) || orders.length === 0) {
        return [];
    }

    const dailyData = orders.reduce((acc, order) => {
        if (order.createdAt) {
            const dateKey = format(new Date(order.createdAt), 'yyyy-MM-dd');
            acc[dateKey] = acc[dateKey] || { date: dateKey, revenue: 0, transactions: 0 };
            // Konversi ke number
            acc[dateKey].revenue += Number(order.totalAmount || 0);
            acc[dateKey].transactions += 1;
        }
        return acc;
    }, {});
    
    return Object.values(dailyData)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => ({
            ...item,
            name: format(parseISO(item.date), 'dd/MM (EEE)', { locale: id }), 
            revenue: Math.round(item.revenue / 1000) 
        }));
};

// 2. Bungkus komponen dengan 'memo'
const SalesChart = memo(({ orders, period }) => {
    // useMemo memastikan data hanya dihitung ulang jika 'orders' atau 'period' berubah
    const data = useMemo(() => prepareChartData(orders, period), [orders, period]);

    if (data.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <BarChart3 className="w-8 h-8 mr-2 mb-2 text-gray-400" />
                <span className="text-center font-medium">Tidak ada data grafik.</span>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af" 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis 
                        yAxisId="left"
                        stroke="#9ca3af" 
                        fontSize={11}
                        tickFormatter={(value) => `${value}k`}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#10b981" 
                        hide={true} 
                    />
                    
                    <Tooltip 
                        labelFormatter={(label) => `Tanggal: ${label}`}
                        cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                        formatter={(value, name) => {
                            if (name === 'Omzet') {
                                return [formatCurrency(value * 1000), 'Omzet'];
                            }
                            return [value, 'Transaksi'];
                        }}
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: 'none', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    
                    {/* GARIS OMZET */}
                    <Line 
                        key="line-revenue" // 3. Key statis agar tidak re-mount
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Omzet" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={true} // Aktifkan animasi
                        animationDuration={1500} // Durasi animasi (ms)
                        animationEasing="ease-out"
                    />

                    {/* GARIS TRANSAKSI */}
                    <Line 
                        key="line-transaction" // 3. Key statis
                        yAxisId="right"
                        type="monotone" 
                        dataKey="transactions" 
                        name="Transaksi" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="4 4"
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
// Fungsi pembanding khusus (opsional) agar memo bekerja lebih ketat
}, (prevProps, nextProps) => {
    // Hanya render ulang jika jumlah orders berubah atau periode berubah
    return prevProps.period === nextProps.period && prevProps.orders === nextProps.orders;
});

export default SalesChart;