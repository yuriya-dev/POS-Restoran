import React from 'react';
import { formatCurrency } from '../utils/helpers';
import { useSettings } from '../context/SettingsContext';

export const Receipt = React.forwardRef(({ data }, ref) => {
    const { settings } = useSettings();

    if (!data) return null;

    // ✅ PERBAIKAN: Destructure variable dengan nama yang benar (sesuai DB)
    // Kita tambahkan fallback: totalAmount (dari DB) ATAU total (dari kalkulasi lokal)
    const { 
        orderId, 
        dailyNumber, 
        items, 
        subtotal, 
        
        // Handle variasi nama field (DB vs Local State)
        taxAmount, tax, 
        totalAmount, total, 
        
        paymentMethod, 
        cashReceived, 
        changeGiven, 
        cashier, 
        date, 
        serviceCharge, 
        packagingFee 
    } = data;

    // ✅ Logika Fallback: Pilih nilai yang tersedia
    const finalTotal = totalAmount !== undefined ? totalAmount : (total || 0);
    const finalTax = taxAmount !== undefined ? taxAmount : (tax || 0);
    
    return (
        <div ref={ref} className="p-4 bg-white text-black" style={{ width: '80mm', fontFamily: 'monospace', fontSize: '12px' }}>
            
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
                <p className="text-center text-[10px] mb-2 border-b border-black border-dashed pb-1">
                    {settings.receiptHeader}
                </p>
            )}

            <div className="border-b border-black border-dashed my-2"></div>

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

            <div className="border-b border-black border-dashed my-2"></div>

            {/* Item List */}
            <div className="space-y-1">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="font-bold">{item.name || item.itemName}</div> {/* Fallback itemName jika dari DB */}
                        <div className="flex justify-between">
                            <span>{item.quantity} x {formatCurrency(item.price || item.itemPrice)}</span>
                            <span>{formatCurrency((item.price || item.itemPrice) * item.quantity)}</span>
                        </div>
                        {item.notes && <div className="text-[10px] italic">({item.notes})</div>}
                    </div>
                ))}
            </div>

            <div className="border-b border-black border-dashed my-2"></div>

            {/* Totals Dinamis */}
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
                    <span>{formatCurrency(finalTax)}</span> {/* Gunakan finalTax */}
                </div>
                
                <div className="flex justify-between font-bold text-sm mt-1 border-t border-black border-dashed pt-1">
                    <span>TOTAL</span>
                    <span>{formatCurrency(finalTotal)}</span> {/* Gunakan finalTotal */}
                </div>
            </div>

            <div className="border-b border-black border-dashed my-2"></div>

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