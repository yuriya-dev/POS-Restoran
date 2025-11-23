import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        restaurantName: 'Restoran Kita',
        address: '',
        phone: '',
        receiptFooter: 'Terima kasih!',
        taxRate: 0.10, // Default 10%
        serviceCharge: 0,
        packagingFee: 0,
        logoUrl: '',
        wifiInfo: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.getSettings();
                if (res.data) {
                    // Pastikan angka dikonversi tipe datanya
                    const data = res.data;
                    setSettings({
                        ...data,
                        taxRate: Number(data.taxRate),
                        serviceCharge: Number(data.serviceCharge),
                        packagingFee: Number(data.packagingFee)
                    });
                }
            } catch (error) {
                console.error("Gagal load settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);