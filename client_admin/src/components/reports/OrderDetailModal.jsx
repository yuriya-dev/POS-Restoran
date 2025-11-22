import { ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '../../utils/helpers';
import { useEffect } from 'react';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  // Tutup modal dengan ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // klik di luar modal
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} // mencegah close saat klik di modal
      >
        {/* CLOSE BUTTON */}
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
          Detail Transaksi
        </h2>

        <div className="space-y-2 text-sm">
          <p><strong>No Order:</strong> #{order.dailyNumber || order.orderId}</p>
          <p><strong>Waktu:</strong> {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}</p>
          <p>
            <strong>Status:</strong>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs capitalize ${
              order.status === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'active'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {order.status || '-'}
            </span>
          </p>
          <p><strong>Metode Pembayaran:</strong> {order.paymentMethod || '-'}</p>
        </div>

        <hr className="my-4" />

        {/* ITEMS */}
        <h3 className="font-semibold mb-2">Item Pesanan</h3>
        <div className="max-h-40 overflow-auto border rounded p-2">
          {order.items?.length ? order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm py-1 border-b last:border-none">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          )) : (
            <p className="text-gray-500 text-center text-sm">Tidak ada item</p>
          )}
        </div>

        <hr className="my-4" />

        {/* TOTAL */}
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Subtotal:</span> 
            <span>{formatCurrency(order.subtotal || order.totalAmount)}</span>
          </p>
          {order.tax && <p className="flex justify-between"><span>Pajak:</span> <span>{formatCurrency(order.tax)}</span></p>}
          <p className="flex justify-between font-semibold text-lg">
            <span>Total:</span> 
            <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
