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
      .select('*, dailyNumber, orderId') 
      .order('createdAt', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- CREATE Order (Untuk Transaksi Kasir) ---
exports.create = async (req, res) => {
  try {
    const { items, ...orderData } = req.body;

    // --- 1. LOGIC PENENTUAN NOMOR URUT HARIAN ---
    const startOfToday = getStartOfDayISO();

    // A. Cari nomor urut transaksi tertinggi yang dibuat HARI INI
    const { data: maxOrder, error: maxOrderError } = await supabase
        .from('orders')
        .select('dailyNumber')
        .gte('createdAt', startOfToday) // Filter: Hanya order yang dibuat hari ini
        .order('dailyNumber', { ascending: false })
        .limit(1)
        .single();
        
    // Tangani error (abaikan jika tidak ada baris yang ditemukan: PGRST116)
    if (maxOrderError && maxOrderError.code !== 'PGRST116') {
        throw maxOrderError;
    }
        
    // B. Hitung nomor urut baru (Jika maxOrder null, mulai dari 1)
    const newDailyNumber = (maxOrder ? maxOrder.dailyNumber : 0) + 1;
    
    // C. Masukkan dailyNumber ke payload order
    orderData.dailyNumber = newDailyNumber; 

    // --- 2. Insert Header Order ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select('orderId')
      .single();

    if (orderError) throw orderError;

    // --- 3. Siapkan & Insert Detail Items ---
    const orderItems = items.map(item => ({
      orderId: order.orderId,
      itemId: item.itemId,
      itemName: item.name,
      itemPrice: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase
      .from('orderitems')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // MODIFIKASI: Kembalikan orderId dan dailyNumber yang baru
    res.status(201).json({ 
      message: "Order created", 
      orderId: order.orderId, 
      dailyNumber: newDailyNumber 
    });

  } catch (err) {
    console.error("CREATE ORDER FAILED:", err);
    res.status(500).json({ error: err.message });
  }
};