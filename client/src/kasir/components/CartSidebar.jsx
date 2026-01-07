import React, { useState, useRef } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Wallet, Banknote, ChevronRight, Printer, Check, NotepadText, WifiOff, X, Receipt as ReceiptIcon, ChevronUp, Loader2, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../../shared/context/SettingsContext';
import { formatCurrency } from '../../shared/utils/helpers';
import { api } from '../../shared/services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';
import { Receipt } from './Receipt';
import ConfirmModal from '../../shared/components/common/ConfirmModal'; // ✅ Import Modal Konfirmasi

const CartSidebar = () => {
    const { cartItems, addToCart, decreaseQty, removeFromCart, updateNotes, cartTotals, clearCart, selectedTable } = useCart();
    const { settings } = useSettings();
    
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccessData, setOrderSuccessData] = useState(null);
    
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [tempNote, setTempNote] = useState('');

    // State untuk Penanganan Stok Habis
    const [stockErrorModal, setStockErrorModal] = useState({ isOpen: false, message: '', itemId: null, neededQty: 0, itemName: '' });

    const navigate = useNavigate();
    const { toPDF, targetRef } = usePDF({filename: `struk_${new Date().getTime()}.pdf`});

    const changeGiven = (Number(cashReceived) || 0) - cartTotals.total;

    const startEditingNote = (item) => {
        setEditingNoteId(item.itemId);
        setTempNote(item.notes || '');
    };

    const saveNote = (itemId) => {
        const cleanNote = tempNote.trim();
        updateNotes(itemId, cleanNote);
        setEditingNoteId(null);
    };

    const cancelEditNote = () => {
        setEditingNoteId(null);
        setTempNote('');
    };

    const saveOrderOffline = (payload) => {
        const existingOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
        
        const offlineOrder = {
            ...payload,
            // ✅ ADD orderName untuk offline order agar format sama
            orderName: `Meja ${payload.table_id}`,
            tempId: Date.now(),
            isOffline: true,
            savedAt: new Date().toISOString(),
            serviceCharge: cartTotals.serviceCharge,
            packagingFee: cartTotals.packaging,
        };

        localStorage.setItem('offline_orders', JSON.stringify([...existingOrders, offlineOrder]));

        toast("Internet Mati. Disimpan di perangkat.", {
            icon: <WifiOff className="w-5 h-5 text-orange-500" />,
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
            duration: 4000
        });

        setOrderSuccessData({
            ...offlineOrder,
            orderId: `OFF-${offlineOrder.tempId}`,
            dailyNumber: 'OFF',
            date: new Date().toISOString(),
            cashier: 'Offline'
        });

        clearCart();
        setIsMobileOpen(false);
    };

    // Handler untuk memaksa update stok jika dapur konfirmasi ada
    const handleForceStockUpdate = async () => {
        const { itemId, neededQty, itemName } = stockErrorModal;
        const toastId = toast.loading(`Mengupdate stok ${itemName}...`);
        
        try {
            // Update stok di server menjadi jumlah yang dibutuhkan + buffer 5
            await api.updateMenuItem(itemId, { stock: neededQty + 5 });
            
            toast.success("Stok diperbarui!", { id: toastId });
            setStockErrorModal({ ...stockErrorModal, isOpen: false });
            
            // Coba checkout lagi otomatis
            handleCheckout();
        } catch (error) {
            console.error(error);
            toast.error("Gagal update stok. Hubungi Admin.", { id: toastId });
            setStockErrorModal({ ...stockErrorModal, isOpen: false });
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        if (paymentMethod === 'cash' && (Number(cashReceived) < cartTotals.total)) {
            toast.error(`Uang kurang! Total: ${formatCurrency(cartTotals.total)}`);
            return;
        }

        setIsProcessing(true);

        const user = JSON.parse(localStorage.getItem('pos_kasir_user'));
        
        const payload = {
            table_id: selectedTable, 
            userId: user?.userId,
            // ✅ REMOVE orderName - biar server yang generate dari table info
            status: 'paid',
            paymentMethod: paymentMethod,
            subtotal: cartTotals.subtotal,
            taxAmount: cartTotals.tax,
            totalAmount: cartTotals.total,
            cashReceived: paymentMethod === 'cash' ? Number(cashReceived) : cartTotals.total,
            changeGiven: paymentMethod === 'cash' ? changeGiven : 0,
            items: cartItems.map(item => ({
                itemId: item.itemId, name: item.name, price: item.price, quantity: item.quantity, 
                notes: (item.notes || '').trim() // ✅ Trim notes saat kirim
            }))
        };

        if (!navigator.onLine) {
            saveOrderOffline(payload);
            setIsProcessing(false);
            return;
        }

        try {
            const res = await api.createOrder(payload);
            
            // ✅ INVALIDATE CACHE MEJA AGAR REFRESH OTOMATIS
            localStorage.removeItem('cached_tables');
            
            setOrderSuccessData({
                ...payload,
                serviceCharge: cartTotals.serviceCharge,
                packagingFee: cartTotals.packaging,
                orderId: res.data.orderId,
                dailyNumber: res.data.dailyNumber,
                date: new Date().toISOString(),
                cashier: user?.fullName || 'Kasir'
            });
            
            toast.success("Transaksi Berhasil!");
            clearCart(); 
        } catch (error) {
            console.error("Checkout Error:", error);
            
            const errorMsg = error.response?.data?.message || error.message;

            // ✅ DETEKSI ERROR STOK (DIPERBAIKI)
            // Cek status 400 dan pesan mengandung 'stok'
            if (error.response?.status === 400 && errorMsg.toLowerCase().includes('stok')) {
                // 1. Coba cari item spesifik dari pesan error
                let problematicItem = cartItems.find(item => 
                    errorMsg.toLowerCase().includes(item.name.toLowerCase())
                );
                
                // 2. Fallback: Jika pesan generic (misal "Stok habis!"), ambil item pertama di cart
                // Asumsinya jika hanya 1 item, pasti itu penyebabnya. Jika banyak, ambil yang pertama dulu.
                if (!problematicItem && cartItems.length > 0) {
                     problematicItem = cartItems[0];
                }
                
                if (problematicItem) {
                    setStockErrorModal({
                        isOpen: true,
                        message: errorMsg,
                        itemId: problematicItem.itemId,
                        itemName: problematicItem.name,
                        neededQty: problematicItem.quantity
                    });
                } else {
                    toast.error(errorMsg);
                }
            } 
            else if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
                saveOrderOffline(payload);
            } else {
                toast.error("Gagal memproses pesanan: " + errorMsg);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const finishOrder = () => {
        setOrderSuccessData(null);
        setCashReceived('');
        setIsMobileOpen(false);
        // ✅ TRIGGER REFRESH TABEL SAAT KEMBALI
        navigate('/', { state: { refresh: true } });
    };

    // --- MODE SUKSES (STRUK) ---
    if (orderSuccessData) {
        return (
            <div className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:static lg:w-[400px] lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:shadow-2xl flex flex-col h-full p-8 items-center justify-center transition-colors duration-200 ${isMobileOpen ? 'flex' : 'hidden lg:flex'}`}>
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    {orderSuccessData.isOffline ? (
                        <WifiOff className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                    ) : (
                        <Check className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    )}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
                    {orderSuccessData.isOffline ? 'Disimpan Offline' : 'Pembayaran Sukses!'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium text-center">
                    {orderSuccessData.isOffline 
                        ? 'Data akan disinkronkan saat online.' 
                        : `Order #${orderSuccessData.dailyNumber || orderSuccessData.orderId}`
                    }
                </p>
                
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                    <Receipt ref={targetRef} data={orderSuccessData} />
                </div>

                <div className="w-full space-y-4">
                    <button onClick={() => toPDF()} className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-black dark:hover:bg-gray-600 transition shadow-lg hover:shadow-xl active:scale-95">
                        <Printer className="w-5 h-5 mr-3" /> Cetak Struk
                    </button>
                    <button onClick={finishOrder} className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95">
                        {orderSuccessData.isOffline ? 'Kembali ke Menu' : 'Selesai & Kembali'}
                    </button>
                </div>
            </div>
        );
    }

    // --- MODE UTAMA (KERANJANG) ---
    return (
        <>
            {/* 1. MOBILE SUMMARY BAR */}
            {!isMobileOpen && (
                <div 
                    className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between cursor-pointer transition-colors duration-200"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-800">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Pesanan</span>
                            <span className="text-lg font-extrabold text-gray-900 dark:text-white">{formatCurrency(cartTotals.total)}</span>
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center shadow-lg shadow-blue-200 dark:shadow-none">
                        Lihat Detail <ChevronUp className="w-4 h-4 ml-1" />
                    </button>
                </div>
            )}

            {/* 2. OVERLAY BACKGROUND */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* 3. SIDEBAR CONTAINER */}
            <div className={`
                fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl rounded-t-[2rem] lg:rounded-none
                lg:static lg:inset-auto lg:w-[420px] lg:h-full lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:translate-y-0 lg:shadow-none
                ${isMobileOpen ? 'h-[85vh] translate-y-0' : 'translate-y-full h-0 lg:h-full'}
            `}>
                
                {/* Header Cart - Fixed Top */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between rounded-t-[2rem] lg:rounded-none shrink-0 z-10 relative transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-white text-lg">Keranjang</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Meja {selectedTable}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs px-3 py-1.5 rounded-full font-bold">
                            {cartItems.length} Item
                        </span>
                        <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-gray-800/50 relative">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 space-y-4 opacity-60">
                            <ReceiptIcon className="w-20 h-20 stroke-1" />
                            <p className="text-base font-medium">Belum ada pesanan</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.itemId} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group transition-colors">
                                
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-2">
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-snug">{item.name}</h4>
                                        <p className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-1">{formatCurrency(item.price)}</p>
                                        
                                        {/* Notes Display */}
                                        {(item.notes || editingNoteId === item.itemId) && (
                                            <div className="mt-2">
                                                {editingNoteId === item.itemId ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            autoFocus
                                                            type="text" 
                                                            value={tempNote}
                                                            onChange={(e) => setTempNote(e.target.value)}
                                                            className="w-full text-xs border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                                            placeholder="Catatan..."
                                                            onKeyDown={(e) => e.key === 'Enter' && saveNote(item.itemId)}
                                                        />
                                                        <button onClick={() => saveNote(item.itemId)} className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50"><Check className="w-3 h-3" /></button>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        onClick={() => startEditingNote(item)}
                                                        className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-700 dark:hover:text-blue-300 transition-colors w-fit"
                                                    >
                                                        <NotepadText className="w-3 h-3" />
                                                        {item.notes}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Add Note Button */}
                                        {!item.notes && editingNoteId !== item.itemId && (
                                            <button onClick={() => startEditingNote(item)} className="mt-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-opacity">
                                                <Plus className="w-3 h-3" /> Tambah Catatan
                                            </button>
                                        )}
                                    </div>

                                    <button onClick={() => removeFromCart(item.itemId)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-1 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Qty Control */}
                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 rounded-lg p-1">
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => decreaseQty(item.itemId)} className="w-7 h-7 bg-white dark:bg-gray-800 rounded shadow-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="font-bold text-sm w-4 text-center text-gray-800 dark:text-white">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="w-7 h-7 bg-blue-600 text-white rounded shadow-sm flex items-center justify-center hover:bg-blue-700 transition-colors">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 pr-2">
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Payment */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/20 z-20 shrink-0 transition-colors duration-200">
                    
                    {/* Payment Methods */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { id: 'cash', label: 'Tunai', icon: Banknote },
                            { id: 'qris', label: 'QRIS', icon: Wallet },
                            { id: 'debit', label: 'Debit', icon: CreditCard }
                        ].map(method => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-200 ${
                                    paymentMethod === method.id 
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500' 
                                        : 'border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <method.icon className={`w-5 h-5 mb-1 ${paymentMethod === method.id ? 'fill-blue-200 dark:fill-blue-900' : ''}`} />
                                <span className="text-[10px] font-bold uppercase tracking-wide">{method.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Cash Input */}
                    {paymentMethod === 'cash' && (
                        <div className="mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Uang Diterima</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                                <input 
                                    type="number" 
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-bold text-xl text-gray-800 dark:text-white bg-white dark:bg-gray-800 transition-colors"
                                    placeholder="0"
                                />
                            </div>
                            {Number(cashReceived) > 0 && (
                                <div className="flex justify-between items-center mt-3 px-1">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Kembalian</span>
                                    <span className={`text-sm font-bold ${changeGiven < 0 ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                        {formatCurrency(changeGiven)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cartTotals.subtotal)}</span>
                        </div>
                        {(cartTotals.serviceCharge > 0 || cartTotals.packaging > 0) && (
                            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                                <span>Biaya Tambahan</span>
                                <span>{formatCurrency(cartTotals.serviceCharge + cartTotals.packaging)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Pajak</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cartTotals.tax)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
                            <span className="font-bold text-gray-800 dark:text-white">Total</span>
                            <span className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">{formatCurrency(cartTotals.total)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0 || isProcessing || (paymentMethod === 'cash' && changeGiven < 0)}
                        className="w-full bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl shadow-gray-200 dark:shadow-blue-900/20 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-between px-6 transition-all duration-200 transform active:scale-[0.98]"
                    >
                        <span className="flex flex-col items-start">
                            <span className="text-[10px] font-normal opacity-80 uppercase tracking-wider">Proses Pembayaran</span>
                            <span className="text-lg leading-none">{formatCurrency(cartTotals.total)}</span>
                        </span>
                        <div className="bg-white/20 p-2 rounded-full">
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                        </div>
                    </button>
                </div>

            </div>

            {/* MODAL KONFIRMASI UPDATE STOK (DITAMBAHKAN) */}
            <ConfirmModal
                isOpen={stockErrorModal.isOpen}
                onClose={() => setStockErrorModal({ ...stockErrorModal, isOpen: false })}
                onConfirm={handleForceStockUpdate}
                type="info"
                title="Stok Sistem Habis"
                message={
                    <div className="text-center">
                        <p className="mb-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {stockErrorModal.message}
                        </p>
                        <div className="text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-100 dark:border-blue-800 mb-2">
                            Apakah dapur mengonfirmasi stok fisik masih tersedia?
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Jika "Ya", sistem akan otomatis menambah stok dan melanjutkan pesanan.
                        </p>
                    </div>
                }
                confirmText="Ya, Lanjutkan Order"
                cancelText="Batal"
                confirmButtonClass="bg-blue-600 hover:bg-blue-700 text-white w-full"
            />
        </>
    );
};

export default CartSidebar;