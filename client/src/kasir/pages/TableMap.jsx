import React, { useEffect, useState } from 'react';
import { api } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
import { LogOut, User, Coffee, RefreshCw, Clock, Armchair } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../../shared/components/common/ConfirmModal';

// Helper duration tetap sama...
const getDuration = (startTime) => {
    if (!startTime) return '';
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) return `${hours}j ${mins}m`;
    return `${mins} mnt`;
};

const TableMap = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [currentTime, setCurrentTime] = useState(new Date());

    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [tableToClear, setTableToClear] = useState(null);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        // ✅ FETCH INITIAL + AUTO-REFRESH SETIAP 15 DETIK
        fetchTables();
        
        // Auto-refresh table status setiap 15 detik
        const refreshInterval = setInterval(() => {
            fetchTables();
        }, 15000);
        
        // ✅ LISTEN TO ORDER COMPLETION EVENT - FETCH IMMEDIATE
        const handleOrderCompleted = () => {
            fetchTables();
        };
        window.addEventListener('orderCompleted', handleOrderCompleted);
        
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        
        return () => {
            clearInterval(refreshInterval);
            clearInterval(timer);
            window.removeEventListener('orderCompleted', handleOrderCompleted);
        };
    }, []);

    const fetchTables = async () => {
        try {
            let dataMeja = [];

            // 1. Coba Ambil dari API
            try {
                const res = await api.getTables();
                dataMeja = res.data || [];
                localStorage.setItem('cached_tables', JSON.stringify(dataMeja));
            } catch (err) {
                // 2. Fallback ke Cache jika Offline
                const cached = localStorage.getItem('cached_tables');
                if (cached) {
                    dataMeja = JSON.parse(cached);
                } else {
                    throw err;
                }
            }

            // 3. ✅ CEK TRANSAKSI OFFLINE (OVERRIDE STATUS)
            // Ambil order offline yang belum sync
            const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
            
            // Buat Set ID Meja yang dipakai di offline orders
            const offlineOccupiedTableIds = new Set(
                offlineOrders
                    .filter(o => o.table_id) // Pastikan ada table_id
                    .map(o => String(o.table_id)) // Konversi ke string biar aman
            );

            // Modifikasi dataMeja: Jika ID ada di offlineOccupied, ubah jadi occupied
            const mergedTables = dataMeja.map(t => {
                if (offlineOccupiedTableIds.has(String(t.table_id))) {
                    return {
                        ...t,
                        status: 'occupied',
                        // Gunakan waktu lokal order offline sbg waktu mulai
                        occupied_at: offlineOrders.find(o => String(o.table_id) === String(t.table_id))?.savedAt || new Date().toISOString()
                    };
                }
                return t;
            });

            // Sortir
            const sorted = mergedTables.sort((a, b) => 
                a.number.localeCompare(b.number, undefined, { numeric: true })
            );
            setTables(sorted);

        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data meja");
        } finally {
            setLoading(false);
        }
    };

    const handleTableClick = (table) => {
        navigate(`/order/${table.table_id}`);
    };

    const openClearModal = (e, table) => {
        e.stopPropagation(); 
        e.preventDefault();
        setTableToClear(table);
        setIsClearModalOpen(true);
    };

    const confirmClear = async () => {
        if (!tableToClear) return;
        
        // Jika ini meja offline, kita harus hapus dari antrian offline_orders juga
        // Tapi logikanya, jika kasir membersihkan meja, berarti order dianggap selesai.
        // Namun API clearTable butuh koneksi.
        
        if (!navigator.onLine) {
            toast.error("Tidak bisa update status meja saat Offline!");
            setIsClearModalOpen(false);
            return;
        }

        setIsClearing(true);
        const toastId = toast.loading("Mengupdate meja...");
        try {
            await api.clearTable(tableToClear.table_id);
            toast.success("Meja Kosong", { id: toastId });
            await fetchTables(); 
        } catch (err) {
            toast.error("Gagal update meja", { id: toastId });
        } finally {
            setIsClearing(false);
            setIsClearModalOpen(false);
            setTableToClear(null);
        }
    };

    const filteredTables = tables.filter(t => filter === 'all' || t.type === filter);

    const getCardStyle = (status) => {
        switch(status) {
            case 'occupied': 
                return 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-900/50 shadow-lg shadow-red-100/50 dark:shadow-none ring-1 ring-red-100 dark:ring-red-900/30';
            case 'reserved': 
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200';
            default: 
                return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-none group-hover:-translate-y-1'; 
        }
    };

    return (
        <div className="h-full bg-[#F5F7FA] dark:bg-gray-900 flex flex-col overflow-hidden font-sans transition-colors duration-200">
            
            {/* Header & Filter */}
            <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Denah Restoran</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Pilih meja untuk memulai pesanan</p>
                </div>

                {/* Filter Tabs Modern */}
                <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    {['all', 'dine_in', 'service'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 capitalize
                                ${filter === type 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}
                        >
                            {type === 'all' ? 'Semua' : type.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Meja */}
            <main className="flex-grow px-8 pb-8 pt-3 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[55vh] text-gray-400 dark:text-gray-500 bg-[#F5F7FA] dark:bg-gray-900 transition-colors">
                        <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p className="font-medium">Memuat denah meja...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {filteredTables.map(table => (
                            <div 
                                key={table.table_id}
                                onClick={() => handleTableClick(table)}
                                className={`
                                    relative h-48 rounded-[2rem] p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between group border-2
                                    ${getCardStyle(table.status)}
                                `}
                            >
                                {/* Bagian Atas: Nomor & Icon */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className={`text-3xl font-black tracking-tighter ${
                                            table.status === 'occupied' ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'
                                        }`}>
                                            {table.number}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
                                            {table.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    {/* Icon Tipe Meja */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        table.status === 'occupied' 
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                    }`}>
                                        {table.type === 'service' ? <Coffee className="w-5 h-5" /> : <Armchair className="w-5 h-5" />}
                                    </div>
                                </div>
                                
                                {/* Bagian Tengah: Durasi (Jika Occupied) */}
                                <div className="flex-grow flex items-center mt-2">
                                    {table.status === 'occupied' && table.occupied_at ? (
                                        <div className="flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg border border-red-100 dark:border-red-800 w-full transition-colors">
                                            <Clock className="w-4 h-4 mr-2 animate-pulse" />
                                            <span className="font-bold text-sm">{getDuration(table.occupied_at)}</span>
                                        </div>
                                    ) : (
                                        // Placeholder
                                        <div className="w-full h-8" />
                                    )}
                                </div>

                                {/* Bagian Bawah: Status & Kapasitas */}
                                <div className="flex justify-between items-end mt-2 pt-3 border-t border-dashed border-gray-100 dark:border-gray-700">
                                    <div className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                                        table.status === 'occupied' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200' : 
                                        table.status === 'available' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200'
                                    }`}>
                                        {table.status === 'available' ? 'Kosong' : table.status === 'occupied' ? 'Terisi' : 'Dipesan'}
                                    </div>
                                    
                                    {table.type === 'dine_in' && (
                                        <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs font-medium">
                                            <User className="w-3 h-3 mr-1" />
                                            <span>{table.capacity}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tombol Aksi Cepat: Clear Table (Hanya Muncul Jika Occupied) */}
                                {table.status === 'occupied' && (
                                    <button 
                                        onClick={(e) => openClearModal(e, table)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg shadow-red-200 dark:shadow-none hover:scale-110 transition-all flex items-center justify-center z-20 border-4 border-[#F5F7FA] dark:border-gray-900"
                                        title="Pelanggan Pulang"
                                    >
                                        <LogOut className="w-4 h-4 ml-0.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Konfirmasi */}
            <ConfirmModal
                isOpen={isClearModalOpen}
                onClose={() => !isClearing && setIsClearModalOpen(false)}
                onConfirm={confirmClear}
                title="Pelanggan Pulang?"
                message={`Apakah meja "${tableToClear?.number}" sudah kosong dan siap digunakan kembali?`}
                confirmText={isClearing ? "Memproses..." : "Ya, Bersihkan"}
                confirmButtonClass="bg-blue-600 hover:bg-blue-700 text-white w-full justify-center"
                cancelText="Batal"
                disabled={isClearing}
            />
        </div>
    );
};

export default TableMap;