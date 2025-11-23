const supabase = require('../config/supabase');

const getStartOfDayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

// --- GET All Orders ---
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
      const { data: menu } = await supabase.from('menuitems').select('stock').eq('itemId', item.itemId).single();
      
      const currentStock = Number(menu?.stock || 0);
      const qtyNeeded = Number(item.quantity);

      // Jika stok kurang
      if (menu && currentStock < qtyNeeded) {
        return res.status(400).json({ message: `Stok habis! Sisa: ${currentStock}` });
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
    
    // 3. Insert Header Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...orderData, table_id, dailyNumber: newDailyNumber }])
      .select('orderId')
      .single();

    if (orderError) throw orderError;

    // 4. Insert Items
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

    // ✅ 5. UPDATE STOK MENU (PERBAIKAN: MENGGUNAKAN LOGIKA MANUAL)
    // Kita tidak pakai RPC agar lebih stabil tanpa setup SQL tambahan
    for (const item of items) {
       // A. Ambil stok saat ini
       const { data: current } = await supabase
          .from('menuitems')
          .select('stock')
          .eq('itemId', item.itemId)
          .single();
       
       if (current) {
           const oldStock = Number(current.stock);
           const qty = Number(item.quantity);
           const newStock = oldStock - qty;

           // B. Update dengan stok baru
           await supabase
              .from('menuitems')
              .update({ stock: newStock })
              .eq('itemId', item.itemId);
       }
    }

    // 6. Otomatisasi Meja
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

// --- CANCEL ORDER (Kembalikan Stok) ---
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: items } = await supabase.from('orderitems').select('itemId, quantity').eq('orderId', id);

        const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('orderId', id);
        
        if (error) throw error;

        // ✅ KEMBALIKAN STOK MANUAL
        if (items) {
            for (const item of items) {
                const { data: current } = await supabase.from('menuitems').select('stock').eq('itemId', item.itemId).single();
                
                if (current) {
                    const newStock = Number(current.stock) + Number(item.quantity);
                    await supabase
                        .from('menuitems')
                        .update({ stock: newStock })
                        .eq('itemId', item.itemId);
                }
            }
        }

        res.json({ message: "Order dibatalkan & Stok dikembalikan." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ... getKitchenOrders & completeOrder tetap sama (tidak perlu diubah) ...
exports.getKitchenOrders = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('orders')
      .select(`
        orderId, dailyNumber, orderName, createdAt, status, table_id,
        items:orderitems!orderitems_orderId_fkey ( itemName, quantity, notes )
      `)
      .gte('createdAt', today)
      .neq('status', 'cancelled')
      .is('completedAt', null)
      .order('createdAt', { ascending: true });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .update({ completedAt: new Date().toISOString() })
      .eq('orderId', id)
      .select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};