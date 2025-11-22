import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

const KasirLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Header/Sidebar Sederhana untuk Kasir
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-blue-700">POS Kasir</h1>
                    <span className="text-sm text-gray-500">Halo, {user?.fullName || user?.username}</span>
                </div>
                <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center space-x-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </header>

            {/* Konten Halaman akan dirender di sini */}
            <main className="flex-grow p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default KasirLayout;