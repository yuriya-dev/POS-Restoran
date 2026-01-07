import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Utensils, Grid, ChevronLeft, RefreshCw, Plus, ChefHat, WifiOff } from 'lucide-react'; // ✅ Tambah WifiOff
import { api } from '../../shared/services/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../../shared/utils/helpers';
import CartSidebar from '../components/CartSidebar';
import toast from 'react-hot-toast';

const OrderPage = () => {
    const { tableId } = useParams(); 
    const navigate = useNavigate();
    const { addToCart, setSelectedTable } = useCart();

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Coba ambil data dari Server (Online)
                const [menuRes, catRes] = await Promise.all([
                    api.getMenuItems(),
                    api.getCategories()
                ]);
                
                const availableMenu = ((Array.isArray(menuRes.data) ? menuRes.data : []) || []).filter(m => m.isAvailable);
                const categoriesData = Array.isArray(catRes.data) ? catRes.data : [];
                
                // Update State
                setMenuItems(availableMenu);
                setCategories(categoriesData);
                
                // ✅ SUKSES: Simpan data ke LocalStorage untuk cadangan Offline
                localStorage.setItem('cached_menuItems', JSON.stringify(availableMenu));
                localStorage.setItem('cached_categories', JSON.stringify(catRes.data || []));
                
                setSelectedTable(tableId);

            } catch (err) {
                console.warn("Gagal koneksi ke server, mencoba data offline...", err);

                // ✅ ERROR/OFFLINE: Ambil data dari LocalStorage
                const cachedMenu = localStorage.getItem('cached_menuItems');
                const cachedCategories = localStorage.getItem('cached_categories');

                if (cachedMenu && cachedCategories) {
                    setMenuItems(JSON.parse(cachedMenu));
                    setCategories(JSON.parse(cachedCategories));
                    setSelectedTable(tableId);
                    
                    // Beri tahu user bahwa ini mode offline
                    toast("Mode Offline: Menampilkan menu tersimpan", {
                        icon: <WifiOff className="w-4 h-4 text-orange-500" />,
                        style: { borderRadius: '10px', background: '#333', color: '#fff' },
                        duration: 4000
                    });
                } else {
                    // Jika tidak ada cache sama sekali
                    toast.error("Gagal memuat menu. Periksa koneksi internet.");
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [tableId, setSelectedTable]);

    const filteredMenu = useMemo(() => {
        return menuItems.filter(item => {
            const matchCat = selectedCategory === 'all' || item.category == selectedCategory;
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [menuItems, selectedCategory, search]);

    return (
        <div className="flex h-screen bg-[#F5F7FA] dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-200">
            
            {/* BAGIAN KIRI: KATALOG MENU */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Header & Search */}
                <div className="bg-white dark:bg-gray-800 px-6 py-5 flex justify-between items-center sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/')} 
                            className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl transition-all text-gray-600 dark:text-gray-200 active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-500"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Meja {tableId}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{filteredMenu.length} menu tersedia</p>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative w-72 lg:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari menu..." 
                            className="block w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 font-medium shadow-inner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Kategori Tabs */}
                <div className="px-6 py-5 overflow-x-auto flex gap-3 bg-[#F5F7FA] dark:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800 w-full">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 shrink-0
                            ${selectedCategory === 'all' 
                                ? 'bg-blue-600 text-white shadow-blue-200 dark:shadow-none' 
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                    >
                        <Grid className="w-4 h-4" /> Semua
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.categoryId}
                            onClick={() => setSelectedCategory(cat.categoryId)}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 shrink-0
                                ${selectedCategory === cat.categoryId 
                                    ? 'bg-blue-600 text-white shadow-blue-200 dark:shadow-none' 
                                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                        >
                            <Utensils className="w-4 h-4" /> {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid Menu Items */}
                <div className="flex-1 overflow-y-auto px-6 pb-32 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-[55vh] text-gray-400 dark:text-gray-500 bg-[#F5F7FA] dark:bg-gray-900 transition-colors">
                            <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                            <p className="font-medium">Menyiapkan daftar menu...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 mt-6">
                            {filteredMenu.map(item => (
                                <div 
                                    key={item.itemId} 
                                    onClick={() => addToCart(item)}
                                    className="group bg-white dark:bg-gray-800 rounded-[2rem] p-3 pb-4 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 flex flex-col active:scale-[0.98]"
                                >
                                    {/* Gambar Menu */}
                                    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-[1.5rem] overflow-hidden mb-3 relative shadow-inner">
                                        {item.image_url ? (
                                            <img 
                                                src={item.image_url} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blue-200 dark:text-gray-600">
                                                <ChefHat className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Info Menu */}
                                    <div className="px-2 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.name}
                                        </h3>
                                        
                                        {/* Harga & Tombol Tambah */}
                                        <div className="mt-auto flex items-center justify-between pt-3">
                                            <p className="text-blue-600 dark:text-blue-400 font-black text-lg">
                                                {formatCurrency(item.price).replace('Rp', '')}
                                            </p>
                                            
                                            {/* Tombol + (Selalu Terlihat & Modern) */}
                                            <button 
                                                className="w-9 h-9 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300 active:scale-90"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
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