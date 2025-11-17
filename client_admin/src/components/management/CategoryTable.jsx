import React, { useMemo } from 'react';
import { Edit, Trash2, ListOrdered, Tag, UtensilsCrossed, Coffee, Cake } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import { useData } from '../../context/DataContext';

// Mapping ikon Lucide yang sama dari MenuCategories.jsx
const iconOptions = {
    'Makanan Utama': UtensilsCrossed,
    'Minuman': Coffee,
    'Dessert': Cake,
    'Lain-lain': Tag
};

/**
 * Komponen Tabel Khusus untuk menampilkan daftar Kategori Menu.
 * Menggunakan useData untuk mengambil categories dan menuItems.
 * @param {function} onEdit - Handler saat tombol Edit diklik.
 * @param {function} onDelete - Handler saat tombol Hapus diklik.
 */
const CategoryTable = ({ onEdit, onDelete }) => {
    const { categories, menuItems } = useData();
    
    // Sortir kategori berdasarkan sort_order dan hitung jumlah item terkait
    const processedCategories = useMemo(() => {
        const itemCounts = menuItems.reduce((acc, item) => {
            acc[item.kategori_id] = (acc[item.kategori_id] || 0) + 1;
            return acc;
        }, {});

        return [...categories]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(cat => ({
                ...cat,
                item_count: itemCounts[cat.kategori_id] || 0
            }));
    }, [categories, menuItems]);

    // Definisi Kolom Tabel
    const columns = [
        { header: 'Icon', accessor: 'icon', render: (iconName) => {
            const IconComponent = iconOptions[iconName] || Tag;
            return <IconComponent className="w-5 h-5 text-blue-600" />;
        }},
        { header: 'Nama Kategori', accessor: 'nama_kategori' },
        { 
            header: 'Urutan', 
            accessor: 'sort_order',
            render: (order) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <ListOrdered className="w-3 h-3 mr-1" />
                    {order}
                </span>
            )
        },
        { 
            header: 'Jumlah Item', 
            accessor: 'item_count', 
            render: (count) => (
                <span className={`font-semibold ${count > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {count} item
                </span>
            )
        },
        { header: 'Aksi', render: (item) => (
            <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(item)} icon={<Edit className="w-4 h-4" />}>
                    Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(item)} icon={<Trash2 className="w-4 h-4" />}>
                    Hapus
                </Button>
            </div>
        )}
    ];

    return (
        <Table 
            columns={columns} 
            data={processedCategories} 
            emptyMessage="Belum ada kategori menu yang ditambahkan." 
        />
    );
};

export default CategoryTable;