import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import ManageMenu from './pages/ManageMenu';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/menu',
        element: <ManageMenu />
      },
      {
        path: '/orders',
        element: <div>Orders</div>
      },
      {
        path: '/users',
        element: <div>Users</div>
      },
      {
        path: '/settings',
        element: <div>Settings</div>
      }
    ]
  }
]);

export default router;