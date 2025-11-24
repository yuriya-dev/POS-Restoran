import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Konfirmasi', confirmButtonClass = 'bg-blue-600 hover:bg-blue-700' }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop Blur */}
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true"></div>

            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 ease-in-out scale-100 translate-y-0"
                onClick={e => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside
            >
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                    <div className="flex items-center">
                        <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-gray-700 mb-6">
                    <p dangerouslySetInnerHTML={{ __html: message }} />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-base font-medium rounded-lg text-white transition duration-200 ${confirmButtonClass}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;