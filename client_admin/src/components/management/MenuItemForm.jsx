import React, { useState, useEffect } from 'react';
import { DollarSign, Image as ImageIcon, UploadCloud, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { uploadToCloudinary } from '../../services/cloudinary';

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
                    // ✅ PERBAIKAN: Gunakan categoryId, bukan id
                    category: item.category || (categories[0]?.categoryId || ''),
                    image_url: item.image_url || '',
                    isAvailable: item.isAvailable ?? true,
                });
            } else {
                // Mode Tambah Baru
                setFormData({
                    name: '',
                    price: '',
                    // ✅ PERBAIKAN: Gunakan categoryId
                    category: categories[0]?.categoryId || '',
                    image_url: '',
                    isAvailable: true,
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
            [name]: type === 'checkbox' ? checked : (name === 'price' ? parseFloat(value) || '' : value) 
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
                category: Number(formData.category) 
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

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Menu` : 'Tambah Menu Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                        {error}
                    </div>
                )}
                
                {/* Gambar Upload */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 group">
                        {formData.image_url ? (
                            <img 
                                src={formData.image_url} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                        <label htmlFor="imageUpload" className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center cursor-pointer transition-all">
                            <UploadCloud className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
                            <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    <span className="text-xs text-gray-500">Klik gambar untuk mengubah (Max 2MB)</span>
                </div>

                {/* Nama Item */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Ayam Bakar Madu"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Kategori */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {/* ✅ PERBAIKAN LOOPING KATEGORI */}
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Harga */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">Rp</span>
                            </div>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                        id="isAvailable"
                        name="isAvailable"
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Menu Tersedia (Bisa Dipesan)
                    </label>
                </div>

                <div className="pt-2 flex justify-end space-x-3 border-t border-gray-100 mt-4">
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