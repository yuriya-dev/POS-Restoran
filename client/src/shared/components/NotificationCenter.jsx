import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X, Bell } from 'lucide-react';

const NotificationCenter = ({ notifications = [], onRemove, isDarkMode }) => {
    // ✅ Safety check: ensure notifications is always an array
    const safeNotifications = Array.isArray(notifications) ? notifications : [];

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case 'urgent':
                return <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-bounce" />;
            default:
                return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
            case 'urgent':
                return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200';
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
            {safeNotifications.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg pointer-events-auto mb-2">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifikasi ({safeNotifications.length})
                        </div>
                        <button
                            onClick={() => onRemove('all')}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                        >
                            Tutup Semua
                        </button>
                    </div>
                </div>
            )}

            {safeNotifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-5 fade-in duration-300 pointer-events-auto ${getStyles(notification.type)}`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                            {notification.action && (
                                <button
                                    onClick={() => {
                                        notification.action.onClick();
                                        onRemove(notification.id);
                                    }}
                                    className="text-xs font-semibold mt-2 underline hover:opacity-75 transition"
                                >
                                    {notification.action.label}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => onRemove(notification.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationCenter;
