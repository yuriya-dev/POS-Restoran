import React, { useState, useMemo } from 'react';
import { Utensils, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Package, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../shared/components/common/Card';
import Table from '../../shared/components/common/Table';
import Button from '../../shared/components/common/Button';
import ConfirmModal from '../../shared/components/common/ConfirmModal';
import MenuItemForm from '../components/management/MenuItemForm';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../../shared/utils/helpers';

const MenuItems = () => {
    const { menuItems, categories, deleteMenuItem, refreshData } = useData();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. Map Kategori (ID -> Nama)
    const categoryMap = useMemo(() => {
        if (!Array.isArray(categories)) return {};
        return categories.reduce((map, cat) => {
            map[cat.categoryId] = cat.name; 
            return map;
        }, {});
    }, [categories]);

    // 2. Filter & Search Logic
    const filteredItems = useMemo(() => {
        if (!Array.isArray(menuItems)) return [];

        return menuItems.filter(item => {
            const categoryMatch = filterCategory === 'all' || item.category == filterCategory;
            const searchMatch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            return categoryMatch && searchMatch;
        }).sort((a, b) => a.name.localeCompare(b.name));
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
        if (!selectedItem) return;
        setIsDeleting(true);
        
        try {
            await toast.promise(
                deleteMenuItem(selectedItem.itemId),
                {
                    loading: 'Menghapus item...',
                    success: 'Item berhasil dihapus',
                    error: (err) => `Gagal menghapus: ${err.response?.data?.message || err.message}`
                }
            );
            await refreshData('menuItems');
        } catch (error) {
            console.error("Delete Error:", error);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
            setSelectedItem(null);
        }
    };

    const handleSaveSuccess = async () => {
        await refreshData('menuItems');
        setSelectedItem(null);
        setIsFormOpen(false);
        toast.success('Data menu berhasil diperbarui');
    };
    
    // Definisi Kolom Tabel
    const columns = [
        { 
            header: 'Item', 
            accessor: 'name', 
            render: (name, item) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                        {item.image_url ? (
                            <img 
                                src={item.image_url} 
                                alt={name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <Utensils className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">{name}</span>
                </div>
            )
        },
        { 
            header: 'Kategori', 
            accessor: 'category', 
            render: (val) => (
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                    {categoryMap[val] || 'Uncategorized'}
                </span>
            )
        },
        { 
            header: 'Harga', 
            accessor: 'price', 
            render: (val) => <span className="font-mono text-gray-700 dark:text-gray-300">{formatCurrency(val)}</span>
        },
        { 
            header: 'Stok', 
            accessor: 'stock', 
            render: (val) => (
                <div className={`flex items-center font-bold ${val < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Package className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                    {val !== undefined ? val : 0}
                </div>
            )
        },
        { 
            header: 'Status', 
            accessor: 'isAvailable', 
            render: (isAvailable) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    isAvailable 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                }`}>
                    {isAvailable ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {isAvailable ? 'Tersedia' : 'Habis'}
                </span>
            )
        },
        { 
            header: 'Aksi', 
            render: (_, item) => (
                <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(item)} icon={<Edit className="w-4 h-4" />}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item)} icon={<Trash2 className="w-4 h-4" />}>
                        Hapus
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 transition-colors duration-200 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Utensils className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" /> 
                        Manajemen Menu & Stok
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola daftar makanan, harga, dan jumlah stok harian.</p>
                </div>
            </div>

            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                    
                    {/* Search & Filter Group */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto flex-grow mr-4">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari menu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            />
                            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        
                        {/* Filter Kategori */}
                        <div className="relative w-full sm:w-48">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                                ))}
                            </select>
                            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Button Tambah */}
                    <Button 
                        variant="primary" 
                        onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} 
                        icon={<Plus className="w-5 h-5" />}
                        className="w-full md:w-auto whitespace-nowrap"
                    >
                        Tambah Menu
                    </Button>
                </div>

                {/* Table */}
                <Table 
                    columns={columns} 
                    data={filteredItems} 
                    emptyMessage="Tidak ada menu yang ditemukan." 
                />
            </Card>

            {/* Modal Form */}
            <MenuItemForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                item={selectedItem}
                onSave={handleSaveSuccess} 
            />

            {/* Modal Konfirmasi Hapus */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => !isDeleting && setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Menu"
                message={
                    <span className="block dark:text-gray-300">
                        Apakah Anda yakin ingin menghapus menu <strong className="text-gray-900 dark:text-white">{selectedItem?.name}</strong>?
                        <br/>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Tindakan ini tidak dapat dibatalkan.</span>
                    </span>
                }
                confirmText={isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
                disabled={isDeleting}
            />
        </div>
    );
};

export default MenuItems;