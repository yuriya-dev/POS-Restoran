const supabase = require('../config/supabase');

// GET All Orders (Untuk Dashboard & Laporan)
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false }); // Urutkan dari terbaru

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE Order (Untuk Transaksi Kasir)
exports.create = async (req, res) => {
  try {
    /* Body Request:
       {
         shiftId, kasirId, orderName, subtotal, taxAmount, totalAmount, 
         paymentMethod, cashReceived, changeGiven,
         items: [ { itemId, name, price, quantity, notes } ]
       }
    */
    const { items, ...orderData } = req.body;

    // 1. Insert Header Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select('orderId')
      .single();

    if (orderError) throw orderError;

    // 2. Siapkan Detail Items
    const orderItems = items.map(item => ({
      orderId: order.orderId,
      itemId: item.itemId,
      itemName: item.name,
      itemPrice: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
      notes: item.notes
    }));

    // 3. Insert Detail Items
    const { error: itemsError } = await supabase
      .from('orderitems')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json({ message: "Order created", orderId: order.orderId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};