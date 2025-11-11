import { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';

const categories = [
  'Semua',
  'Makanan Utama',
  'Minuman',
  'Cemilan',
  'Dessert'
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch menu items from API
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menu/items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = activeCategory === 'Semua'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="mb-6 flex space-x-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              onAddToCart={(item) => {
                // Handle add to cart
                console.log('Adding to cart:', item);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}