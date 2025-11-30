import React, { useState, useEffect } from 'react';
import { DollarSign, Image as ImageIcon, UploadCloud, Loader2, Package } from 'lucide-react';
import Button from '../../../shared/components/common/Button';
import Modal from '../../../shared/components/common/Modal';
import { useData } from '../../context/DataContext';
import { uploadToCloudinary } from '../../../shared/services/cloudinary';

const MenuItemForm = ({ isOpen, onClose, item, onSave }) => {
    const { categories, createMenuItem, updateMenuItem } = useData();
    const isEdit = !!item;

    // State Form
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '', 
        image_url: '',
        isAvailable: true,
        stock: 100 // Default stok
    });

    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Effect: Reset form
    useEffect(() => {
        if (isOpen) {
            if (item) {
                // Mode Edit
                setFormData({
                    name: item.name || '',
                    price: item.price || '',
                    category: item.category || (categories[0]?.categoryId || ''),
                    image_url: item.image_url || '',
                    isAvailable: item.isAvailable ?? true,
                    stock: item.stock ?? 100
                });
            } else {
                // Mode Tambah Baru
                setFormData({
                    name: '',
                    price: '',
                    category: categories[0]?.categoryId || '',
                    image_url: '',
                    isAvailable: true,
                    stock: 100
                });
            }
            setImageFile(null);
            setError('');
        }
    }, [item, isOpen, categories]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'stock' ? parseFloat(value) || '' : value) 
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { 
                setError("Ukuran file maksimal 2MB");
                return;
            }
            setImageFile(file);
            setFormData(prev => ({ ...prev, image_url: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.name.trim() || !formData.price) {
            setError('Nama dan Harga wajib diisi.');
            setIsSubmitting(false);
            return;
        }

        try {
            let finalImageUrl = formData.image_url;

            if (imageFile) {
                setUploading(true);
                try {
                    finalImageUrl = await uploadToCloudinary(imageFile);
                } catch (uploadErr) {
                    setError('Gagal mengupload gambar. Cek koneksi internet.');
                    setUploading(false);
                    setIsSubmitting(false);
                    return;
                }
                setUploading(false);
            }

            const payload = {
                ...formData,
                image_url: finalImageUrl,
                category: Number(formData.category),
                stock: Number(formData.stock)
            };

            if (isEdit) {
                await updateMenuItem(item.itemId, payload);
            } else {
                await createMenuItem(payload);
            }
            
            onSave(); 
            onClose();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.response?.data?.error || 'Gagal menyimpan data.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
            setUploading(false);
        }
    };

    // Style classes untuk dark/light mode
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors";

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Menu` : 'Tambah Menu Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}
                
                {/* Gambar Upload */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 group">
                        {formData.image_url ? (
                            <img 
                                src={formData.image_url} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                        <label htmlFor="imageUpload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <UploadCloud className="w-8 h-8 text-white" />
                            <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Klik gambar untuk mengubah (Max 2MB)</span>
                </div>

                {/* Nama Item */}
                <div>
                    <label className={labelClass}>Nama Menu</label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Contoh: Ayam Bakar Madu"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Kategori */}
                    <div>
                        <label className={labelClass}>Kategori</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Harga */}
                    <div>
                        <label className={labelClass}>Harga (Rp)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Rp</span>
                            </div>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>
                
                {/* Input Stok & Status */}
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClass}>Stok Harian</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="100"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah porsi tersedia.</p>
                    </div>
                    
                    {/* Status Ketersediaan (Checkbox) */}
                    <div className="flex items-center pt-6">
                        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 w-full transition-colors">
                            <input
                                id="isAvailable"
                                name="isAvailable"
                                type="checkbox"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-600"
                            />
                            <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                Menu Aktif
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-700 mt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Batal</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting || uploading ? (
                            <span className="flex items-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {uploading ? 'Mengupload...' : 'Menyimpan...'}
                            </span>
                        ) : (
                            isEdit ? 'Simpan Perubahan' : 'Tambah Menu'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MenuItemForm;