import React, { useState, useEffect } from 'react';
import { Award, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import Table from '../common/Table';
import { formatCurrency } from '../../utils/helpers';
import { api } from '../../services/api';

const TopSellingItems = ({ startDate, endDate, selectedPeriod }) => {
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!startDate || !endDate) return;

            setLoading(true);
            try {
                const response = await api.getTopSellingItems(startDate, endDate);
                // ⚠️ PERBAIKAN: Controller mengembalikan { success: true, data: [...] }
                // Jadi kita ambil response.data.data
                setTopItems(response.data.data || []);
            } catch (error) {
                console.error("Gagal mengambil top items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    const columns = [
        { 
            header: 'Rank', 
            render: (_, __, index) => <span className="font-bold text-lg text-blue-600">#{index + 1}</span> 
        },
        { 
            header: 'Nama Item', 
            accessor: 'name', 
            render: (name) => <span className="font-semibold">{name}</span> 
        },
        { 
            header: 'Qty Terjual', 
            accessor: 'totalQty', // Sesuai backend (reportController.js)
            render: (qty) => <span className="text-green-600 font-bold">{qty} porsi</span> 
        },
        { 
            header: 'Total Omzet', 
            accessor: 'totalRevenue', // Sesuai backend (reportController.js)
            render: formatCurrency 
        },
        { 
            header: 'Kontribusi', 
            accessor: 'percentage', 
            render: (percent) => (
                <div className="flex items-center w-32">
                    <div className="grow bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-blue-700">{percent.toFixed(1)}%</span>
                </div>
            ) 
        },
    ];

    if (loading) {
        return (
            <Card title="Item Terlaris (Top 10)" icon={Award} className="mt-6">
                <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                    <span>Menghitung data penjualan...</span>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Item Terlaris (Top 10)" icon={Award} className="mt-6">
            <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
                <span>Berdasarkan kuantitas terjual</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {selectedPeriod || 'Periode Kustom'}
                </span>
            </div>
            <Table 
                columns={columns} 
                data={topItems} 
                emptyMessage={`Tidak ada data penjualan item dalam periode ini.`}
            />
        </Card>
    );
};

export default TopSellingItems;