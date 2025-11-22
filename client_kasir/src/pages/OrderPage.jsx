import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Utensils, Coffee, Grid, Tag, ChevronLeft } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import CartSidebar from '../components/CartSidebar';
import toast from 'react-hot-toast';

const OrderPage = () => {
    const { tableId } = useParams(); // Ambil ID Meja dari URL
    const navigate = useNavigate();
    const { addToCart, setSelectedTable } = useCart();

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // 1. Load Data Menu & Kategori
    useEffect(() => {
        const loadData = async () => {
            try {
                const [menuRes, catRes] = await Promise.all([
                    api.getMenuItems(), // Pastikan endpoint ini ada di api.js client_kasir
                    api.getCategories() // Pastikan endpoint ini ada di api.js client_kasir
                ]);
                
                // Filter hanya menu yang tersedia (isAvailable = true)
                const availableMenu = (menuRes.data || []).filter(m => m.isAvailable);
                setMenuItems(availableMenu);
                setCategories(catRes.data || []);
                
                // Set meja aktif di context
                setSelectedTable(tableId);
            } catch (err) {
                console.error(err);
                toast.error("Gagal memuat menu");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [tableId, setSelectedTable]);

    // 2. Filter Menu Logic
    const filteredMenu = useMemo(() => {
        return menuItems.filter(item => {
            const matchCat = selectedCategory === 'all' || item.category == selectedCategory;
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [menuItems, selectedCategory, search]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            
            {/* BAGIAN KIRI: DAFTAR MENU */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Header Menu */}
                <div className="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center">
                        <button onClick={() => navigate('/')} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Order: Meja #{tableId}</h1>
                            <p className="text-sm text-gray-500">{filteredMenu.length} menu tersedia</p>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative w-64">
                        <input 
                            type="text" 
                            placeholder="Cari makanan..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                {/* Kategori Tabs */}
                <div className="px-6 py-3 bg-white border-b flex space-x-2 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                            selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Grid className="w-4 h-4 inline-block mr-2" /> Semua
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.categoryId}
                            onClick={() => setSelectedCategory(cat.categoryId)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                                selectedCategory === cat.categoryId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {/* Render Icon Sederhana */}
                            <Utensils className="w-4 h-4 inline-block mr-2" /> 
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid Menu Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center pt-20">Loading Menu...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                            {filteredMenu.map(item => (
                                <div 
                                    key={item.itemId} 
                                    onClick={() => addToCart(item)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-400 transition group active:scale-95"
                                >
                                    {/* Gambar Menu */}
                                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Utensils className="w-8 h-8" />
                                            </div>
                                        )}
                                        {/* Add Button Overlay */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                + Tambah
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Info Menu */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-gray-800 text-sm line-clamp-1" title={item.name}>
                                            {item.name}
                                        </h3>
                                        <p className="text-blue-600 font-bold text-sm mt-1">
                                            {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* BAGIAN KANAN: SIDEBAR KERANJANG */}
            <CartSidebar />

        </div>
    );
};

export default OrderPage;