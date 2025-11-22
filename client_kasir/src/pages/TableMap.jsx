import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Utensils, User, Clock, CheckCircle, Coffee } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const TableMap = () => {
    const { user, logout } = useAuth();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, dine_in, service

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await api.getTables();
            setTables(res.data);
        } catch (error) {
            toast.error("Gagal memuat data meja");
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredTables = tables.filter(t => filter === 'all' || t.type === filter);

    // Status Colors
    const getStatusColor = (status) => {
        switch(status) {
            case 'available': return 'bg-white border-gray-200 hover:border-green-400 text-gray-800';
            case 'occupied': return 'bg-red-50 border-red-200 text-red-800';
            case 'reserved': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster />
            
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">POS Restoran</h1>
                    <p className="text-xs text-gray-500">Halo, {user?.fullName || 'Kasir'}</p>
                </div>
                <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            {/* Filter Tabs */}
            <div className="px-6 py-4 flex space-x-2 overflow-x-auto">
                {['all', 'dine_in', 'service'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize
                            ${filter === type 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                    >
                        {type === 'all' ? 'Semua Area' : type.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Grid Meja */}
            <main className="grow p-6 pt-0 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center py-20">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredTables.map(table => (
                            <div 
                                key={table.table_id}
                                // Nanti kita tambahkan onClick untuk masuk ke halaman Order
                                onClick={() => alert(`Masuk ke Menu Order Meja ${table.number}`)}
                                className={`
                                    relative h-32 rounded-2xl border-2 p-4 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between
                                    ${getStatusColor(table.status)}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl font-bold">{table.number}</span>
                                    {table.type === 'service' ? <Coffee className="w-5 h-5 opacity-50" /> : <Utensils className="w-5 h-5 opacity-50" />}
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                                        {table.status}
                                    </span>
                                    {table.type === 'dine_in' && (
                                        <div className="flex items-center text-xs opacity-60">
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