import React from 'react';
import Sidebar from './Sidebar';
import Header from '../../../shared/components/common/Header';
import { Outlet, useLocation } from 'react-router-dom';

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
        // ✅ UPDATE: Tambahkan dark:bg-gray-900 dan transition-colors
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content Area */}
            {/* ✅ UPDATE: Tambahkan dark:bg-gray-900 pada wrapper konten */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                
                {/* Header Component */}
                <Header title={title} onMenuClick={() => setIsOpen(true)} />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;