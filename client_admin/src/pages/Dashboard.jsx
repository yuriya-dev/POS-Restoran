import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Clock, Calendar, AlertCircle, Utensils, BarChart3 } from 'lucide-react';
import { formatCurrency, getGreeting } from '../utils/helpers';
import SalesChart from '../components/reports/SalesChart';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ordersData } from '../api/data'; // Menggunakan data dummy langsung untuk contoh

const Dashboard = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulasi Data Dashboard
  const todayOrders = ordersData.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
  const totalSalesToday = todayOrders.reduce((acc, order) => acc + order.total_bayar, 0);
  const totalTransactions = todayOrders.length;
  const avgTransaction = totalTransactions > 0 ? totalSalesToday / totalTransactions : 0;
  
  // Simulasi Item Terlaris (Top 1)
  const topItem = { name: 'Nasi Goreng Spesial', qty: 12 };

  const formatTime = currentDateTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = currentDateTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Selamat Datang */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}, {user?.username}! 👋</h1>
        <p className="text-gray-500 mt-1">Selamat datang di Dashboard Admin POS Restoran.</p>
      </header>
      
      {/* Realtime Clock & Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-mono font-semibold text-gray-800">{formatTime}</span>
            <Calendar className="w-5 h-5 text-gray-500 ml-4" />
            <span className="text-md text-gray-600">{formatDate}</span>
        </div>
        <div className="flex space-x-3">
          <Button variant="primary" to="/menu" icon={<Utensils className="w-5 h-5" />}>
            Kelola Menu
          </Button>
          <Button variant="secondary" to="/reports" icon={<BarChart3 className="w-5 h-5" />}>
            Lihat Laporan
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Penjualan Hari Ini" value={formatCurrency(totalSalesToday)} icon={DollarSign} color="text-green-500" />
        <Card title="Jumlah Transaksi" value={totalTransactions} icon={ShoppingBag} color="text-blue-600" />
        <Card title="Rata-rata Transaksi" value={formatCurrency(avgTransaction)} icon={TrendingUp} color="text-indigo-500" />
        <Card title="Item Terlaris" value={topItem.name} subText={`${topItem.qty} Porsi`} icon={Utensils} color="text-yellow-600" />
      </div>

      {/* Chart Penjualan & Transaksi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Penjualan Mingguan */}
        <div className="lg:col-span-2">
          <Card title="Penjualan Mingguan" className="p-0">
            {/* SalesChart: Menggunakan data dummy atau di-mock */}
            <SalesChart />
          </Card>
        </div>
        
        {/* Transaksi Terbaru */}
        <Card title="Transaksi Terbaru (5)" className="space-y-3">
          {todayOrders.slice(0, 5).map((order) => (
            <div key={order.order_id} className="flex justify-between items-center py-2 border-b last:border-b-0 transition duration-150 hover:bg-gray-50 -mx-4 px-4">
              <div>
                <p className="font-semibold text-gray-800">#{order.order_id.substring(0, 8)}</p>
                <p className="text-xs text-gray-500">{new Date(order.waktu_pesan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} | Meja {order.meja_id}</p>
              </div>
              <p className={`font-bold ${order.total_bayar > 50000 ? 'text-green-600' : 'text-gray-800'}`}>
                {formatCurrency(order.total_bayar)}
              </p>
            </div>
          ))}
          {todayOrders.length === 0 && (
            <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                <AlertCircle className="w-6 h-6 mb-2" />
                <span>Belum ada transaksi hari ini.</span>
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;