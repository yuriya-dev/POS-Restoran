const supabase = require('../config/supabase');

// Helper untuk mendapatkan waktu awal hari ini (00:00:00) dalam format ISO string
const getStartOfDayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

// --- GET All Orders (Untuk Dashboard & Laporan) ---
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:orderitems!orderitems_orderId_fkey(*)') 
      .order('createdAt', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- CREATE Order (Checkout) ---
exports.create = async (req, res) => {
  try {
    const { items, table_id, ...orderData } = req.body;

    // 1. Cek Stok Dulu
    for (const item of items) {
      // Ambil data menu dari DB
      const { data: menu } = await supabase.from('menuitems').select('stock').eq('itemId', item.itemId).single();
      
      // Jika stok di DB lebih kecil dari jumlah yang dipesan -> ERROR
      if (menu && menu.stock < item.quantity) {
        return res.status(400).json({ message: `Stok ${item.name} tidak cukup! Sisa: ${menu.stock}` });
      }
    }

    // 2. Generate Daily Number
    const startOfToday = getStartOfDayISO();
    const { data: maxOrder } = await supabase
        .from('orders')
        .select('dailyNumber')
        .gte('createdAt', startOfToday) 
        .order('dailyNumber', { ascending: false })
        .limit(1)
        .single();
        
    const newDailyNumber = (maxOrder ? maxOrder.dailyNumber : 0) + 1;
    
    // 3. Insert Header
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...orderData, table_id, dailyNumber: newDailyNumber }])
      .select('orderId')
      .single();

    if (orderError) throw orderError;

    // 4. Insert Items & KURANGI STOK
    const orderItems = items.map(item => ({
      orderId: order.orderId,
      itemId: item.itemId,
      itemName: item.name,
      itemPrice: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase.from('orderitems').insert(orderItems);
    if (itemsError) throw itemsError;

    // 5. Update Stok Menu (Looping update)
    for (const item of items) {
       await supabase.rpc('decrement_stock', { x: item.quantity, row_id: item.itemId });
       // Note: Jika RPC belum dibuat, gunakan update biasa:
       // const { data: current } = await supabase.from('menuitems').select('stock').eq('itemId', item.itemId).single();
       // await supabase.from('menuitems').update({ stock: current.stock - item.quantity }).eq('itemId', item.itemId);
    }

    // 6. OTOMATISASI MEJA: Set status jadi 'occupied'
    if (table_id) {
        await supabase.from('dining_tables').update({ status: 'occupied' }).eq('table_id', table_id);
    }

    res.status(201).json({ 
      message: "Order created", 
      orderId: order.orderId, 
      dailyNumber: newDailyNumber 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- BATALKAN ORDER ---
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Ambil detail item untuk kembalikan stok
        const { data: items } = await supabase.from('orderitems').select('itemId, quantity').eq('orderId', id);

        // 2. Update Status Order
        const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('orderId', id);
        
        if (error) throw error;

        // 3. KEMBALIKAN STOK (Restock)
        if (items) {
            for (const item of items) {
                // Manual increment
                 const { data: current } = await supabase.from('menuitems').select('stock').eq('itemId', item.itemId).single();
                 await supabase.from('menuitems').update({ stock: current.stock + item.quantity }).eq('itemId', item.itemId);
            }
        }

        res.json({ message: "Order dibatalkan & Stok dikembalikan." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. GET Pesanan Dapur (Yang belum selesai / completedAt IS NULL)
exports.getKitchenOrders = async (req, res) => {
  try {
    // Ambil order hari ini yang statusnya tidak cancelled DAN belum selesai
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabase
      .from('orders')
      .select(`
        orderId, dailyNumber, orderName, createdAt, status, table_id,
        items:orderitems ( itemName, quantity, notes )
      `)
      .gte('createdAt', today)
      .neq('status', 'cancelled')
      .is('completedAt', null) // Filter: Hanya yang belum selesai
      .order('createdAt', { ascending: true }); // Yang lama di atas (FIFO)

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. MARK ORDER AS COMPLETED (Selesai Masak/Saji)
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .update({ completedAt: new Date().toISOString() })
      .eq('orderId', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};