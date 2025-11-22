const supabase = require('../config/supabase');

exports.getTopSellingItems = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Logic query Anda ...
    let query = supabase
      .from('orderitems')
      .select(`
        itemName,
        quantity,
        totalPrice,
        orders!inner (
          createdAt
        )
      `);

    if (startDate && endDate) {
      query = query
        .gte('orders.createdAt', startDate)
        .lte('orders.createdAt', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Logic Agregasi Anda ...
    const itemMap = {};
    let grandTotal = 0;

    data.forEach(row => {
      const name = row.itemName;
      const qty = Number(row.quantity);
      const total = Number(row.totalPrice);

      if (!itemMap[name]) {
        itemMap[name] = { name, totalQty: 0, totalRevenue: 0 };
      }

      itemMap[name].totalQty += qty;
      itemMap[name].totalRevenue += total;
      grandTotal += total;
    });

    const result = Object.values(itemMap)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 10)
      .map(item => ({
        ...item,
        percentage: grandTotal > 0 ? (item.totalRevenue / grandTotal) * 100 : 0
      }));

    res.json({ success: true, data: result });

  } catch (err) {
    console.error("Report Error:", err); // Tambahkan log console agar mudah debug
    res.status(500).json({ error: err.message });
  }
};