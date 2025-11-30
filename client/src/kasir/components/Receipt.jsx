import React from 'react';
import { formatCurrency } from '../../shared/utils/helpers';
import { useSettings } from '../../shared/context/SettingsContext';

export const Receipt = React.forwardRef(({ data }, ref) => {
    const { settings } = useSettings();

    if (!data) return null;

    const { 
        orderId, dailyNumber, items, subtotal, 
        taxAmount, tax, 
        totalAmount, total, 
        paymentMethod, cashReceived, changeGiven, cashier, date, 
        serviceCharge, packagingFee 
    } = data;

    const finalTotal = totalAmount !== undefined ? totalAmount : (total || 0);
    const finalTax = taxAmount !== undefined ? taxAmount : (tax || 0);
    
    // ✅ STYLE MANUAL (Aman untuk html2canvas/PDF)
    // Menghindari penggunaan class Tailwind seperti 'bg-white' 'text-black' yang mungkin menggunakan oklch
    const containerStyle = {
        width: '80mm',
        fontFamily: 'monospace',
        fontSize: '12px',
        backgroundColor: '#ffffff', // Hex putih murni
        color: '#000000',           // Hex hitam murni
        padding: '16px'
    };

    const borderStyle = {
        borderBottom: '1px dashed #000000',
        marginTop: '8px',
        marginBottom: '8px'
    };

    return (
        <div ref={ref} style={containerStyle}>
            
            {/* Header Struk */}
            <div className="text-center mb-2">
                {settings?.logoUrl && (
                    <img src={settings.logoUrl} alt="Logo" className="w-12 h-12 mx-auto mb-2 grayscale opacity-80" />
                )}
                <h2 className="font-bold text-lg uppercase">{settings?.restaurantName || 'Restoran'}</h2>
                <p className="text-[10px] whitespace-pre-line">{settings?.address}</p>
                <p className="text-[10px]">{settings?.phone}</p>
            </div>

            {settings?.receiptHeader && (
                <p className="text-center text-[10px] mb-2 pb-1" style={{ borderBottom: '1px dashed #000000' }}>
                    {settings.receiptHeader}
                </p>
            )}

            <div style={borderStyle}></div>

            {/* Info Transaksi */}
            <div className="mb-2">
                <div className="flex justify-between">
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <span>{new Date(date).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>No: #{dailyNumber || orderId}</span>
                    <span>Kasir: {cashier}</span>
                </div>
            </div>

            <div style={borderStyle}></div>

            {/* Item List */}
            <div className="space-y-1">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="font-bold">{item.name || item.itemName}</div>
                        <div className="flex justify-between">
                            <span>{item.quantity} x {formatCurrency(item.price || item.itemPrice)}</span>
                            <span>{formatCurrency((item.price || item.itemPrice) * item.quantity)}</span>
                        </div>
                        {item.notes && <div className="text-[10px] italic">({item.notes})</div>}
                    </div>
                ))}
            </div>

            <div style={borderStyle}></div>

            {/* Totals */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {serviceCharge > 0 && (
                    <div className="flex justify-between">
                        <span>Service ({(settings?.serviceCharge * 100).toFixed(0)}%)</span>
                        <span>{formatCurrency(serviceCharge)}</span>
                    </div>
                )}
                
                {packagingFee > 0 && (
                    <div className="flex justify-between">
                        <span>Kemasan</span>
                        <span>{formatCurrency(packagingFee)}</span>
                    </div>
                )}

                <div className="flex justify-between">
                    <span>Pajak ({(settings?.taxRate * 100).toFixed(0)}%)</span>
                    <span>{formatCurrency(finalTax)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-sm mt-1 pt-1" style={{ borderTop: '1px dashed #000000' }}>
                    <span>TOTAL</span>
                    <span>{formatCurrency(finalTotal)}</span>
                </div>
            </div>

            <div style={borderStyle}></div>

            {/* Payment Info */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="uppercase">{paymentMethod}</span>
                    <span>{formatCurrency(cashReceived || finalTotal)}</span>
                </div>
                {paymentMethod === 'cash' && (
                    <div className="flex justify-between">
                        <span>Kembali</span>
                        <span>{formatCurrency(changeGiven || 0)}</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-[10px]">
                <p className="whitespace-pre-line">{settings?.receiptFooter}</p>
                {settings?.wifiInfo && <p className="mt-2 font-bold">WiFi: {settings.wifiInfo}</p>}
                {settings?.socialMedia && <p>{settings.socialMedia}</p>}
            </div>
        </div>
    );
});