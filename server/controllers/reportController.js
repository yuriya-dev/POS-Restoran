const supabase = require('../config/supabase');

exports.getTopSellingItems = async (req, res) => {
  try {
    // Ambil filter tanggal dari query params (opsional)
    // format: ?startDate=2023-01-01&endDate=2023-12-31
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('orderitems')
      .select('itemName, quantity, totalPrice, orders!inner(createdAt)'); 
      // !inner berarti join wajib (hanya item yang punya order valid)

    if (startDate && endDate) {
      // Filter berdasarkan tanggal order induk
      query = query
        .gte('orders.createdAt', startDate)
        .lte('orders.createdAt', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // --- PROSES AGREGASI DI SERVER (Node.js) ---
    // Supabase JS Client belum support 'GROUP BY' native dengan mudah untuk select complex,
    // jadi kita hitung manual di backend (ini masih cepat untuk ribuan data).
    
    const itemMap = {};
    let grandTotalRevenue = 0;

    data.forEach(item => {
      const name = item.itemName;
      if (!itemMap[name]) {
        itemMap[name] = {
          name: name,
          qty: 0,
          revenue: 0
        };
      }
      const qty = Number(item.quantity);
      const price = Number(item.totalPrice); // totalPrice di table orderitems = qty * harga
      
      itemMap[name].qty += qty;
      itemMap[name].revenue += price;
      grandTotalRevenue += price;
    });

    // Convert ke array, sort, dan hitung persentase
    const sortedItems = Object.values(itemMap)
      .sort((a, b) => b.qty - a.qty) // Sort dari qty terbanyak
      .slice(0, 10) // Ambil Top 10
      .map(item => ({
        ...item,
        percentage: grandTotalRevenue > 0 ? (item.revenue / grandTotalRevenue) * 100 : 0
      }));

    res.json(sortedItems);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};