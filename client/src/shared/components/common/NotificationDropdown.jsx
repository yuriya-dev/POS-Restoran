import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';

const NotificationDropdown = ({ notifications, onRemove, onClearAll, isOpen: controlledIsOpen, onToggle: controlledOnToggle }) => {
    // Support both controlled (parent manages state) dan uncontrolled (component manages state) modes
    const isControlled = controlledIsOpen !== undefined && controlledOnToggle !== undefined;
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    const actualIsOpen = isControlled ? controlledIsOpen : internalIsOpen;
    const actualOnToggle = isControlled ? controlledOnToggle : setInternalIsOpen;
    
    const dropdownRef = useRef(null);

    // Close dropdown ketika click di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                actualOnToggle?.(false);
            }
        };

        if (actualIsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [actualIsOpen, actualOnToggle]);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case 'urgent':
                return <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-bounce" />;
            default:
                return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-900 dark:text-green-100';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-900 dark:text-red-100';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-900 dark:text-yellow-100';
            case 'urgent':
                return 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 text-orange-900 dark:text-orange-100';
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-900 dark:text-blue-100';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button - render jika tidak dikontrol parent (standalone mode) */}
            {!isControlled && (
                <button
                    onClick={() => actualOnToggle(!actualIsOpen)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    )}
                </button>
            )}

            {/* Dropdown Panel */}
            {actualIsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            Notifikasi ({notifications.length})
                        </h3>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => {
                                        onClearAll();
                                        actualOnToggle?.(false);
                                    }}
                                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    Hapus Semua
                                </button>
                            )}
                            <button
                                onClick={() => actualOnToggle?.(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                                <Info className="w-8 h-8 mb-2" />
                                <p className="text-sm font-medium">Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${getStyles(notif.type)}`}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-snug break-words">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(notif.timestamp).toLocaleTimeString('id-ID')}
                                            </p>
                                            {notif.action && (
                                                <button
                                                    onClick={() => {
                                                        notif.action.onClick();
                                                        onRemove(notif.id);
                                                        actualOnToggle?.(false);
                                                    }}
                                                    className="text-xs font-semibold mt-2 opacity-75 hover:opacity-100 underline transition-opacity"
                                                >
                                                    {notif.action.label}
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onRemove(notif.id)}
                                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                            <button
                                onClick={() => {
                                    onClearAll();
                                    actualOnToggle?.(false);
                                }}
                                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 justify-center w-full transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                                Hapus Semua Notifikasi
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
