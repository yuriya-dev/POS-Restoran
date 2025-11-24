import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Utensils, User, Coffee, CheckCircle, Loader2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/common/ConfirmModal';

// Helper untuk menghitung durasi (Menit/Jam)
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
    
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [currentTime, setCurrentTime] = useState(new Date()); // State untuk trigger update waktu

    // Modal State
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [tableToClear, setTableToClear] = useState(null);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        fetchTables();
        
        // Timer agar durasi di kartu update setiap 1 menit
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchTables = async () => {
        try {
            const res = await api.getTables();
            // Sortir meja (Numerik lalu Abjad)
            const sorted = (res.data || []).sort((a, b) => 
                a.number.localeCompare(b.number, undefined, { numeric: true })
            );
            setTables(sorted);
        } catch (error) {
            toast.error("Gagal memuat data meja");
        } finally {
            setLoading(false);
        }
    };

    const handleTableClick = (table) => {
        navigate(`/order/${table.table_id}`);
    };

    const openClearModal = (e, table) => {
        // ✅ STOP PROPAGATION GANDA (Click & MouseDown)
        // Ini mencegah event "tembus" ke container parent di layar sentuh
        e.stopPropagation(); 
        e.preventDefault();
        
        setTableToClear(table);
        setIsClearModalOpen(true);
    };

    const confirmClear = async () => {
        if (!tableToClear) return;
        
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

    const getStatusColor = (status) => {
        switch(status) {
            case 'available': return 'bg-white border-gray-200 hover:border-blue-400 text-gray-800 shadow-sm';
            // Tambahkan border merah lebih tebal untuk meja terisi
            case 'occupied': return 'bg-red-50 border-red-300 text-red-800 shadow-md ring-1 ring-red-100';
            case 'reserved': return 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-sm';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
            {/* Filter Tabs */}
            <div className="px-6 py-4 flex space-x-2 overflow-x-auto flex-shrink-0">
                {['all', 'dine_in', 'service'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize shadow-sm whitespace-nowrap
                            ${filter === type 
                                ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                    >
                        {type === 'all' ? 'Semua Area' : type.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Grid Meja */}
            <main className="flex-grow p-6 pt-0 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-20 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat Denah...
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
                        {filteredTables.map(table => (
                            <div 
                                key={table.table_id}
                                onClick={() => handleTableClick(table)}
                                className={`
                                    relative h-36 rounded-2xl border-2 p-4 cursor-pointer transition-all transform active:scale-95 flex flex-col justify-between group
                                    ${getStatusColor(table.status)}
                                `}
                            >
                                {/* Header Kartu */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-2xl font-bold block">{table.number}</span>
                                        {/* DURASI WAKTU */}
                                        {table.status === 'occupied' && table.occupied_at && (
                                            <div className="flex items-center text-xs font-medium text-red-600 mt-1 bg-red-100 px-2 py-0.5 rounded-md w-fit">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {getDuration(table.occupied_at)}
                                            </div>
                                        )}
                                    </div>
                                    {table.type === 'service' ? <Coffee className="w-5 h-5 opacity-50" /> : <Utensils className="w-5 h-5 opacity-50" />}
                                </div>
                                
                                {/* Tombol Bersihkan - Z-Index Tinggi & Event Handler Ganda */}
                                {table.status === 'occupied' && (
                                    <button 
                                        onClick={(e) => openClearModal(e, table)}
                                        onMouseDown={(e) => e.stopPropagation()} // ✅ Cegah "tembus" di layar sentuh
                                        className="absolute top-2 right-2 bg-white border border-red-200 text-red-500 p-2 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all z-20"
                                        title="Pelanggan Pulang"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                )}
                                
                                {/* Footer Kartu */}
                                <div className="flex justify-between items-end mt-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                        table.status === 'occupied' ? 'bg-white/50 text-red-800 border border-red-200' : 'bg-black/5 text-gray-600'
                                    }`}>
                                        {table.status}
                                    </span>
                                    {table.type === 'dine_in' && (
                                        <div className="flex items-center text-xs opacity-60 font-medium">
                                            <User className="w-3 h-3 mr-1" /> {table.capacity}
                                        </div>
                                    )}
                                </div>
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
                message={`Apakah Anda yakin meja "${tableToClear?.number}" sudah kosong dan siap digunakan kembali?`}
                confirmText={isClearing ? "Memproses..." : "Ya, Bersihkan Meja"}
                confirmButtonClass="bg-green-600 hover:bg-green-700"
                disabled={isClearing}
            />
        </div>
    );
};

export default TableMap;