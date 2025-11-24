import React from 'react';
import { AlertCircle } from 'lucide-react';

const Card = ({ 
    children, 
    title, 
    value,      
    subText,    
    icon: Icon, 
    color,      
    className = '' 
}) => {
    return (
        <div 
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full overflow-hidden ${className}`}
        >
            {/* Header Card */}
            {title && (
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 flex items-center uppercase tracking-wider truncate w-full">
                        {Icon ? (
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${color || 'text-blue-600'} shrink-0`} />
                        ) : (
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 shrink-0" />
                        )}
                        <span className="truncate">{title}</span>
                    </h3>
                </div>
            )}
            
            {/* Body Card */}
            <div className={`p-4 sm:p-6 grow flex flex-col justify-center ${!title ? 'pt-6' : ''}`}>
                {value ? (
                    // MODE STATISTIK (Angka Besar)
                    <div>
                        {/* Responsive Text Size: XL di HP, 2XL di Tablet, 3XL di Desktop */}
                        <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate ${color || 'text-gray-900'}`}>
                            {value}
                        </div>
                        {subText && (
                            <p className="text-xs sm:text-sm text-gray-400 font-medium truncate">
                                {subText}
                            </p>
                        )}
                        {children && <div className="mt-3 sm:mt-4 w-full">{children}</div>}
                    </div>
                ) : (
                    // MODE KONTEN (Chart/Table)
                    <div className="h-full w-full">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;