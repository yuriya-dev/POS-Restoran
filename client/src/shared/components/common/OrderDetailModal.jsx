import React, { useEffect } from 'react';
import { X, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '../../utils/helpers';

const OrderDetailModal = ({ order, onClose }) => {
    // Handle ESC Key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!order) return null;
    const items = order.items || [];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 w-screen h-screen"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] relative transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                            <Receipt className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Detail Order
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            #{order.dailyNumber || order.orderId} • {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: id })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition text-gray-500 dark:text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Info Status */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Pelanggan</span>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{order.orderName || '-'}</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                            <span className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Pembayaran</span>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm capitalize">{order.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Tabel Item */}
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 border-b dark:border-gray-700 pb-2">Item Pesanan ({items.length})</h4>
                    
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm">
                            Tidak ada data item.
                        </div>
                    ) : (
                        <div className="space-y-3 mb-6">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold w-6 h-6 flex items-center justify-center rounded text-xs mt-0.5">
                                            {item.quantity}x
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{item.itemName || item.name}</p>
                                            {item.notes && (
                                                <p className="text-[10px] text-orange-600 dark:text-orange-400 italic mt-1 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded inline-block border border-orange-200 dark:border-orange-800">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(item.totalPrice || (item.price * item.quantity))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary */}
                    <div className="space-y-2 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl transition-colors">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Pajak</span>
                            <span>{formatCurrency(order.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <span>Total</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                        {order.paymentMethod === 'cash' && (
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>Tunai: {formatCurrency(order.cashReceived)}</span>
                                <span>Kembali: {formatCurrency(order.changeGiven)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center transition-colors">
                    <button 
                        onClick={onClose}
                        className="w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;