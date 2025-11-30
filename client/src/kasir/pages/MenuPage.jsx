import React from 'react';
import { Utensils } from 'lucide-react';

const MenuPage = () => {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-full transition-colors duration-200">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 flex items-center">
                <Utensils className="w-6 h-6 mr-2" /> Halaman Order (Menu & Cart)
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">-- Konten POS Utama akan dibuat di sini --</p>
        </div>
    );
};

export default MenuPage;