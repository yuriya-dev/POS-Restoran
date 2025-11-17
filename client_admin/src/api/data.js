import { simulateHash } from '../utils/helpers';

// --- DATA MASTER DUMMY ---

export const usersData = [
    { user_id: 'u001', username: 'admin', password_hash: simulateHash('admin123'), role: 'admin', created_at: new Date().toISOString() },
    { user_id: 'u002', username: 'kasir1', password_hash: simulateHash('kasir123'), role: 'kasir', created_at: new Date().toISOString() },
];

export const menuCategoriesData = [
    { kategori_id: 'c01', nama_kategori: 'Makanan Utama', sort_order: 1, icon: 'UtensilsCrossed', created_at: new Date().toISOString(), itemCount: 5 },
    { kategori_id: 'c02', nama_kategori: 'Minuman Segar', sort_order: 2, icon: 'Coffee', created_at: new Date().toISOString(), itemCount: 5 },
    { kategori_id: 'c03', nama_kategori: 'Dessert & Snack', sort_order: 3, icon: 'Cake', created_at: new Date().toISOString(), itemCount: 5 },
];

export const menuItemsData = [
    { item_id: 'm001', nama_item: 'Nasi Goreng Spesial', harga: 25000, kategori_id: 'c01', gambar_url: 'https://via.placeholder.com/150/0000FF/808080?text=Nasi', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm002', nama_item: 'Mie Ayam Bakso', harga: 20000, kategori_id: 'c01', gambar_url: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Mie', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm003', nama_item: 'Ayam Geprek Sambal Matah', harga: 28000, kategori_id: 'c01', gambar_url: 'https://via.placeholder.com/150/00FF00/000000?text=Ayam', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm004', nama_item: 'Ikan Bakar Sambal Dabu', harga: 45000, kategori_id: 'c01', gambar_url: 'https://via.placeholder.com/150/FFFF00/000000?text=Ikan', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm005', nama_item: 'Nasi Uduk Komplit', harga: 22000, kategori_id: 'c01', gambar_url: 'https://via.placeholder.com/150/00FFFF/000000?text=Uduk', is_active: false, created_at: new Date().toISOString() },
    
    { item_id: 'm006', nama_item: 'Es Teh Manis', harga: 8000, kategori_id: 'c02', gambar_url: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Teh', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm007', nama_item: 'Kopi Susu Gula Aren', harga: 18000, kategori_id: 'c02', gambar_url: 'https://via.placeholder.com/150/800000/FFFFFF?text=Kopi', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm008', nama_item: 'Jus Alpukat', harga: 20000, kategori_id: 'c02', gambar_url: 'https://via.placeholder.com/150/008000/FFFFFF?text=Jus', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm009', nama_item: 'Air Mineral', harga: 5000, kategori_id: 'c02', gambar_url: 'https://via.placeholder.com/150/000080/FFFFFF?text=Air', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm010', nama_item: 'Lemon Tea Dingin', harga: 12000, kategori_id: 'c02', gambar_url: 'https://via.placeholder.com/150/808000/FFFFFF?text=Lemon', is_active: true, created_at: new Date().toISOString() },
    
    { item_id: 'm011', nama_item: 'Choco Lava Cake', harga: 35000, kategori_id: 'c03', gambar_url: 'https://via.placeholder.com/150/800080/FFFFFF?text=Cake', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm012', nama_item: 'Kentang Goreng Keju', harga: 15000, kategori_id: 'c03', gambar_url: 'https://via.placeholder.com/150/008080/FFFFFF?text=Kentang', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm013', nama_item: 'Roti Bakar Coklat Keju', harga: 18000, kategori_id: 'c03', gambar_url: 'https://via.placeholder.com/150/C0C0C0/000000?text=Roti', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm014', nama_item: 'Puding Karamel', harga: 22000, kategori_id: 'c03', gambar_url: 'https://via.placeholder.com/150/800000/FFFFFF?text=Puding', is_active: true, created_at: new Date().toISOString() },
    { item_id: 'm015', nama_item: 'Waffle Ice Cream', harga: 30000, kategori_id: 'c03', gambar_url: 'https://via.placeholder.com/150/008000/FFFFFF?text=Waffle', is_active: true, created_at: new Date().toISOString() },
];

export const diningTablesData = [
    { meja_id: 't01', nama_meja: 'Meja 1', status: 'available', kapasitas: 4, type: 'dine_in' },
    { meja_id: 't02', nama_meja: 'Meja 2', status: 'occupied', kapasitas: 2, type: 'dine_in' },
    { meja_id: 't03', nama_meja: 'Meja 3', status: 'reserved', kapasitas: 6, type: 'dine_in' },
    // Tambahkan Meja Layanan (Service)
    { meja_id: 't_takeaway', nama_meja: 'Take Away', status: 'available', kapasitas: 0, type: 'service' },
    { meja_id: 't_ojol', nama_meja: 'Ojol/Online', status: 'occupied', kapasitas: 0, type: 'service' },
];

export const initialSettings = {
    nama_restoran: 'POS Restoran Modern',
    alamat: 'Jl. Jend. Sudirman No. 45, Jakarta',
    telepon: '021-987654321',
    pajak_persen: 10,
    service_persen: 5,
    info_struk: 'Terima kasih telah berkunjung. Silakan datang kembali!',
};

// --- DATA TRANSAKSI DUMMY ---

// Function to generate sample orders for the last 7 days
const generateSampleOrders = (numOrders) => {
    const orders = [];
    const methods = ['tunai', 'qris', 'debit'];

    for (let i = 1; i <= numOrders; i++) {
        const date = new Date();
        // Distribute orders randomly over the last 7 days
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        date.setHours(10 + Math.floor(Math.random() * 10)); // 10 AM to 8 PM
        date.setMinutes(Math.floor(Math.random() * 60));

        const subtotal = Math.floor(Math.random() * (250000 - 50000 + 1) + 50000); // 50k to 250k
        const pajak = subtotal * (initialSettings.pajak_persen / 100);
        const service = subtotal * (initialSettings.service_persen / 100);
        const total = subtotal + pajak + service;

        const order = {
            order_id: `O-${String(i).padStart(4, '0')}`,
            shift_id: 's001',
            meja_id: diningTablesData[Math.floor(Math.random() * diningTablesData.length)].meja_id,
            waktu_pesan: date.toISOString(),
            subtotal: subtotal,
            pajak: Math.round(pajak),
            service: Math.round(service),
            total_bayar: Math.round(total),
            metode_bayar: methods[Math.floor(Math.random() * methods.length)],
            status: 'completed',
            created_at: date.toISOString(),
        };
        orders.push(order);
    }
    return orders;
};

export const ordersData = generateSampleOrders(40);

// --- INISIALISASI DATABASE LOKAL ---

export const initialDbState = {
    users: usersData,
    menu_items: menuItemsData,
    menu_categories: menuCategoriesData,
    dining_tables: diningTablesData,
    orders: ordersData,
    shifts: [{ shift_id: 's001', user_id: 'u002', modal_awal: 1000000, total_tunai: 0, total_non_tunai: 0, waktu_mulai: new Date().toISOString(), waktu_selesai: null }],
    settings: initialSettings,
};