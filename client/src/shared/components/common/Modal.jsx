import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    
    // Logic close on ESC key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Backdrop Blur & Opacity */}
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm" aria-hidden="true"></div>

            {/* Modal Content - Slide-in Animation */}
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg lg:max-w-xl p-6 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 scale-100 border border-gray-100 dark:border-gray-700"
                onClick={e => e.stopPropagation()} 
            >
                <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition duration-150">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;