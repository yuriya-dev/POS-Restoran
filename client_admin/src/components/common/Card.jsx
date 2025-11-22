// src/components/common/Card.jsx

import React from 'react';
import { AlertCircle } from 'lucide-react';

const Card = ({ 
    children, 
    title, 
    value,      // Tangkap prop value
    subText,    // Tangkap prop subText
    icon: Icon, 
    color,      // Tangkap prop color (misal: text-green-600)
    className = '' 
}) => {
    return (
        <div 
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full ${className}`}
        >
            {title && (
                <div className="p-4 sm:px-6 sm:py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center uppercase tracking-wider">
                        {Icon ? (
                            <Icon className={`w-5 h-5 mr-2 ${color || 'text-blue-600'}`} />
                        ) : (
                            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                        )}
                        {title}
                    </h3>
                </div>
            )}
            
            <div className={`p-4 sm:p-6 grow ${!title ? 'pt-6' : ''}`}>
                {/* LOGIKA BARU: Jika ada 'value', tampilkan mode Statistik */}
                {value ? (
                    <div>
                        <div className={`text-2xl sm:text-3xl font-bold mb-1 ${color || 'text-gray-900'}`}>
                            {value}
                        </div>
                        {subText && (
                            <p className="text-sm text-gray-400 font-medium">
                                {subText}
                            </p>
                        )}
                        {/* Jika ada children tambahan di mode value, render di bawahnya */}
                        {children && <div className="mt-4">{children}</div>}
                    </div>
                ) : (
                    /* Jika tidak ada 'value', render children seperti biasa (untuk Chart/Table) */
                    children
                )}
            </div>
        </div>
    );
};

export default Card;