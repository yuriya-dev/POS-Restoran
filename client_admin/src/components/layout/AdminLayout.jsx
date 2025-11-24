import React from 'react';
import Sidebar from './Sidebar';
import Header from '../common/Header'; // Asumsi Anda akan membuat Header.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const getTitle = (pathname) => {
    const path = pathname.split('/')[1];
    switch (path) {
        case '': return 'Dashboard';
        case 'menu': return 'Manajemen Menu Item';
        case 'categories': return 'Manajemen Kategori';
        case 'employees': return 'Manajemen Karyawan';
        case 'reports': return 'Laporan Penjualan';
        case 'settings': return 'Pengaturan Restoran';
        default: return 'Halaman Admin';
    }
};

const AdminLayout = () => {
    const location = useLocation();
    const title = getTitle(location.pathname);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header/Title */}
                <header className="sticky top-0 z-30 bg-white shadow-sm px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                    
                    {/* Mobile Menu Button */}
                    <button 
                    className="lg:hidden p-2 bg-blue-600 text-white rounded-md shadow"
                    onClick={() => setIsOpen(true)}
                    >
                    <Menu className="w-6 h-6" />
                    </button>

                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                </header>


                {/* Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;