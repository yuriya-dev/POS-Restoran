import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Tag, Edit, Trash2, ListOrdered, UtensilsCrossed, Coffee, Cake, ChevronDown, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal'; 
import { useData } from '../context/DataContext';

// Mapping ikon
const iconOptions = {
    'UtensilsCrossed': { label: 'Makanan Utama', icon: UtensilsCrossed },
    'Coffee': { label: 'Minuman', icon: Coffee },
    'Cake': { label: 'Dessert', icon: Cake },
    'Tag': { label: 'Lain-lain', icon: Tag }
};

// --- FORM KATEGORI ---
const CategoryForm = ({ isOpen, onClose, category, onSave }) => {
    const { createCategory, updateCategory, categories } = useData();
    // Cek apakah ini mode edit berdasarkan keberadaan ID
    const isEdit = !!category?.categoryId; 

    const [formData, setFormData] = useState({ name: '', icon: 'UtensilsCrossed', sort_order: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            if (isEdit) {
                setFormData({
                    name: category.name,
                    icon: category.icon || 'UtensilsCrossed',
                    sort_order: category.sort_order || 0,
                });
            } else {
                const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.sort_order || 0), 0);
                setFormData({ name: '', icon: 'UtensilsCrossed', sort_order: maxOrder + 1 });
            }
        }
    }, [isOpen, category, isEdit, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'sort_order' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return; // Browser validation handles empty

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await updateCategory(category.categoryId, formData);
            } else {
                await createCategory(formData);
            }
            onSave(); 
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const SelectedIcon = (iconOptions[formData.icon] || iconOptions['Tag']).icon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? `Edit Kategori` : 'Tambah Kategori'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ikon</label>
                    <div className="flex items-center space-x-3 mt-1">
                        <div className="p-2 bg-gray-100 rounded-lg border"><SelectedIcon className="w-6 h-6 text-blue-600" /></div>
                        <div className="relative grow">
                            <select name="icon" value={formData.icon} onChange={handleChange} className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white appearance-none">
                                {Object.entries(iconOptions).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Urutan</label>
                    <input name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5" required />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
                </div>
            </form>
        </Modal>
    );
};

// --- MAIN PAGE ---
const MenuCategories = () => {
    const { categories, menuItems, deleteCategory } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Hitung Item
    const categoryItemCounts = useMemo(() => {
        if (!Array.isArray(menuItems)) return {};
        return menuItems.reduce((acc, item) => {
            const catId = item.category;
            acc[catId] = (acc[catId] || 0) + 1;
            return acc;
        }, {});
    }, [menuItems]);

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedCategory) return;
        
        // Cek jumlah item
        const count = categoryItemCounts[selectedCategory.categoryId] || 0;
        if (count > 0) {
            // Kita pakai alert/toast di sini karena ini logic bisnis frontend
            alert(`Gagal: Masih ada ${count} menu di kategori ini.`);
            setIsModalOpen(false);
            return;
        }

        try {
            await deleteCategory(selectedCategory.categoryId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsModalOpen(false);
            setSelectedCategory(null);
        }
    };

    const sortedCategories = useMemo(() => [...categories].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)), [categories]);

    const columns = [
        { header: 'Ikon', render: (_, row) => {
            const Icon = (iconOptions[row.icon] || iconOptions['Tag']).icon;
            return <Icon className="w-5 h-5 text-blue-600" />;
        }},
        { header: 'Nama', accessor: 'name' },
        { header: 'Urutan', accessor: 'sort_order', render: (val) => <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{val}</span> },
        { header: 'Jumlah Menu', accessor: 'categoryId', render: (id) => {
            const count = categoryItemCounts[id] || 0;
            return <span className={count > 0 ? 'text-green-600 font-bold' : 'text-gray-400'}>{count} menu</span>;
        }},
        { header: 'Aksi', render: (_, row) => (
            <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(row)} icon={<Edit className="w-4 h-4" />}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(row)} icon={<Trash2 className="w-4 h-4" />}>Hapus</Button>
            </div>
        )}
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Kategori Menu</h1>
                <Button variant="primary" onClick={() => { setSelectedCategory(null); setIsFormOpen(true); }} icon={<Plus className="w-5 h-5" />}>Tambah Kategori</Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <Table columns={columns} data={sortedCategories} emptyMessage="Belum ada kategori." />
            </Card>

            <CategoryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} category={selectedCategory} onSave={() => setSelectedCategory(null)} />

            <ConfirmModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={confirmDelete} 
                title="Hapus Kategori" 
                message={`Hapus kategori "${selectedCategory?.name}"?`} 
                confirmText="Hapus" 
                confirmButtonClass="bg-red-500 hover:bg-red-600" 
            />
        </div>
    );
};

export default MenuCategories;