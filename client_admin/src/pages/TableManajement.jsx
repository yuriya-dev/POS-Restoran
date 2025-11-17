import React, { useState, useMemo, useEffect } from 'react';
import { Map, Plus, Edit, Trash2, Users, Square, Store, Bike, ChevronDown, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext';

// Status Meja
const TABLE_STATUS = {
    available: { label: 'Tersedia', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    occupied: { label: 'Terisi', color: 'bg-red-100 text-red-800', icon: Users },
    reserved: { label: 'Dipesan', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
};

// Tipe Meja
const TABLE_TYPES = [
    { value: 'dine_in', label: 'Dine-in (Meja Makan)' },
    { value: 'service', label: 'Layanan (Take Away/Ojol)' },
];


// --- Sub-Komponen: Table Form Modal ---
const TableForm = ({ isOpen, onClose, table, onSave }) => {
    // Mengambil fungsi CRUD spesifik: createTable dan updateTable
    const { diningTables, createTable, updateTable } = useData(); 
    const [formData, setFormData] = useState({ 
        nama_meja: '', 
        kapasitas: 4, 
        type: 'dine_in' 
    });
    const [error, setError] = useState('');
    const isEdit = !!table;

    useEffect(() => {
        if (table) {
            setFormData({
                nama_meja: table.nama_meja,
                kapasitas: table.kapasitas || 4,
                type: table.type || 'dine_in',
            });
        } else {
            setFormData({ nama_meja: '', kapasitas: 4, type: 'dine_in' });
        }
        setError('');
    }, [table, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'kapasitas' ? parseInt(value) || 0 : value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.nama_meja.trim() || !formData.type) {
            return 'Nama Meja dan Tipe wajib diisi.';
        }
        
        // Cek keunikan nama meja (case-insensitive)
        const isDuplicate = diningTables.some(t => 
            t.nama_meja.toLowerCase() === formData.nama_meja.trim().toLowerCase() && 
            (!isEdit || t.meja_id !== table.meja_id)
        );
        if (isDuplicate) return 'Nama Meja sudah digunakan.';

        // Validasi Kapasitas hanya untuk meja Dine-in
        if (formData.type === 'dine_in' && (formData.kapasitas <= 0 || isNaN(formData.kapasitas))) {
            return 'Kapasitas meja dine-in harus lebih dari 0.';
        }
        
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
            const dataToSave = {
                nama_meja: formData.nama_meja.trim(),
                kapasitas: formData.type === 'dine_in' ? formData.kapasitas : 0,
                type: formData.type,
                status: isEdit ? table.status : 'available', 
            };

            // Menggunakan fungsi CRUD yang diekspor dari Context
            if (isEdit) {
                await new Promise(resolve => setTimeout(resolve, 300));
                updateTable(table.meja_id, dataToSave); 
            } else {
                await new Promise(resolve => setTimeout(resolve, 300));
                createTable(dataToSave); 
            }
            
            // refreshData tidak perlu dipanggil di sini karena sudah dipanggil di dalam createTable/updateTable
            onSave();
            onClose();
        } catch (err) {
            setError('Gagal menyimpan data meja. Silakan coba lagi.');
            console.error(err);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Meja: ${table?.nama_meja}` : 'Tambah Meja Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded-md">{error}</div>}
                
                {/* Input Nama Meja */}
                <div className="relative">
                    <label htmlFor="nama_meja" className="block text-sm font-medium text-gray-700">Nama/ID Meja</label>
                    <input
                        id="nama_meja"
                        name="nama_meja"
                        type="text"
                        value={formData.nama_meja}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Meja 1, Bar, Take Away"
                        required
                    />
                </div>

                {/* Dropdown Tipe Meja */}
                <div className="relative">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe Meja</label>
                    <div className="relative">
                        <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        >
                            {TABLE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Input Kapasitas (Hanya untuk Dine-in) */}
                {formData.type === 'dine_in' && (
                    <div className="relative">
                        <label htmlFor="kapasitas" className="block text-sm font-medium text-gray-700">Kapasitas (Orang)</label>
                        <input
                            id="kapasitas"
                            name="kapasitas"
                            type="number"
                            min="1"
                            value={formData.kapasitas}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Kapasitas maksimum"
                            required
                        />
                    </div>
                )}
                
                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="primary">
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Meja'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// --- Sub-Komponen: Table Card (Untuk Denah Meja) ---
const TableCard = ({ table, onEdit, onToggleStatus }) => {
    const statusDetail = TABLE_STATUS[table.status] || { label: 'Tidak Diketahui', color: 'bg-gray-100 text-gray-800', icon: Square };
    const Icon = statusDetail.icon;

    // Tidak boleh mengubah status meja layanan
    const canToggle = table.type === 'dine_in'; 
    const isOccupied = table.status === 'occupied';

    return (
        <div 
            className={`p-4 rounded-xl shadow-lg border-2 transition-all duration-300 flex flex-col justify-between 
                        ${isOccupied ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:shadow-xl hover:border-blue-400'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{table.nama_meja}</h3>
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${statusDetail.color} flex items-center`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {statusDetail.label}
                </div>
            </div>

            {table.type === 'dine_in' && (
                <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2" /> 
                    Kapasitas: <span className="font-semibold text-gray-700 ml-1">{table.kapasitas}</span> Orang
                </p>
            )}

            <div className="flex justify-end space-x-2 border-t pt-3">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => onEdit(table)} 
                    icon={<Edit className="w-4 h-4" />}
                >
                    Edit
                </Button>
                
                {/* Tombol Aksi Status Cepat (Hanya untuk Dine-in) */}
                {canToggle && (
                    <Button 
                        variant={isOccupied ? 'success' : 'danger'} 
                        size="sm" 
                        onClick={() => onToggleStatus(table)}
                    >
                        {isOccupied ? 'Kosongkan' : 'Set Terisi'}
                    </Button>
                )}
            </div>
        </div>
    );
};


// --- Komponen Utama: Table Management ---
const TableManagement = () => {
    // Mengambil fungsi CRUD spesifik: updateTable dan deleteTable
    const { diningTables = [], updateTable, deleteTable } = useData(); 
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    // Filter meja berdasarkan tipe
    const dineInTables = useMemo(() => 
        diningTables.filter(t => t.type === 'dine_in')
                     .sort((a, b) => a.nama_meja.localeCompare(b.nama_meja)), 
    [diningTables]);

    const serviceTables = useMemo(() => 
        diningTables.filter(t => t.type === 'service')
                     .sort((a, b) => a.nama_meja.localeCompare(b.nama_meja)), 
    [diningTables]);
    
    // Handler untuk membuka modal edit
    const handleEdit = (table) => {
        setSelectedTable(table);
        setIsFormOpen(true);
    };

    // Handler untuk menghapus meja
    const handleDelete = (table) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Panggil deleteTable (sudah memuat ulang data)
            const success = deleteTable(selectedTable.meja_id); 
            
            if (!success) {
                 alert('Gagal menghapus meja.');
            }
        } catch (error) {
            console.error("Gagal menghapus meja:", error);
        } finally {
            setIsModalOpen(false);
            setSelectedTable(null);
        }
    };
    
    // Handler untuk mengubah status meja Dine-in secara cepat
    const handleToggleStatus = async (table) => {
        const newStatus = table.status === 'occupied' ? 'available' : 'occupied';
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Panggil updateTable (sudah memuat ulang data)
            updateTable(table.meja_id, { status: newStatus });
        } catch (error) {
            console.error("Gagal mengubah status meja:", error);
            alert('Gagal mengubah status meja.');
        }
    };

    // Kolom tabel untuk tampilan Meja Layanan (Service Tables)
    const serviceTableColumns = [
        { header: 'Nama Meja', accessor: 'nama_meja' },
        { header: 'Tipe', accessor: 'type', render: (type) => (
            <span className="capitalize font-medium text-indigo-600">
                {type === 'service' ? 'Layanan/Service' : 'Dine-in'}
            </span>
        )},
        { header: 'Status Saat Ini', accessor: 'status', render: (status) => {
            const detail = TABLE_STATUS[status] || { label: 'Tersedia', color: 'bg-green-100 text-green-800' };
            return (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${detail.color}`}>
                    {detail.label}
                </span>
            );
        }},
        { header: 'Aksi', render: (item) => (
            <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(item)} icon={<Edit className="w-4 h-4" />}>
                    Edit
                </Button>
                {/* Meja Layanan biasanya tidak dihapus, tapi fungsionalitasnya ada */}
                <Button variant="danger" size="sm" onClick={() => handleDelete(item)} icon={<Trash2 className="w-4 h-4" />}>
                    Hapus
                </Button>
            </div>
        )}
    ];


    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Map className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Denah Meja</h1>
            <p className="text-gray-500">Tambahkan, ubah, dan pantau status meja restoran dan layanan.</p>

            <Card className="p-4 sm:p-6">
                 {/* Controls */}
                <div className="flex justify-end items-center mb-6">
                    <Button 
                        variant="primary" 
                        onClick={() => { setSelectedTable(null); setIsFormOpen(true); }} 
                        icon={<Plus className="w-5 h-5" />}
                    >
                        Tambah Meja Baru
                    </Button>
                </div>
                
                {/* --- BAGIAN DINE-IN (DENAH MEJA VISUAL) --- */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center"><Users className="w-5 h-5 mr-2" /> Meja Dine-in ({dineInTables.length})</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    {dineInTables.map(table => (
                        <TableCard 
                            key={table.meja_id} 
                            table={table} 
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                    {dineInTables.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 italic p-4 border rounded-lg">Tidak ada meja Dine-in yang terdaftar.</p>
                    )}
                </div>

                {/* --- BAGIAN SERVICE (TAKE AWAY / OJOL) --- */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center"><Bike className="w-5 h-5 mr-2" /> Meja Layanan (Take Away & Ojol)</h2>
                
                <Table 
                    columns={serviceTableColumns} 
                    data={serviceTables} 
                    emptyMessage="Tidak ada meja layanan yang terdaftar (Take Away, Ojol, dll.)." 
                />
            </Card>

            {/* Modal Create/Edit */}
            <TableForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                table={selectedTable}
                onSave={() => setSelectedTable(null)}
            />

            {/* Confirmation Modal (Delete) */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Meja"
                message={`Apakah Anda yakin ingin menghapus meja **${selectedTable?.nama_meja}**? Semua data transaksi terkait meja ini akan terpengaruh jika tidak dikelola dengan baik di DB utama.`}
                confirmText="Ya, Hapus Meja"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default TableManagement;