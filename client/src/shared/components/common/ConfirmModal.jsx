import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Konfirmasi', 
    cancelText = 'Batal',
    confirmButtonClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    type = 'danger', // danger, success, info
    disabled = false
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // Handle Animation & Body Scroll Lock
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle ESC Key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !disabled) onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, disabled]);

    if (!isVisible && !isOpen) return null;

    // Dynamic Styles based on Type (Dark Mode Compatible)
    const getStyles = () => {
        switch (type) {
            case 'success':
                return { 
                    icon: <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />, 
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    ring: 'ring-emerald-50/50 dark:ring-emerald-900/10'
                };
            case 'info':
                return { 
                    icon: <Info className="w-8 h-8 text-blue-600 dark:text-blue-400" />, 
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    ring: 'ring-blue-50/50 dark:ring-blue-900/10'
                };
            default: // danger
                return { 
                    icon: <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />, 
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    ring: 'ring-red-50/50 dark:ring-red-900/10'
                };
        }
    };

    const { icon, bg, ring } = getStyles();

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
        >
            {/* Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
                onClick={() => !disabled && onClose()}
            ></div>

            {/* Modal Panel */}
            <div className={`
                relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out border border-gray-100 dark:border-gray-700 overflow-hidden
                ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    disabled={disabled}
                    className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 dark:focus:ring-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    {/* Icon Bubble */}
                    <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${bg} mb-6 ring-8 ${ring} shadow-sm transition-colors`}>
                        {icon}
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight" id="modal-title">
                            {title}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2 font-medium">
                            {typeof message === 'string' ? <p>{message}</p> : message}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-5 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={disabled}
                        className="w-full inline-flex justify-center items-center px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 text-sm font-bold rounded-xl text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 dark:focus:ring-gray-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={disabled}
                        className={`w-full inline-flex justify-center items-center px-4 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;