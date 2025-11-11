import { createBrowserRouter } from 'react-router-dom';
import KasirLayout from './components/KasirLayout';
import MenuPage from './pages/MenuPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <KasirLayout />,
    children: [
      {
        path: '/',
        element: <MenuPage />
      },
      // Tambahkan route lain di sini
      {
        path: '/history',
        element: <div>Order History</div>
      }
    ]
  }
]);

export default router;