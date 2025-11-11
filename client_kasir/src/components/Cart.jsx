import { useState } from 'react';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

export default function Cart() {
  const [items, setItems] = useState([]);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (index, delta) => {
    const newItems = [...items];
    newItems[index].quantity += delta;
    if (newItems[index].quantity <= 0) {
      newItems.splice(index, 1);
    }
    setItems(newItems);
  };

  return (
    <div className="w-96 bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Keranjang</h2>

      {/* Cart Items */}
      <div className="mb-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Keranjang kosong</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Rp {item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <FaMinus size={12} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <FaPlus size={12} />
                </button>
                <button
                  onClick={() => {
                    const newItems = [...items];
                    newItems.splice(index, 1);
                    setItems(newItems);
                  }}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total and Checkout */}
      <div className="border-t pt-4">
        <div className="mb-4 flex justify-between">
          <span className="font-bold">Total:</span>
          <span className="font-bold">Rp {total.toLocaleString()}</span>
        </div>
        <button
          disabled={items.length === 0}
          className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-300"
        >
          Bayar
        </button>
      </div>
    </div>
  );
}