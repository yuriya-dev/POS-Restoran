import React, { useEffect } from 'react';
import { X, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '../../utils/helpers'; // Pastikan path ini benar relatif terhadap file ini

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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 w-screen h-screen"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                            Detail Order
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            #{order.dailyNumber || order.orderId} • {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: id })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Info Status */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Pelanggan</span>
                            <p className="font-semibold text-gray-800 text-sm truncate">{order.orderName || '-'}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Pembayaran</span>
                            <p className="font-semibold text-gray-800 text-sm capitalize">{order.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Tabel Item */}
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">Item Pesanan ({items.length})</h4>
                    
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed text-sm">
                            Tidak ada data item.
                        </div>
                    ) : (
                        <div className="space-y-3 mb-6">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-gray-100 text-gray-700 font-bold w-6 h-6 flex items-center justify-center rounded text-xs mt-0.5">
                                            {item.quantity}x
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 leading-tight">{item.itemName || item.name}</p>
                                            {item.notes && (
                                                <p className="text-[10px] text-orange-600 italic mt-1 bg-orange-50 px-1.5 py-0.5 rounded inline-block">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(item.totalPrice || (item.price * item.quantity))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary */}
                    <div className="space-y-2 pt-4 border-t border-dashed border-gray-300 bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Pajak</span>
                            <span>{formatCurrency(order.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                        {order.paymentMethod === 'cash' && (
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Tunai: {formatCurrency(order.cashReceived)}</span>
                                <span>Kembali: {formatCurrency(order.changeGiven)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button 
                        onClick={onClose}
                        className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;