import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const notificationIdRef = useRef(0);

    const addNotification = useCallback((message, type = 'info', duration = 5000, action = null) => {
        const id = notificationIdRef.current++;
        const notification = {
            id,
            message,
            type, // 'info', 'success', 'warning', 'error', 'urgent'
            duration,
            action, // { label, onClick }
            timestamp: new Date(),
        };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove notification after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
