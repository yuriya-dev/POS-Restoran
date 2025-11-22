// src/pages/Employees.jsx

import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Shield, UserPlus, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// Daftar peran
const ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'kasir', label: 'Kasir' },
];

// --- Employee Form Modal ---
const EmployeeForm = ({ isOpen, onClose, employee, onSave }) => {
    // Mengambil fungsi CRUD dari DataContext (yang sudah ada Toast & Auto-refresh)
    const { createUser, updateUser } = useData(); 
    const isEdit = !!employee;

    const [formData, setFormData] = useState({ 
        username: '', 
        password: '', 
        fullName: '',
        role: 'kasir' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            if (employee) {
                setFormData({
                    username: employee.username,
                    password: '', // Password kosong saat edit (biarkan kosong jika tidak diubah)
                    fullName: employee.fullName || '',
                    role: employee.role,
                });
            } else {
                setFormData({ username: '', password: '', fullName: '', role: 'kasir' });
            }
        }
    }, [isOpen, employee]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi Sederhana di Client
        if (!formData.username || !formData.role) return; // (Browser 'required' attr akan handle ini)

        // Validasi Password saat Create
        if (!isEdit && (!formData.password || formData.password.length < 6)) {
            alert('Password wajib diisi minimal 6 karakter.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                username: formData.username.trim(),
                fullName: formData.fullName.trim(),
                role: formData.role,
                password: formData.password // Backend akan hash ini
            };

            if (isEdit) {
                // Update User (Panggil fungsi Context)
                await updateUser(employee.userId, payload);
            } else {
                // Create User (Panggil fungsi Context)
                await createUser(payload);
            }
            
            onSave(); // Tutup modal & reset state parent
            onClose();
        } catch (err) {
            console.error("Form Error:", err);
            // Error sudah ditampilkan via Toast di DataContext, jadi tidak perlu alert di sini
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Karyawan` : 'Tambah Karyawan Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                        placeholder="username_unik"
                        required
                        disabled={isEdit} // Username tidak boleh diubah saat edit (Primary identifier logic)
                    />
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 text-gray-900"
                        placeholder="Nama Karyawan"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <div className="relative mt-1">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 appearance-none text-gray-900"
                        >
                            {ROLES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {isEdit ? 'Password Baru (Opsional)' : 'Password'}
                    </label>
                    <div className="relative mt-1">
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-blue-500 text-gray-900"
                            placeholder={isEdit ? "Biarkan kosong jika tidak diubah" : "Min. 6 karakter"}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Akun')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};


// --- Main Component: Employees ---
const Employees = () => {
    // Ambil data users dan fungsi delete dari DataContext
    const { users, deleteUser } = useData(); 
    const { user: currentUser } = useAuth(); 
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    
    // Helper: Cek apakah item adalah user yang sedang login
    const isSelf = (item) => {
        if (!item || !currentUser) return false;
        // Bandingkan userId atau username
        return currentUser.userId === item.userId || currentUser.username === item.username;
    };

    const handleEdit = (item) => {
        setSelectedEmployee(item);
        setIsFormOpen(true);
    };

    const handleDelete = (item) => {
        if (isSelf(item)) {
            // Proteksi sederhana di UI
            alert("Anda tidak bisa menghapus akun sendiri.");
            return;
        }
        setSelectedEmployee(item);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedEmployee) return;
        try {
            // Panggil Delete User (Toast & Refresh handled by Context)
            await deleteUser(selectedEmployee.userId); 
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setIsModalOpen(false);
            setSelectedEmployee(null);
        }
    };
    
    // Filter User
    const filteredUsers = (users || []).filter(u => filterRole === 'all' || u.role === filterRole);

    // Definisi Kolom Tabel
    const columns = [
        { 
            header: 'Username', 
            accessor: 'username', 
            render: (val) => <span className="font-semibold text-gray-900">{val}</span> 
        },
        { 
            header: 'Nama Lengkap', 
            accessor: 'fullName', 
            render: (val) => val || <span className="text-gray-400 italic">-</span> 
        },
        { 
            header: 'Role', 
            accessor: 'role', 
            render: (role) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                    ${role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {role}
                </span>
            )
        },
        { 
            header: 'Terdaftar', 
            accessor: 'created_at', 
            render: (date) => date ? format(new Date(date), 'dd MMM yyyy', { locale: id }) : '-'
        },
        { 
            header: 'Aksi', 
            render: (_, item) => ( // Gunakan (_, item) agar mengambil object baris dengan benar
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
                        disabled={isSelf(item)} // Disable tombol hapus jika user sendiri
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
                <Users className="w-6 h-6 mr-2 text-blue-600" /> Karyawan
            </h1>
            <p className="text-gray-500">Kelola akses pengguna sistem (Admin & Kasir).</p>

            <Card className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    {/* Filter Role */}
                    <div className="relative w-48">
                        <select
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 bg-white text-sm"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">Semua Role</option>
                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Tombol Tambah */}
                    <Button 
                        variant="primary" 
                        onClick={() => { setSelectedEmployee(null); setIsFormOpen(true); }} 
                        icon={<UserPlus className="w-5 h-5" />}
                    >
                        Tambah User
                    </Button>
                </div>

                <Table 
                    columns={columns} 
                    data={filteredUsers} 
                    emptyMessage="Tidak ada data karyawan ditemukan." 
                />
            </Card>

            {/* Modal Form (Create/Edit) */}
            <EmployeeForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                employee={selectedEmployee}
                onSave={() => setSelectedEmployee(null)}
            />

            {/* Modal Konfirmasi Hapus */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Akun"
                message={`Apakah Anda yakin ingin menghapus akun "${selectedEmployee?.username}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default Employees;