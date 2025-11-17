import React from 'react';
import { AlertCircle } from 'lucide-react';

const Card = ({ children, title, icon: Icon, className = '' }) => {
    return (
        <div 
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 ${className}`}
        >
            {title && (
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        {Icon ? <Icon className="w-5 h-5 mr-2 text-blue-600" /> : <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />}
                        {title}
                    </h3>
                </div>
            )}
            <div className={`p-4 sm:p-6 ${!title ? 'pt-6' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Card;