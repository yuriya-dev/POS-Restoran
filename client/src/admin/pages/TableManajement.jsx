import React, { useState, useMemo, useEffect } from 'react';
import { Map, Plus, Edit, Trash2, Users, Bike, CheckCircle, Clock, Loader2, Square, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast'; // Import Toast

import Card from '../../shared/components/common/Card';
import Table from '../../shared/components/common/Table';
import Button from '../../shared/components/common/Button';
import ConfirmModal from '../../shared/components/common/ConfirmModal';
import Modal from '../../shared/components/common/Modal';
import { useData } from '../context/DataContext';

// Status Meja
const TABLE_STATUS = {
    available: { label: 'Tersedia', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    occupied: { label: 'Terisi', color: 'bg-red-100 text-red-800', icon: Users },
    reserved: { label: 'Dipesan', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
};

const TABLE_TYPES = [
    { value: 'dine_in', label: 'Dine-in (Meja Makan)' },
    { value: 'service', label: 'Layanan (Take Away/Ojol)' },
];

// --- Sub-Komponen: Table Form Modal ---
const TableForm = ({ isOpen, onClose, table, onSave }) => {
    const { diningTables, createTable, updateTable } = useData(); 
    const isEdit = !!table;

    const [formData, setFormData] = useState({ 
        number: '', 
        capacity: 4, 
        type: 'dine_in' 
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (table) {
                setFormData({
                    number: table.number || '',
                    capacity: table.capacity || 4,
                    type: table.type || 'dine_in',
                });
            } else {
                setFormData({ number: '', capacity: 4, type: 'dine_in' });
            }
            setError('');
        }
    }, [table, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'capacity' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.number.trim()) {
            setError('Nama/Nomor Meja wajib diisi.');
            return;
        }
        
        // Cek Duplikasi Nama Meja
        if (Array.isArray(diningTables)) {
            const isDuplicate = diningTables.some(t => 
                t.number.toLowerCase() === formData.number.trim().toLowerCase() && 
                (!isEdit || t.table_id !== table.table_id)
            );
            if (isDuplicate) {
                setError('Nama Meja sudah digunakan.');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const payload = {
                number: formData.number.trim(),
                capacity: formData.type === 'dine_in' ? formData.capacity : 0,
                type: formData.type,
                status: isEdit ? table.status : 'available',
            };

            if (isEdit) {
                await toast.promise(
                    updateTable(table.table_id, payload),
                    {
                        loading: 'Menyimpan perubahan...',
                        success: 'Meja berhasil diperbarui',
                        error: 'Gagal memperbarui meja'
                    }
                );
            } else {
                await toast.promise(
                    createTable(payload),
                    {
                        loading: 'Menambahkan meja...',
                        success: 'Meja berhasil ditambahkan',
                        error: 'Gagal menambahkan meja'
                    }
                );
            }
            
            onSave();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Meja` : 'Tambah Meja Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 text-sm rounded border border-red-200 dark:border-red-800">{error}</div>}
                
                {/* Input Nama Meja */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama/Nomor Meja</label>
                    <input
                        name="number"
                        type="text"
                        value={formData.number}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                        placeholder="Contoh: Meja 01"
                        required
                    />
                </div>

                {/* Tipe Meja */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipe</label>
                    <div className="relative">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="block w-full pl-4 pr-10 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all hover:border-gray-400 dark:hover:border-gray-500"
                        >
                            {TABLE_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        {/* Chevron Icon */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500">
                            <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Kapasitas (Hanya Dine-in) */}
                {formData.type === 'dine_in' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kapasitas (Orang)</label>
                        <input
                            name="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                            required
                        />
                    </div>
                )}
                
                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Batal</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? 'Simpan' : 'Tambah')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// --- Sub-Komponen: Table Card ---
const TableCard = ({ table, onEdit, onToggleStatus, onDelete }) => {
    const currentStatus = table.status || 'available';
    const statusDetail = TABLE_STATUS[currentStatus] || TABLE_STATUS.available;
    const Icon = statusDetail.icon;
    const isOccupied = currentStatus === 'occupied';

    return (
        <div className={`p-4 rounded-xl shadow-sm border-2 transition-all duration-200 flex flex-col justify-between h-full relative group
            ${isOccupied ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md'}`}>
            
            {/* Tombol Hapus (Muncul saat Hover) */}
            <button 
                onClick={() => onDelete(table)}
                className="absolute top-2 right-2 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus Meja"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{table.number}</h3>
                <div className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center ${statusDetail.color.includes('bg-') ? (statusDetail.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : statusDetail.color.includes('red') ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400') : statusDetail.color}`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {statusDetail.label}
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" /> 
                Kapasitas: <span className="font-semibold text-gray-700 dark:text-gray-200 ml-1">{table.capacity}</span>
            </p>

            <div className="flex justify-between space-x-2 border-t border-gray-200 dark:border-gray-700 pt-3 mt-auto">
                <Button variant="secondary" size="sm" onClick={() => onEdit(table)} className="flex-1 text-xs">
                    Edit
                </Button>
                <Button 
                    variant={isOccupied ? 'success' : 'primary'} 
                    size="sm" 
                    onClick={() => onToggleStatus(table)}
                    className="flex-1 text-xs"
                >
                    {isOccupied ? 'Kosongkan' : 'Isi Meja'}
                </Button>
            </div>
        </div>
    );
};


// --- Main Component ---
const TableManagement = () => {
    const { diningTables, updateTable, deleteTable, refreshData } = useData(); 
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Memisahkan tabel berdasarkan tipe
    const tables = Array.isArray(diningTables) ? diningTables : [];

    const dineInTables = useMemo(() => 
        tables.filter(t => t.type === 'dine_in' || !t.type)
               .sort((a, b) => a.number.localeCompare(b.number)), 
    [tables]);

    const serviceTables = useMemo(() => 
        tables.filter(t => t.type === 'service')
               .sort((a, b) => a.number.localeCompare(b.number)), 
    [tables]);
    
    const handleEdit = (table) => {
        setSelectedTable(table);
        setIsFormOpen(true);
    };

    const handleDelete = (table) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    // ✅ Fungsi Hapus dengan Toast
    const confirmDelete = async () => {
        if (!selectedTable) return;
        setIsDeleting(true);
        try {
            await toast.promise(
                deleteTable(selectedTable.table_id),
                {
                    loading: 'Menghapus meja...',
                    success: 'Meja berhasil dihapus',
                    error: 'Gagal menghapus meja. Mungkin ada order aktif.'
                }
            );
            // DataContext sudah auto-refresh, tapi untuk keamanan:
            await refreshData('tables');
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
            setSelectedTable(null);
        }
    };
    
    // ✅ Fungsi Toggle Status dengan Toast (Tanpa Loading UI penuh)
    const handleToggleStatus = async (table) => {
        const newStatus = table.status === 'occupied' ? 'available' : 'occupied';
        try {
            await updateTable(table.table_id, { status: newStatus });
            toast.success(`Status meja ${table.number} diubah`);
        } catch (error) {
            toast.error("Gagal mengubah status meja");
        }
    };

    // Kolom untuk tabel Service
    const serviceTableColumns = [
        { header: 'Nama Meja', accessor: 'number' }, 
        { header: 'Tipe', render: () => <span className="text-indigo-600 dark:text-indigo-400 font-medium">Layanan</span> },
        { header: 'Aksi', render: (_, item) => ( // Use (_, item) pattern
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
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Map className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Denah Meja
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Atur layout meja dine-in dan titik layanan.</p>

            <Card className="p-4 sm:p-6">
                <div className="flex justify-end items-center mb-6">
                    <Button 
                        variant="primary" 
                        onClick={() => { setSelectedTable(null); setIsFormOpen(true); }} 
                        icon={<Plus className="w-5 h-5" />}
                    >
                        Tambah Meja
                    </Button>
                </div>
                
                {/* DINE IN SECTION */}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2" /> Dine-in Area
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {dineInTables.map(table => (
                        <TableCard 
                            key={table.table_id} 
                            table={table} 
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDelete} // Pass fungsi delete ke card
                        />
                    ))}
                    {dineInTables.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                            Belum ada meja Dine-in.
                        </div>
                    )}
                </div>

                {/* SERVICE SECTION */}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                    <Bike className="w-5 h-5 mr-2" /> Layanan (Take Away / Delivery)
                </h2>
                
                <Table 
                    columns={serviceTableColumns} 
                    data={serviceTables} 
                    emptyMessage="Tidak ada meja layanan terdaftar." 
                />
            </Card>

            {/* Forms & Modals */}
            <TableForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                table={selectedTable}
                onSave={() => {
                    setSelectedTable(null);
                    refreshData('tables');
                }}
            />

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => !isDeleting && setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Meja"
                message={`Hapus meja "${selectedTable?.number}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText={isDeleting ? 'Menghapus...' : 'Hapus'}
                confirmButtonClass="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
            />
        </div>
    );
};

export default TableManagement;