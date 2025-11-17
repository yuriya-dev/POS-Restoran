import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Tag, Users, Settings, BarChart3, LogOut, Menu, Table } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Menu Items', icon: Utensils, path: '/menu' },
  { name: 'Kategori', icon: Tag, path: '/categories' },
  { name: 'Meja', icon: Table, path: '/tables' },
  { name: 'Karyawan', icon: Users, path: '/employees' },
  { name: 'Laporan', icon: BarChart3, path: '/reports' },
  { name: 'Pengaturan', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile state

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
            : 'text-gray-600 hover:bg-gray-200 hover:text-blue-600'
        }`}
        onClick={() => setIsOpen(false)} // Close on mobile
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar - Desktop & Mobile overlay */}
      <aside 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          lg:static lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out z-40
        `}
      >
        {/* Overlay for mobile */}
        {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}></div>}

        <div className="flex-shrink-0 flex items-center mb-6 h-16">
          <Utensils className="w-8 h-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900">Admin POS</span>
        </div>

        <nav className="flex-1 space-y-2 custom-scrollbar overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="flex items-center p-3 mb-2 bg-gray-100 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition duration-150"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sesi ini?"
        confirmText="Keluar"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </>
  );
};

export default Sidebar;