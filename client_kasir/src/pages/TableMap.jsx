import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Utensils, User, Coffee, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TableMap = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await api.getTables();
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

    // ✅ FITUR BARU: Clear Table
    const handleClearTable = async (e, tableId) => {
        e.stopPropagation(); // Mencegah navigasi ke halaman order saat klik tombol ini
        
        if(!window.confirm("Apakah pelanggan sudah pulang? Kosongkan meja ini?")) return;

        const toastId = toast.loading("Mengupdate meja...");
        try {
            await api.clearTable(tableId);
            toast.success("Meja Kosong", { id: toastId });
            fetchTables(); // Refresh data
        } catch (err) {
            toast.error("Gagal update meja", { id: toastId });
        }
    };

    const filteredTables = tables.filter(t => filter === 'all' || t.type === filter);

    const getStatusColor = (status) => {
        switch(status) {
            case 'available': return 'bg-white border-gray-200 hover:border-blue-400 text-gray-800 shadow-sm';
            case 'occupied': return 'bg-red-50 border-red-200 text-red-800 shadow-sm ring-1 ring-red-100';
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
                                    relative h-32 rounded-2xl border-2 p-4 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col justify-between group
                                    ${getStatusColor(table.status)}
                                `}
                            >
                                {/* Header Kartu */}
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl font-bold">{table.number}</span>
                                    {table.type === 'service' ? <Coffee className="w-5 h-5 opacity-50" /> : <Utensils className="w-5 h-5 opacity-50" />}
                                </div>
                                
                                {/* Tombol Bersihkan */}
                                {table.status === 'occupied' && (
                                    <button 
                                        onClick={(e) => handleClearTable(e, table.table_id)}
                                        className="absolute top-2 right-2 bg-red-100 text-red-600 p-2 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-colors z-10"
                                        title="Pelanggan Pulang (Bersihkan Meja)"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                )}
                                
                                {/* Footer Kartu */}
                                <div className="flex justify-between items-end">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                        table.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-black/5 text-gray-600'
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
        </div>
    );
};

export default TableMap;