// pages/MenuItems.jsx

import React, { useState, useMemo } from 'react';
import { Utensils, Plus, Edit, Trash2, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import MenuItemForm from '../components/management/MenuItemForm'; // Import yang sudah diperbaiki
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';

const MenuItems = () => {
    const { menuItems, categories, deleteMenuItem, refreshData } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categoryMap = useMemo(() => {
        return categories.reduce((map, cat) => {
            map[cat.kategori_id] = cat.nama_kategori;
            return map;
        }, {});
    }, [categories]);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const categoryMatch = filterCategory === 'all' || item.kategori_id === filterCategory;
            const searchMatch = item.nama_item.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        }).sort((a, b) => a.nama_item.localeCompare(b.nama_item));
    }, [menuItems, filterCategory, searchTerm]);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteMenuItem(selectedItem.item_id);
            // Notifikasi sukses (di real project)
        } catch (error) {
            console.error("Gagal menghapus item menu:", error);
        } finally {
            setIsModalOpen(false);
            setSelectedItem(null);
        }
    };
    
    // Kolom Tabel
    const columns = [
        { header: 'Item', accessor: 'nama_item', render: (name, item) => (
            <div className="flex items-center space-x-3">
                <img 
                    src={item.gambar_url || 'https://via.placeholder.com/50'} 
                    alt={name} 
                    className="w-10 h-10 rounded object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50'; }}
                />
                <span className="font-semibold">{name}</span>
            </div>
        )},
        { header: 'Kategori', accessor: 'kategori_id', render: (id) => (
            <span className="text-gray-600 text-sm">{categoryMap[id] || 'N/A'}</span>
        )},
        { header: 'Harga', accessor: 'harga', render: formatCurrency },
        { 
            header: 'Status', 
            accessor: 'is_active', 
            render: (isActive) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {isActive ? 'Aktif' : 'Nonaktif'}
                </span>
            )
        },
        { header: 'Aksi', render: (item) => (
            <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(item)} icon={<Edit className="w-4 h-4" />}>
                    Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item)} icon={<Trash2 className="w-4 h-4" />}>
                    Hapus
                </Button>
            </div>
        )}
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Utensils className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Item Menu</h1>
            <p className="text-gray-500">Kelola daftar item menu, harga, dan kategorinya.</p>

            <Card className="p-4 sm:p-6">
                {/* Controls, Search, Filter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                    {/* Search & Filter */}
                    <div className="flex space-x-3 w-full md:w-3/4">
                        {/* Search */}
                        <div className="relative w-1/2">
                            <input
                                type="text"
                                placeholder="Cari nama item..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        {/* Filter Kategori */}
                        <div className="relative w-1/2">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.kategori_id} value={cat.kategori_id}>{cat.nama_kategori}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Button Tambah */}
                    <Button 
                        variant="primary" 
                        onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} 
                        icon={<Plus className="w-5 h-5" />}
                        className="w-full md:w-auto"
                    >
                        Tambah Item Menu
                    </Button>
                </div>

                <Table 
                    columns={columns} 
                    data={filteredItems} 
                    emptyMessage="Tidak ada item menu ditemukan sesuai kriteria filter." 
                />
                
            </Card>

            {/* Modal Create/Edit */}
            <MenuItemForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                item={selectedItem}
                onSave={() => setSelectedItem(null)}
            />

            {/* Confirmation Modal (Delete) */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Item Menu"
                message={`Apakah Anda yakin ingin menghapus item **${selectedItem?.nama_item}**? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus Item"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default MenuItems;