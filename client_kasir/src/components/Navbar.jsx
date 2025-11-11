import { useState } from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [cashierName] = useState('John Doe');

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">POS Kasir</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
              <FaShoppingCart className="mr-2" />
              <span>0 Items</span>
            </button>

            <div className="flex items-center space-x-2 text-white">
              <FaUser />
              <span>{cashierName}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}