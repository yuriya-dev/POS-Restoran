// pages/MenuCategories.jsx (Kode Anda, dengan struktur komponen terpisah)

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Tag, Edit, Trash2, ListOrdered, UtensilsCrossed, Coffee, Cake, ChevronDown, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal'; // Asumsi komponen Modal dasar tersedia
import { useData } from '../context/DataContext';

// Mapping ikon Lucide ke nama string
const iconOptions = {
    'Makanan Utama': UtensilsCrossed,
    'Minuman': Coffee,
    'Dessert': Cake,
    'Lain-lain': Tag
};

// --- Komponen Modal Form Kategori ---
const CategoryForm = ({ isOpen, onClose, category, onSave }) => {
    const { createCategory, updateCategory, categories } = useData();
    const [formData, setFormData] = useState({ 
        nama_kategori: '', 
        icon: 'Makanan Utama', 
        sort_order: 0 
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEdit = !!category;

    useEffect(() => {
        if (category) {
            setFormData({
                nama_kategori: category.nama_kategori,
                icon: category.icon,
                sort_order: category.sort_order,
            });
        } else {
            // Set default order: last order + 1
            const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.sort_order), 0);
            setFormData({ nama_kategori: '', icon: 'Makanan Utama', sort_order: maxOrder + 1 });
        }
        setError('');
    }, [category, categories, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'sort_order' ? parseInt(value) || 0 : value // Pastikan order adalah integer
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.nama_kategori.trim()) {
            setError('Nama kategori tidak boleh kosong.');
            return;
        }
        const isDuplicate = categories.some(cat => 
            cat.nama_kategori.toLowerCase() === formData.nama_kategori.trim().toLowerCase() && 
            (!isEdit || cat.kategori_id !== category.kategori_id)
        );
        if (isDuplicate) {
            setError('Nama kategori sudah ada. Mohon gunakan nama lain.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await updateCategory(category.kategori_id, formData);
            } else {
                await createCategory(formData);
            }
            onSave();
            onClose();
        } catch (err) {
            setError('Gagal menyimpan kategori. Silakan coba lagi.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const SelectedIcon = iconOptions[formData.icon];

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Kategori: ${category?.nama_kategori}` : 'Tambah Kategori Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded-md"><AlertTriangle className='w-4 h-4 mr-1 inline-block'/> {error}</div>}
                
                {/* Input Nama Kategori */}
                <div>
                    <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                    <input
                        id="nama_kategori"
                        name="nama_kategori"
                        type="text"
                        value={formData.nama_kategori}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Makanan Utama"
                        required
                    />
                </div>

                {/* Icon Selector */}
                <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Pilih Ikon</label>
                    <div className="flex items-center space-x-3 mt-1">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
                            {SelectedIcon && <SelectedIcon className="w-6 h-6 text-blue-600" />}
                        </div>
                        <div className="relative flex-grow">
                            <select
                                id="icon"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.keys(iconOptions).map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                
                {/* Input Urutan */}
                <div>
                    <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">Urutan Tampil (Sort Order)</label>
                    <input
                        id="sort_order"
                        name="sort_order"
                        type="number"
                        min="0"
                        value={formData.sort_order}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 1"
                        required
                    />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Batal</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Kategori')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};


// --- Komponen Utama: MenuCategories ---
const MenuCategories = () => {
    const { categories, menuItems, deleteCategory } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Hitung item count menggunakan useMemo untuk performa
    const categoryItemCounts = useMemo(() => {
        return menuItems.reduce((acc, item) => {
            acc[item.kategori_id] = (acc[item.kategori_id] || 0) + 1;
            return acc;
        }, {});
    }, [menuItems]);

    const getCategoryItemCount = (categoryId) => {
        return categoryItemCounts[categoryId] || 0;
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        const itemCount = getCategoryItemCount(selectedCategory.kategori_id);
        
        // Pencegahan Penghapusan
        if (itemCount > 0) {
            // Mengganti alert dengan notifikasi yang lebih baik (jika ada) atau tetap menggunakan alert.
            // Di sini, kita akan membiarkan modal terbuka dengan pesan error yang diperbarui.
            // Namun, karena ini adalah ConfirmModal, kita akan menggunakan alert sementara.
            alert(`GAGAL: Kategori "${selectedCategory.nama_kategori}" memiliki ${itemCount} item menu terkait. Hapus item menu terlebih dahulu.`);
            setIsModalOpen(false);
            return;
        }

        try {
            await deleteCategory(selectedCategory.kategori_id);
        } catch (error) {
            console.error("Gagal menghapus kategori:", error);
            alert("Gagal menghapus kategori. Cek console untuk detail.");
        } finally {
            setIsModalOpen(false);
            setSelectedCategory(null);
        }
    };

    // Data yang akan ditampilkan di tabel, sudah di-sort
    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => a.sort_order - b.sort_order);
    }, [categories]);

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
            accessor: 'kategori_id', // Menggunakan ID untuk mendapatkan count
            render: (id) => {
                const count = getCategoryItemCount(id);
                return (
                    <span className={`font-semibold ${count > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        {count} item
                    </span>
                );
            }
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Kategori Menu</h1>
            <p className="text-gray-500">Kelola dan atur urutan kategori menu restoran Anda.</p>

            <Card className="p-4 sm:p-6">
                <div className="flex justify-end mb-6">
                    <Button 
                        variant="primary" 
                        onClick={() => { setIsFormOpen(true); setSelectedCategory(null); }} 
                        icon={<Plus className="w-5 h-5" />}
                    >
                        Tambah Kategori Baru
                    </Button>
                </div>

                <Table columns={columns} data={sortedCategories} emptyMessage="Belum ada kategori menu yang ditambahkan." />
            </Card>

            {/* Modal Create/Edit */}
            <CategoryForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                category={selectedCategory}
                onSave={() => setSelectedCategory(null)}
            />

            {/* Confirmation Modal (Delete) */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Kategori Menu"
                message={`Apakah Anda yakin ingin menghapus kategori **${selectedCategory?.nama_kategori}**? Penghapusan akan GAGAL jika masih ada item menu terkait. (Item: **${getCategoryItemCount(selectedCategory?.kategori_id)}**)`}
                confirmText="Ya, Hapus"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default MenuCategories;