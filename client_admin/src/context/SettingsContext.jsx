import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSettings, updateSettings as apiUpdateSettings } from '../api/db';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(getSettings());
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     // Initial load is done synchronously in useState from db.js
    //     // but this is useful if we need to re-fetch asynchronously later
    //     setSettings(getSettings()); 
    // }, []);

    const updateSettings = async (newSettings) => {
        setLoading(true);
        try {
            // Simulasi delay API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updated = apiUpdateSettings(newSettings);
            setSettings(updated);
            return updated;
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