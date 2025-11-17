// ./main.jsx (Struktur yang Harus Anda Gunakan)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Mengandung <BrowserRouter>
import './index.css';

// Import Context Providers
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SettingsProvider } from './context/SettingsContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Pastikan tidak ada komponen Router lain di sini */}
    <AuthProvider>
      <DataProvider>
        <SettingsProvider>
          <App /> 
        </SettingsProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
);