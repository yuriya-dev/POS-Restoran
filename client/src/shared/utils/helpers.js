// Utility functions for POS Dashboard

/**
 * Format angka menjadi format mata uang Rupiah.
 * @param {number} amount - Jumlah angka.
 * @returns {string} Format Rupiah (e.g., "Rp 25.000").
 */
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'Rp 0';
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

/**
 * Simulasi hashing password (bcrypt-like simple string modification).
 * WARNING: Ini hanya simulasi, BUKAN untuk produksi.
 * @param {string} password - Password plain text.
 * @returns {string} Simulated hash.
 */
export const simulateHash = (password) => {
    // Simple, non-secure simulation of hashing
    return 'sim_hash_' + btoa(password).substring(0, 20); 
};

/**
 * Mendapatkan sapaan berdasarkan waktu hari ini.
 * @returns {string} "Selamat Pagi", "Selamat Siang", "Selamat Sore", atau "Selamat Malam".
 */
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
};

// ... Tambahkan helper lainnya (debounce, validation, date formatting, dll.)