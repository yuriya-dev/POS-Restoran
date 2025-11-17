// ./pages/Employees.jsx

import React, { useState, useEffect } from 'react';
import { Plus, Users, Edit, Trash2, Shield, UserCheck, UserX, UserPlus, Eye, EyeOff, ChevronDown } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext'; 
import { format } from 'date-fns';
import { simulateHash } from '../utils/helpers';
import { id } from 'date-fns/locale';

// Daftar peran yang tersedia
const ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'kasir', label: 'Kasir' },
];

// --- Sub-Komponen: Employee Form Modal ---
const EmployeeForm = ({ isOpen, onClose, employee, onSave }) => {
    // Ambil fungsi CRUD dan user yang sedang login dari context
    const { users, refreshData, create: dbCreate, update: dbUpdate, user: currentUser } = useData(); 
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', role: 'kasir' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const isEdit = !!employee;

    useEffect(() => {
        if (employee) {
            setFormData({
                username: employee.username,
                password: '', 
                confirmPassword: '',
                role: employee.role,
            });
        } else {
            setFormData({ username: '', password: '', confirmPassword: '', role: 'kasir' });
        }
        setError('');
    }, [employee, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const generateRandomPassword = () => {
        const length = 10;
        const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ23456789!@#$%^&*";
        let newPassword = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setFormData(prev => ({ ...prev, password: newPassword, confirmPassword: newPassword }));
    };

    const validateForm = () => {
        if (!formData.username || !formData.role) {
            return 'Username dan Role wajib diisi.';
        }
        
        // Cek keunikan username
        const isDuplicate = users.some(u => 
            u.username.toLowerCase() === formData.username.trim().toLowerCase() && 
            (!isEdit || u.user_id !== employee.user_id)
        );
        if (isDuplicate) return 'Username sudah digunakan.';

        // Validasi Password
        if (!isEdit || formData.password) {
            if (formData.password.length < 6) return 'Password minimal 6 karakter.';
            if (formData.password !== formData.confirmPassword) return 'Konfirmasi password tidak cocok.';
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
                username: formData.username.trim(),
                role: formData.role,
            };

            if (formData.password) {
                dataToSave.password_hash = simulateHash(formData.password);
            }

            if (isEdit) {
                // Panggil fungsi update dari context
                await new Promise(resolve => setTimeout(resolve, 500));
                dbUpdate('users', employee.user_id, dataToSave, 'user_id'); 
            } else {
                // Panggil fungsi create dari context
                dataToSave.password_hash = dataToSave.password_hash || simulateHash('default123'); 
                dbCreate('users', dataToSave, 'user_id');
            }
            
            refreshData('users');
            onSave();
            onClose();
        } catch (err) {
            setError('Gagal menyimpan data karyawan. Silakan coba lagi.');
            console.error(err);
        }
    };
    
    // Simulasi Password Strength Indicator
    const getPasswordStrength = () => {
        if (!formData.password) return { label: 'Kosong', color: 'text-gray-400' };
        const len = formData.password.length;
        const hasUpper = /[A-Z]/.test(formData.password);
        const hasLower = /[a-z]/.test(formData.password);
        const hasNum = /[0-9]/.test(formData.password);
        const hasSym = /[^A-Za-z0-9]/.test(formData.password);
        
        const score = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;
        
        if (len >= 10 && score >= 3) return { label: 'Kuat', color: 'text-green-600' };
        if (len >= 6 && score >= 2) return { label: 'Sedang', color: 'text-yellow-600' };
        return { label: 'Lemah', color: 'text-red-600' };
    };

    const strength = getPasswordStrength();
    
    // Cek apakah karyawan yang diedit adalah user yang sedang login
    const isEditingSelf = isEdit && employee.user_id === currentUser?.user_id;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? `Edit Karyawan: ${employee?.username}` : 'Tambah Karyawan Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded-md">{error}</div>}
                
                {/* Input Username */}
                <div className="relative">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Username unik"
                        required
                        disabled={isEditingSelf} 
                    />
                </div>

                {/* Dropdown Role */}
                <div className="relative">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            disabled={isEditingSelf} 
                        >
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4 border-t pt-4 border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{isEdit ? 'Ubah Password (Kosongkan jika tidak diubah)' : 'Password'}</p>
                    
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 pr-12"
                            placeholder={isEdit ? 'Min. 6 karakter' : 'Min. 6 karakter'}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Kekuatan Password:</span>
                        <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                    </div>

                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 pr-12"
                            placeholder="Ketik ulang password"
                        />
                    </div>
                    
                    <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={generateRandomPassword}
                        className="w-full text-xs"
                    >
                        Generate Password Otomatis
                    </Button>
                </div>


                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="primary">
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};


// --- Komponen Utama: Employees ---
const Employees = () => {
    // Pastikan mengambil user (currentUser) dan remove function dari useData
    const { users, refreshData, user: currentUser, remove: dbRemove } = useData(); 
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    
    // Helper untuk membandingkan ID pengguna, menggunakan optional chaining
// Helper untuk membandingkan ID pengguna, menggunakan optional chaining
    const isCurrentUser = (item) => {
        // Pastikan 'item' ada dan 'currentUser' ada, baru lakukan perbandingan ID
        if (!item || !currentUser) return false; 
        return item.user_id === currentUser.user_id;
    };
    const handleDelete = (employee) => {
        if (isCurrentUser(employee)) {
            alert('Anda tidak bisa menghapus akun Anda sendiri.');
            return;
        }
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Panggil fungsi remove dari context
            const success = dbRemove('users', selectedEmployee.user_id, 'user_id');
            if (success) {
                 refreshData('users');
            } else {
                 alert('Gagal menghapus pengguna.');
            }
        } catch (error) {
            console.error("Gagal menghapus karyawan:", error);
        } finally {
            setIsModalOpen(false);
            setSelectedEmployee(null);
        }
    };
    
    // Filter user berdasarkan role
    const filteredUsers = users.filter(user => filterRole === 'all' || user.role === filterRole);

    const columns = [
        { header: 'Username', accessor: 'username' },
        { header: 'Role', accessor: 'role', render: (role) => (
            <span 
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium capitalize ${
                    role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}
            >
                <Shield className="w-4 h-4 mr-1" />
                {role}
            </span>
        )},
        { header: 'Status', accessor: 'status', render: (status, item) => (
            <span className={`flex items-center text-sm font-medium ${item.is_active !== false ? 'text-green-600' : 'text-red-600'}`}>
                {item.is_active !== false ? <UserCheck className="w-4 h-4 mr-1" /> : <UserX className="w-4 h-4 mr-1" />}
                {item.is_active !== false ? 'Aktif' : 'Nonaktif'}
            </span>
        )},
        { header: 'Tanggal Dibuat', accessor: 'created_at', render: (date) => (
            format(new Date(date), 'dd MMM yyyy', { locale: id })
        )},
        { header: 'Aksi', render: (item) => (
            <div className="flex space-x-2">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => { setSelectedEmployee(item); setIsFormOpen(true); }} 
                    icon={<Edit className="w-4 h-4" />} 
                    // Menggunakan isCurrentUser helper untuk pengecekan
                    disabled={isCurrentUser(item)} 
                >
                    Edit
                </Button>
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(item)} 
                    icon={<Trash2 className="w-4 h-4" />} 
                    // Menggunakan isCurrentUser helper untuk pengecekan
                    disabled={isCurrentUser(item)}
                >
                    Hapus
                </Button>
            </div>
        )}
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Users className="w-6 h-6 mr-2 text-blue-600" /> Manajemen Akun Karyawan</h1>
            <p className="text-gray-500">Kelola akses akun admin dan kasir restoran.</p>

            <Card className="p-4 sm:p-6">
                 {/* Controls & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">Semua Role</option>
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <Button 
                        variant="primary" 
                        onClick={() => { setSelectedEmployee(null); setIsFormOpen(true); }} 
                        icon={<UserPlus className="w-5 h-5" />}
                    >
                        Tambah Karyawan
                    </Button>
                </div>

                <Table columns={columns} data={filteredUsers} emptyMessage="Tidak ada data karyawan ditemukan." />
            </Card>

            {/* Modal Create/Edit */}
            <EmployeeForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                employee={selectedEmployee}
                onSave={() => setSelectedEmployee(null)}
            />

            {/* Confirmation Modal (Delete) */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Akun Karyawan"
                message={`Apakah Anda yakin ingin menghapus akun **${selectedEmployee?.username}**?`}
                confirmText="Ya, Hapus Akun"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default Employees;