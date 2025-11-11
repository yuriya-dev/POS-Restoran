import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Cart from '../components/Cart';

export default function KasirLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        
        {/* Shopping Cart Sidebar */}
        <Cart />
      </div>
    </div>
  );
}