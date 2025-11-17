// components/reports/TopSellingItems.jsx

import React, { useMemo } from 'react';
import { Award, DollarSign, Tag, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import Table from '../common/Table';
import { formatCurrency } from '../../utils/helpers';
import { useData } from '../../context/DataContext';

// PERBAIKAN: Import data master dari mock DB menggunakan ES Module syntax
import { menuItemsData } from '../../api/data'; 

// --- FUNGSI UTILITY: Menghitung Item Terlaris ---
const calculateTopItems = (filteredOrders) => {
    const itemSales = {};
    
    // --- SIMULASI Order Items ---
    // Karena DB mock kita belum menyimpan detail item per order, 
    // kita simulasikan data item yang terjual berdasarkan orders yang difilter.
    
    const simulatedOrderItems = filteredOrders.flatMap(order => {
        // Asumsi setiap order memiliki minimal 2-5 item berbeda secara acak
        const items = [];
        const numItems = Math.floor(Math.random() * 4) + 2; 
        
        // MENGGANTI REQUIRE DENGAN VARIABEL YANG SUDAH DI-IMPORT
        const availableItems = menuItemsData; 
        
        for (let i = 0; i < numItems; i++) {
            const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            items.push({
                item_id: randomItem.item_id,
                nama_item: randomItem.nama_item,
                qty: Math.floor(Math.random() * 5) + 1, // Qty 1-5
                harga: randomItem.harga
            });
        }
        return items;
    });

    simulatedOrderItems.forEach(item => {
        const itemId = item.item_id;
        if (!itemSales[itemId]) {
            itemSales[itemId] = {
                item_id: itemId,
                nama_item: item.nama_item,
                qty_terjual: 0,
                total_revenue: 0,
            };
        }
        itemSales[itemId].qty_terjual += item.qty;
        itemSales[itemId].total_revenue += item.qty * item.harga;
    });

    const totalRevenueAll = Object.values(itemSales).reduce((acc, item) => acc + item.total_revenue, 0);

    // Ambil Top 10 dari total keseluruhan item yang terjual
    return Object.values(itemSales)
        .map(item => ({
            ...item,
            percentage: (item.total_revenue / (totalRevenueAll || 1)) * 100, // Handle division by zero
        }))
        .sort((a, b) => b.qty_terjual - a.qty_terjual)
        .slice(0, 10); 
};


const TopSellingItems = ({ filteredOrders, selectedPeriod }) => {
    const topItems = useMemo(() => calculateTopItems(filteredOrders), [filteredOrders]);

    const columns = [
        { header: 'Rank', render: (_, __, index) => <span className="font-bold text-lg text-blue-600">{index + 1}</span> },
        { 
            header: 'Nama Item', 
            accessor: 'nama_item', 
            render: (name) => <span className="font-semibold">{name}</span> 
        },
        { 
            header: 'Qty Terjual', 
            accessor: 'qty_terjual', 
            render: (qty) => <span className="text-green-600 font-bold">{qty} pcs</span> 
        },
        { header: 'Total Omzet', accessor: 'total_revenue', render: formatCurrency },
        { 
            header: '% dari Total Omzet', 
            accessor: 'percentage', 
            render: (percent) => (
                <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-blue-700">{percent.toFixed(1)}%</span>
                </div>
            ) 
        },
    ];

    return (
        <Card title="Item Terlaris (Top 10)" icon={Award} className="mt-6">
            <p className="text-gray-600 mb-4">Item menu paling laris berdasarkan kuantitas terjual dalam periode yang dipilih.</p>
            <Table 
                columns={columns} 
                data={topItems} 
                emptyMessage={`Tidak ada data penjualan item dalam periode ini (${selectedPeriod}).`}
            />
        </Card>
    );
};

export default TopSellingItems;