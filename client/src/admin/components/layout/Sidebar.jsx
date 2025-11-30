import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Tag, Users, Settings, BarChart3, LogOut, Menu, Table } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Menu Items', icon: Utensils, path: '/menu' },
  { name: 'Kategori', icon: Tag, path: '/categories' },
  { name: 'Meja', icon: Table, path: '/tables' },
  { name: 'Karyawan', icon: Users, path: '/employees' },
  { name: 'Laporan', icon: BarChart3, path: '/reports' },
  { name: 'Pengaturan', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={`flex items-center p-3 rounded-lg text-sm font-medium transition duration-150 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* 🔹 Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔹 Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-blue-600 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 🔹 Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0 z-50' : '-translate-x-full z-0'} 
          lg:translate-x-0 lg:z-0
          lg:static lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 ease-in-out
        `}
      >

        <div className="shrink-0 flex items-center mb-6 h-16">
          <Utensils className="w-8 h-8 text-blue-600 dark:text-blue-500 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Admin POS</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center p-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500 dark:text-red-400" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Modal Logout */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sesi ini?"
        confirmText="Keluar"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
      />
    </>
  );
};

export default Sidebar;