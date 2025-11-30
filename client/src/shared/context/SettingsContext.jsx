import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    // State awal null atau default structure agar tidak error saat render pertama
    const [settings, setSettings] = useState({
        restaurantName: '',
        receiptInfo: '',
        taxRate: 0.1,
        configId: 'default'
    });
    const [loading, setLoading] = useState(true);

    // 1. Fetch Settings dari Server saat aplikasi mulai
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.getSettings();
                // Pastikan data ada sebelum di-set
                if (response.data) {
                    setSettings(response.data);
                }
            } catch (error) {
                console.error("Gagal memuat pengaturan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // 2. Fungsi Update ke Server
    const updateSettings = async (newSettings) => {
        setLoading(true);
        try {
            // Kirim data update ke API
            const response = await api.updateSettings(newSettings);
            
            // Update state lokal dengan data terbaru dari server
            setSettings(response.data);
            return response.data;
        } catch (error) {
            console.error("Gagal memperbarui pengaturan:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);