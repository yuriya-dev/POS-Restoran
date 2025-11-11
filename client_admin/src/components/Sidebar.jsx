import { Link } from 'react-router-dom';
import { menuItems } from '../utils/index';

export default function Sidebar() {

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => {
            const IconComponent = item.icon; 
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <span className="mr-3 text-xl"> 
                    <IconComponent /> 
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}