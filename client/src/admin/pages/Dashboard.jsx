import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Clock, Calendar, AlertCircle, Utensils, BarChart3, Loader2 } from 'lucide-react';
import { formatCurrency, getGreeting } from '../../shared/utils/helpers';
import SalesChart from '../components/reports/SalesChart';
import Card from '../../shared/components/common/Card';
import Button from '../../shared/components/common/Button';
import { useAuth } from '../../shared/context/AuthContext';
import { api } from '../../shared/services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // State Data
  const [orders, setOrders] = useState([]);
  const [topSellingToday, setTopSellingToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Effect Jam Realtime
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Effect Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await api.getOrders();
        setOrders(ordersRes.data || []);

        const startToday = new Date();
        startToday.setHours(0, 0, 0, 0);
        
        const endToday = new Date();
        endToday.setHours(23, 59, 59, 999);

        const topItemRes = await api.getTopSellingItems(startToday.toISOString(), endToday.toISOString());
        
        if (topItemRes.data?.data?.length > 0) {
            const best = topItemRes.data.data[0];
            setTopSellingToday({ name: best.name, qty: best.totalQty });
        } else {
            setTopSellingToday(null);
        }

      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
        setError("Gagal memuat data transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. Perhitungan Statistik
  const dashboardStats = useMemo(() => {
    const today = new Date().toDateString();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const weeklyOrders = orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    
    const totalSalesToday = todayOrders.reduce((acc, order) => acc + Number(order.totalAmount || 0), 0);
    const totalTransactions = todayOrders.length;
    const avgTransaction = totalTransactions > 0 ? totalSalesToday / totalTransactions : 0;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const topItem = topSellingToday || { name: 'Belum ada data', qty: 0 };

    return { todayOrders, weeklyOrders, totalSalesToday, totalTransactions, avgTransaction, recentOrders, topItem };
  }, [orders, topSellingToday]);

  const formatTime = currentDateTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = currentDateTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
        <div className="h-screen flex justify-center items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 transition-colors">
            <Loader2 className="w-8 h-8 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
            Memuat Dashboard...
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header Selamat Datang */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.fullName || user?.username}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Selamat datang di Dashboard Admin POS Restoran.</p>
      </header>
      
      {/* Realtime Clock & Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-mono font-semibold text-gray-800 dark:text-gray-100">{formatTime}</span>
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-4" />
            <span className="text-md text-gray-600 dark:text-gray-300">{formatDate}</span>
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
        <Card 
          title="Penjualan Hari Ini" 
          value={formatCurrency(dashboardStats.totalSalesToday)} 
          icon={DollarSign} 
          color="text-green-600 dark:text-green-400" 
          className="dark:bg-gray-800 dark:border-gray-700"
        />
        <Card 
          title="Transaksi Hari Ini" 
          value={dashboardStats.totalTransactions} 
          icon={ShoppingBag} 
          color="text-blue-600 dark:text-blue-400" 
          className="dark:bg-gray-800 dark:border-gray-700"
        />
        <Card 
          title="Rata-rata Order" 
          value={formatCurrency(dashboardStats.avgTransaction)} 
          icon={TrendingUp} 
          color="text-indigo-500 dark:text-indigo-400" 
          className="dark:bg-gray-800 dark:border-gray-700"
        />
        <Card 
          title="Terlaris Hari Ini" 
          value={dashboardStats.topItem.name} 
          subText={`${dashboardStats.topItem.qty} Porsi terjual`} 
          icon={Utensils} 
          color="text-yellow-600 dark:text-yellow-400" 
          className="dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Chart Penjualan & Transaksi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Penjualan Mingguan */}
        <div className="lg:col-span-2">
          <Card title="Tren Penjualan (7 Hari Terakhir)" className="p-0 h-full dark:bg-gray-800 dark:border-gray-700">
            <div className="h-80 p-4">
                <SalesChart orders={dashboardStats.weeklyOrders} period="7days" /> 
            </div>
          </Card>
        </div>
        
        {/* Transaksi Terbaru */}
        <Card title="Transaksi Terbaru (5)" className="space-y-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dashboardStats.recentOrders.map((order) => (
                <div key={order.orderId} className="flex justify-between items-center py-3 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 rounded-lg">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            #{order.dailyNumber || order.orderId}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} 
                            <span className="mx-1 text-gray-300 dark:text-gray-600">•</span> 
                            {order.orderName || 'Dine In'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-sm ${Number(order.totalAmount) > 50000 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                            {formatCurrency(Number(order.totalAmount))}
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${
                            order.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            ))}
          </div>
          
          {dashboardStats.recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <AlertCircle className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" />
                <span>Belum ada transaksi.</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;