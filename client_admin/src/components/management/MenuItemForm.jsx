// components/management/MenuItemForm.jsx

import React, { useState, useEffect } from 'react';
import { Tag, Utensils, DollarSign, Image, X } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';

const MenuItemForm = ({ isOpen, onClose, item, onSave }) => {
    const { categories, menuItems, refreshData } = useData();
    const isEdit = !!item;

    const [formData, setFormData] = useState({
        nama_item: '',
        harga: '',
        kategori_id: categories[0]?.kategori_id || '', // Default ke kategori pertama
        gambar_url: '',
        is_active: true,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (categories.length > 0 && !formData.kategori_id) {
             setFormData(prev => ({ ...prev, kategori_id: categories[0].kategori_id }));
        }

        if (item) {
            setFormData({
                nama_item: item.nama_item,
                harga: item.harga,
                kategori_id: item.kategori_id,
                gambar_url: item.gambar_url,
                is_active: item.is_active,
            });
        } else {
            // Reset form saat membuka untuk pembuatan baru
            setFormData({
                nama_item: '',
                harga: '',
                kategori_id: categories[0]?.kategori_id || '',
                gambar_url: 'https://via.placeholder.com/150/CCCCCC?text=Menu+Item',
                is_active: true,
            });
        }
        setError('');
    }, [item, isOpen, categories]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : (name === 'harga' ? parseFloat(value) || '' : value) 
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.nama_item.trim() || !formData.kategori_id) {
            return 'Nama item dan Kategori wajib diisi.';
        }
        if (typeof formData.harga !== 'number' || formData.harga <= 0) {
            return 'Harga harus berupa angka yang valid dan lebih dari nol.';
        }
        
        // Cek keunikan nama
        const isDuplicate = menuItems.some(i => 
            i.nama_item.toLowerCase() === formData.nama_item.trim().toLowerCase() && 
            (!isEdit || i.item_id !== item.item_id)
        );
        if (isDuplicate) return 'Nama item sudah ada. Mohon gunakan nama lain.';
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const dataToSave = { ...formData, nama_item: formData.nama_item.trim() };

            if (isEdit) {
                // Simulasi API Update
                require('../../api/db').update('menu_items', item.item_id, dataToSave, 'item_id'); 
            } else {
                // Simulasi API Create
                require('../../api/db').create('menu_items', dataToSave, 'item_id');
            }
            
            refreshData('menuItems'); // Refresh data di DataContext
            onSave();
            onClose();
        } catch (err) {
            setError('Gagal menyimpan item menu. Silakan coba lagi.');
            console.error(err);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Item: ${item?.nama_item}` : 'Tambah Item Menu Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded-md">{error}</div>}
                
                {/* Gambar Preview */}
                <div className="flex justify-center">
                    <img 
                        src={formData.gambar_url || 'https://via.placeholder.com/150/CCCCCC?text=Menu+Item'} 
                        alt="Preview" 
                        className="w-40 h-40 object-cover rounded-xl shadow-md border border-gray-200"
                    />
                </div>

                {/* Input Nama Item */}
                <div className="relative">
                    <label htmlFor="nama_item" className="block text-sm font-medium text-gray-700">Nama Item</label>
                    <input
                        id="nama_item"
                        name="nama_item"
                        type="text"
                        value={formData.nama_item}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Nasi Goreng Spesial"
                        required
                    />
                </div>

                {/* Kategori & Harga */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Select Kategori */}
                    <div className="relative">
                        <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700">Kategori</label>
                        <select
                            id="kategori_id"
                            name="kategori_id"
                            value={formData.kategori_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.kategori_id} value={cat.kategori_id}>{cat.nama_kategori}</option>
                            ))}
                        </select>
                    </div>

                    {/* Input Harga */}
                    <div className="relative">
                        <label htmlFor="harga" className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                        <DollarSign className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                        <input
                            id="harga"
                            name="harga"
                            type="number"
                            min="0"
                            step="1000"
                            value={formData.harga}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 pl-10 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: 25000"
                            required
                        />
                    </div>
                </div>

                {/* Input URL Gambar */}
                <div className="relative">
                    <label htmlFor="gambar_url" className="block text-sm font-medium text-gray-700">URL Gambar (Opsional)</label>
                    <Image className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                    <input
                        id="gambar_url"
                        name="gambar_url"
                        type="text"
                        value={formData.gambar_url}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 pl-10 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="http://via.placeholder.com/150"
                    />
                </div>
                
                {/* Status Aktif */}
                <div className="flex items-center">
                    <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-900">
                        Item aktif (dapat dijual)
                    </label>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="primary">
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Item'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MenuItemForm;