/**
 * Request Deduplication Service
 * Menghindari duplicate API calls saat multiple components request data yang sama
 */

class RequestDeduplicator {
    constructor() {
        this.pendingRequests = new Map();
    }

    /**
     * Execute request dengan deduplication
     * Jika ada request yang sama sedang berjalan, tunggu hasilnya
     * Jangan buat request baru
     */
    async deduplicate(key, requestFn) {
        // Jika request ini sedang berjalan, tunggu hasilnya
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        // Buat promise untuk request baru
        const promise = requestFn()
            .finally(() => {
                // Hapus dari pending setelah selesai
                this.pendingRequests.delete(key);
            });

        // Simpan promise di map
        this.pendingRequests.set(key, promise);

        return promise;
    }

    /**
     * Cancel pending request
     */
    cancel(key) {
        this.pendingRequests.delete(key);
    }

    /**
     * Clear all pending requests
     */
    clearAll() {
        this.pendingRequests.clear();
    }
}

export const requestDeduplicator = new RequestDeduplicator();
