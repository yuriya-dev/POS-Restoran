import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Wallet, Banknote, ChevronRight, Printer, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf'; // ✅ Ganti import ini
import { Receipt } from './Receipt';

const CartSidebar = () => {
    const { cartItems, addToCart, decreaseQty, removeFromCart, cartTotals, clearCart, selectedTable } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccessData, setOrderSuccessData] = useState(null);
    
    const navigate = useNavigate();

    // ✅ Setup PDF Generator
    const { toPDF, targetRef } = usePDF({filename: `struk_order_${new Date().getTime()}.pdf`});

    // Hitung kembalian real-time
    const changeGiven = (Number(cashReceived) || 0) - cartTotals.total;

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        if (paymentMethod === 'cash' && (Number(cashReceived) < cartTotals.total)) {
            toast.error(`Uang kurang! Total: ${formatCurrency(cartTotals.total)}`);
            return;
        }

        setIsProcessing(true);
        try {
            const user = JSON.parse(localStorage.getItem('pos_kasir_user'));

            const payload = {
                table_id: selectedTable, 
                userId: user?.userId,
                orderName: `Table ${selectedTable}`,
                status: 'paid',
                paymentMethod: paymentMethod,
                subtotal: cartTotals.subtotal,
                taxAmount: cartTotals.tax,
                totalAmount: cartTotals.total,
                cashReceived: paymentMethod === 'cash' ? Number(cashReceived) : cartTotals.total,
                changeGiven: paymentMethod === 'cash' ? changeGiven : 0,
                items: cartItems.map(item => ({
                    itemId: item.itemId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    notes: item.notes || ''
                }))
            };

            const res = await api.createOrder(payload);
            
            setOrderSuccessData({
                ...payload,
                orderId: res.data.orderId,
                dailyNumber: res.data.dailyNumber,
                date: new Date().toISOString(),
                cashier: user?.fullName || 'Kasir'
            });
            
            toast.success("Transaksi Berhasil!");
            clearCart(); 

        } catch (error) {
            console.error(error);
            toast.error("Gagal memproses pesanan.");
        } finally {
            setIsProcessing(false);
        }
    };

    const finishOrder = () => {
        setOrderSuccessData(null);
        setCashReceived('');
        navigate('/');
    };

    // --- MODE SUKSES / CETAK STRUK ---
    if (orderSuccessData) {
        return (
            <div className="w-96 bg-white border-l shadow-xl flex flex-col h-full p-6 items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaksi Sukses!</h2>
                <p className="text-gray-500 mb-6">Order #{orderSuccessData.dailyNumber || orderSuccessData.orderId}</p>
                
                {/* Preview Struk untuk PDF (Tetap disembunyikan dari layar user, tapi dirender untuk PDF) */}
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                    {/* Pass ref dari usePDF ke komponen Receipt */}
                    <Receipt ref={targetRef} data={orderSuccessData} />
                </div>

                <div className="w-full space-y-3">
                    <button 
                        onClick={() => toPDF()} // ✅ Panggil fungsi download PDF
                        className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center hover:bg-gray-900 transition"
                    >
                        <Printer className="w-5 h-5 mr-2" /> Cetak Struk (PDF)
                    </button>
                    <button 
                        onClick={finishOrder}
                        className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition"
                    >
                        Selesai & Kembali
                    </button>
                </div>
            </div>
        );
    }

    // --- MODE NORMAL (KERANJANG) ---
    return (
        <div className="w-96 bg-white border-l shadow-xl flex flex-col h-full z-20">
            
            {/* Cart Header */}
            <div className="p-5 border-b flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <h2 className="font-bold text-gray-800">Keranjang</h2>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                    {cartItems.length} Item
                </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
                        <ShoppingCart className="w-12 h-12" />
                        <p className="text-sm">Keranjang masih kosong</p>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.itemId} className="flex flex-col p-3 border border-gray-100 rounded-xl hover:border-blue-100 transition bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2">{item.name}</h4>
                                    <p className="text-blue-600 text-xs font-bold mt-1">{formatCurrency(item.price)}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.itemId)} className="text-gray-300 hover:text-red-500 p-1 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => decreaseQty(item.itemId)} className="w-7 h-7 bg-white rounded shadow-sm flex items-center justify-center hover:bg-gray-200 transition">
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="w-7 h-7 bg-blue-600 text-white rounded shadow-sm flex items-center justify-center hover:bg-blue-700 transition">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-gray-700 pr-2">
                                    {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Payment Section */}
            <div className="border-t bg-white p-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                
                {/* Payment Method Selector */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { id: 'cash', label: 'Tunai', icon: Banknote },
                        { id: 'qris', label: 'QRIS', icon: Wallet },
                        { id: 'debit', label: 'Debit', icon: CreditCard }
                    ].map(method => (
                        <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex flex-col items-center justify-center py-2 rounded-lg border transition ${
                                paymentMethod === method.id 
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            <method.icon className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-bold">{method.label}</span>
                        </button>
                    ))}
                </div>

                {/* Cash Input */}
                {paymentMethod === 'cash' && (
                    <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-bold">Rp</span>
                            </div>
                            <input 
                                type="number" 
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-lg"
                                placeholder="Uang Diterima"
                            />
                        </div>
                        {Number(cashReceived) > 0 && (
                            <div className={`flex justify-between text-sm mt-2 px-1 font-medium ${changeGiven < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                <span>Kembalian:</span>
                                <span>{formatCurrency(changeGiven)}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Totals */}
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cartTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Pajak (10%)</span>
                        <span>{formatCurrency(cartTotals.tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-dashed">
                        <span>Total</span>
                        <span>{formatCurrency(cartTotals.total)}</span>
                    </div>
                </div>

                {/* Checkout Button */}
                <button 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || isProcessing || (paymentMethod === 'cash' && changeGiven < 0)}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-between px-6 transition-all active:scale-[0.98]"
                >
                    <span>{isProcessing ? 'Memproses...' : 'Bayar Sekarang'}</span>
                    {!isProcessing && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>

        </div>
    );
};

export default CartSidebar;