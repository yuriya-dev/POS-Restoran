import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Tag, Edit, Trash2, ListOrdered, UtensilsCrossed, Coffee, Cake, ChevronDown, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal'; 
import { useData } from '../context/DataContext';

// Mapping ikon Lucide
const iconOptions = {
    'UtensilsCrossed': { label: 'Makanan Utama', icon: UtensilsCrossed },
    'Coffee': { label: 'Minuman', icon: Coffee },
    'Cake': { label: 'Dessert', icon: Cake },
    'Tag': { label: 'Lain-lain', icon: Tag }
};

// --- Komponen Modal Form Kategori ---
const CategoryForm = ({ isOpen, onClose, category, onSave }) => {
    const { createCategory, updateCategory, categories } = useData();
    const isEdit = !!category;

    // State disesuaikan dengan DB (name, icon, sort_order)
    const [formData, setFormData] = useState({ 
        name: '', 
        icon: 'UtensilsCrossed', 
        sort_order: 0 
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData({
                    name: category.name,
                    icon: category.icon || 'UtensilsCrossed',
                    sort_order: category.sort_order || 0,
                });
            } else {
                // Auto-increment sort order
                const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.sort_order || 0), 0);
                setFormData({ name: '', icon: 'UtensilsCrossed', sort_order: maxOrder + 1 });
            }
            setError('');
        }
    }, [category, categories, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'sort_order' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Nama kategori tidak boleh kosong.');
            return;
        }

        // Cek Duplikasi
        const isDuplicate = categories.some(cat => 
            cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
            (!isEdit || cat.id !== category.id)
        );
        if (isDuplicate) {
            setError('Nama kategori sudah ada.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await updateCategory(category.id, formData);
            } else {
                await createCategory(formData);
            }
            onSave(); // Refresh data di parent
            onClose();
        } catch (err) {
            setError('Gagal menyimpan kategori. Cek koneksi server.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Resolve Component Icon yang dipilih
    const SelectedIconConfig = iconOptions[formData.icon] || iconOptions['Tag'];
    const SelectedIcon = SelectedIconConfig.icon;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Kategori` : 'Tambah Kategori'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm rounded-md flex items-center"><AlertTriangle className='w-4 h-4 mr-2'/> {error}</div>}
                
                {/* Input Nama Kategori */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500"
                        placeholder="Contoh: Makanan Berat"
                        required
                    />
                </div>

                {/* Icon Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pilih Ikon</label>
                    <div className="flex items-center space-x-3 mt-1">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
                            <SelectedIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="relative grow">
                            <select
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-blue-500"
                            >
                                {Object.entries(iconOptions).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                
                {/* Input Urutan */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Urutan Tampil</label>
                    <input
                        name="sort_order"
                        type="number"
                        min="0"
                        value={formData.sort_order}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Batal</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan' : 'Tambah')}
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

    // Hitung jumlah item per kategori
    const categoryItemCounts = useMemo(() => {
        if (!Array.isArray(menuItems)) return {};
        return menuItems.reduce((acc, item) => {
            // Item.category menyimpan ID Kategori
            const catId = item.category; 
            acc[catId] = (acc[catId] || 0) + 1;
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
        const itemCount = getCategoryItemCount(selectedCategory.id);
        
        if (itemCount > 0) {
            alert(`GAGAL: Kategori "${selectedCategory.name}" masih memiliki ${itemCount} item menu. Hapus atau pindahkan item menu terlebih dahulu.`);
            setIsModalOpen(false);
            return;
        }

        try {
            await deleteCategory(selectedCategory.id);
        } catch (error) {
            console.error("Gagal menghapus kategori:", error);
            alert("Gagal menghapus kategori.");
        } finally {
            setIsModalOpen(false);
            setSelectedCategory(null);
        }
    };

    // Sort Kategori berdasarkan sort_order
    const sortedCategories = useMemo(() => {
        if (!Array.isArray(categories)) return [];
        return [...categories].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }, [categories]);

    const columns = [
        { 
            header: 'Icon', 
            accessor: 'icon', // DB: icon (string key)
            render: (iconKey) => {
                const IconComponent = (iconOptions[iconKey] || iconOptions['Tag']).icon;
                return <IconComponent className="w-5 h-5 text-blue-600" />;
            }
        },
        { header: 'Nama Kategori', accessor: 'name' }, // DB: name
        { 
            header: 'Urutan', 
            accessor: 'sort_order', // DB: sort_order
            render: (order) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <ListOrdered className="w-3 h-3 mr-1" />
                    {order}
                </span>
            )
        },
        { 
            header: 'Jumlah Item', 
            accessor: 'id', 
            render: (id) => {
                const count = getCategoryItemCount(id);
                return (
                    <span className={`font-semibold ${count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Kategori</h1>
            <p className="text-gray-500">Kelola pengelompokan menu restoran.</p>

            <Card className="p-4 sm:p-6">
                <div className="flex justify-end mb-6">
                    <Button 
                        variant="primary" 
                        onClick={() => { setIsFormOpen(true); setSelectedCategory(null); }} 
                        icon={<Plus className="w-5 h-5" />}
                    >
                        Tambah Kategori
                    </Button>
                </div>

                <Table 
                    columns={columns} 
                    data={sortedCategories} 
                    emptyMessage="Belum ada kategori menu." 
                />
            </Card>

            {/* Modal Form */}
            <CategoryForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                category={selectedCategory}
                onSave={() => {
                    setSelectedCategory(null);
                    // refreshData('categories'); // Optional jika create/update sudah handle refresh
                }}
            />

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Kategori"
                message={`Hapus kategori **${selectedCategory?.name}**?`}
                confirmText="Ya, Hapus"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default MenuCategories;