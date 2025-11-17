// components/common/Header.jsx

import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
    const { user } = useAuth(); // Asumsi user tersedia dari AuthContext

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                {/* Search Bar Placeholder */}
                <div className="relative hidden md:block">
                    <input 
                        type="text" 
                        placeholder="Cari..." 
                        className="pl-10 pr-4 py-2 border rounded-full text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                
                {/* Notification */}
                <button className="text-gray-500 hover:text-gray-700 relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
                </button>
                
                {/* User Profile */}
                <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 capitalize">
                        {user?.username || 'Pengguna'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;