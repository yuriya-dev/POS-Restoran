import { FiLayout, FiList, FiClipboard, FiUsers, FiDollarSign, FiEdit, FiCoffee, FiSettings } from 'react-icons/fi';

const menuItems = [
    // Ganti string emoji dengan komponen ikon yang diimpor
    { icon: FiLayout, label: 'Dashboard', path: '/' },
    { icon: FiList, label: 'Menu Items', path: '/menu' },
    { icon: FiClipboard, label: 'Orders', path: '/orders' },
    { icon: FiUsers, label: 'Users', path: '/users' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
];

const data = [
  { name: 'Senin', sales: 4000000 },
  { name: 'Selasa', sales: 3000000 },
  { name: 'Rabu', sales: 2000000 },
  { name: 'Kamis', sales: 2780000 },
  { name: 'Jumat', sales: 1890000 },
  { name: 'Sabtu', sales: 2390000 },
  { name: 'Minggu', sales: 3490000 },
];

const cards = [
  { title: 'Total Penjualan', value: 'Rp 120.456.789', icon: FiDollarSign },
  { title: 'Order Hari Ini', value: '45', icon: FiEdit },
  { title: 'Menu Aktif', value: '24', icon: FiCoffee },
  { title: 'Pelanggan', value: '120', icon: FiUsers },
];

export { data, cards, menuItems };