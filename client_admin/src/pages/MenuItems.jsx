import React, { useState, useMemo } from 'react';
import { Utensils, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; // ✅ Import Toast

import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import MenuItemForm from '../components/management/MenuItemForm';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';

const MenuItems = () => {
    // Ambil data dan fungsi CRUD dari Context (yang sudah terhubung API)
    const { menuItems, categories, deleteMenuItem, refreshData } = useData();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false); // State loading saat hapus

    // 1. Map Kategori (ID -> Nama) untuk tampilan tabel
    const categoryMap = useMemo(() => {
        // Safety check jika categories belum terload
        if (!Array.isArray(categories)) return {};
        return categories.reduce((map, cat) => {
            map[cat.id] = cat.name; 
            return map;
        }, {});
    }, [categories]);

    // 2. Filter & Search Logic
    const filteredItems = useMemo(() => {
        if (!Array.isArray(menuItems)) return [];

        return menuItems.filter(item => {
            // Filter Kategori (loose comparison untuk cover string/number ID)
            const categoryMatch = filterCategory === 'all' || 
                                  item.category == filterCategory;

            // Search by Name
            const searchMatch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            
            return categoryMatch && searchMatch;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [menuItems, filterCategory, searchTerm]);

    // Handler: Buka Modal Edit
    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    // Handler: Buka Modal Hapus
    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // 3. Eksekusi Hapus ke API
    const confirmDelete = async () => {
        if (!selectedItem) return;
        setIsDeleting(true);
        
        try {
            // Panggil fungsi delete dari Context (gunakan Toast Promise untuk feedback)
            await toast.promise(
                deleteMenuItem(selectedItem.itemId),
                {
                    loading: 'Menghapus item...',
                    success: 'Item berhasil dihapus',
                    error: (err) => `Gagal menghapus: ${err.message}`
                }
            );
            await refreshData('menuItems'); // Refresh list agar data hilang dari tabel
        } catch (error) {
            console.error("Delete Error:", error);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
            setSelectedItem(null);
        }
    };

    // Handler: Sukses Simpan/Update (Dipanggil dari MenuItemForm)
    const handleSaveSuccess = async () => {
        await refreshData('menuItems');
        setSelectedItem(null);
        setIsFormOpen(false);
        toast.success('Data menu berhasil diperbarui');
    };
    
    // 4. Definisi Kolom Tabel
    // Komponen kecil untuk handle gambar aman
    const SafeImage = ({ src, alt }) => {
        const [error, setError] = useState(false);

        if (error || !src) {
            return <Utensils className="w-5 h-5 text-gray-400" />;
        }

        return (
            <img 
                src={src} 
                alt={alt} 
                className="w-full h-full object-cover"
                onError={() => setError(true)} 
            />
        );
    };

    const columns = [
        { 
            header: 'Item', 
            accessor: 'name', 
            render: (name, item) => (
                <div className="flex items-center space-x-3">
                    {/* Gambar Menu */}
                    <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <SafeImage src={item.image_url} alt={name} />
                    </div>
                    <span className="font-semibold text-gray-800">{name}</span>
                </div>
            )
        },
        { 
            header: 'Kategori', 
            accessor: 'category', 
            render: (val) => (
                <span className="text-gray-600 text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-md">
                    {categoryMap[val] || 'Uncategorized'}
                </span>
            )
        },
        { 
            header: 'Harga', 
            accessor: 'price', 
            render: (val) => <span className="font-mono">{formatCurrency(val)}</span>
        },
        { 
            header: 'Status', 
            accessor: 'isAvailable', 
            render: (isAvailable) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    isAvailable 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {isAvailable ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {isAvailable ? 'Tersedia' : 'Habis'}
                </span>
            )
        },
        { 
            header: 'Aksi', 
            // Menggunakan (_, item) agar akses object row benar
            render: (_, item) => (
                <div className="flex space-x-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleEdit(item)} 
                        icon={<Edit className="w-4 h-4" />}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(item)} 
                        icon={<Trash2 className="w-4 h-4" />}
                    >
                        Hapus
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Utensils className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Menu
            </h1>
            <p className="text-gray-500">Kelola daftar makanan, minuman, harga, dan ketersediaan stok.</p>

            <Card className="p-4 sm:p-6">
                {/* Toolbar: Search, Filter, Add */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                    
                    {/* Search & Filter Group */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto grow mr-4">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari menu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        
                        {/* Filter Kategori */}
                        <div className="relative w-full sm:w-48">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg w-full text-sm bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {/* Chevron Icon Custom */}
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
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

                {/* Data Table */}
                <Table 
                    columns={columns} 
                    data={filteredItems} 
                    emptyMessage="Tidak ada menu yang ditemukan." 
                />
            </Card>

            {/* Modal Create/Edit */}
            <MenuItemForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                item={selectedItem}
                onSave={handleSaveSuccess} 
            />

            {/* Confirmation Modal (Delete) */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => !isDeleting && setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Menu"
                
                message={`Apakah Anda yakin ingin menghapus menu "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                
                confirmText={isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                confirmButtonClass="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
            />
        </div>
    );
};

export default MenuItems;