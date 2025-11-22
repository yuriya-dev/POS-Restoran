import React from 'react';
import { formatCurrency } from '../utils/helpers';

// Komponen ini hanya untuk tampilan cetak, menggunakan forwardRef
export const Receipt = React.forwardRef(({ data }, ref) => {
    if (!data) return null;

    const { orderId, dailyNumber, items, subtotal, tax, total, paymentMethod, cashReceived, changeGiven, cashier, date } = data;

    return (
        <div ref={ref} className="p-4 bg-white text-black" style={{ width: '80mm', fontFamily: 'monospace', fontSize: '12px' }}>
            {/* Header Struk */}
            <div className="text-center mb-2">
                <h2 className="font-bold text-lg uppercase">Restoran Kita</h2>
                <p className="text-[10px]">Jl. Contoh No. 123, Jakarta</p>
                <p className="text-[10px]">Telp: 021-555-1234</p>
            </div>

            <div className="border-b border-black border-dashed my-2"></div>

            {/* Info Transaksi */}
            <div className="mb-2">
                <div className="flex justify-between">
                    <span>Tgl: {new Date(date).toLocaleDateString()}</span>
                    <span>Jam: {new Date(date).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>No: #{dailyNumber || orderId}</span>
                    <span>Kasir: {cashier}</span>
                </div>
            </div>

            <div className="border-b border-black border-dashed my-2"></div>

            {/* Item List */}
            <div className="space-y-1">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="font-bold">{item.name}</div>
                        <div className="flex justify-between">
                            <span>{item.quantity} x {formatCurrency(item.price)}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                        {item.notes && <div className="text-[10px] italic">({item.notes})</div>}
                    </div>
                ))}
            </div>

            <div className="border-b border-black border-dashed my-2"></div>

            {/* Totals */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Pajak (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm mt-1">
                    <span>TOTAL</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            <div className="border-b border-black border-dashed my-2"></div>

            {/* Payment Info */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="uppercase">{paymentMethod}</span>
                    <span>{formatCurrency(cashReceived || total)}</span>
                </div>
                {paymentMethod === 'cash' && (
                    <div className="flex justify-between">
                        <span>Kembali</span>
                        <span>{formatCurrency(changeGiven || 0)}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 text-center text-[10px]">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>WiFi: Resto_Tamu / Pass: 123456</p>
            </div>
        </div>
    );
});