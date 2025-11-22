import React from 'react';
import { Utensils } from 'lucide-react';

const MenuPage = () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md min-h-full">
            <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                <Utensils className="w-6 h-6 mr-2" /> Halaman Order (Menu & Cart)
            </h2>
            <p className="text-gray-500 mt-2">-- Konten POS Utama akan dibuat di sini --</p>
        </div>
    );
};

export default MenuPage;