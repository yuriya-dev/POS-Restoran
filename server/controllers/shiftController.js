const supabase = require('../config/supabase');

// Helper: Start of Day
const getStartOfDay = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
};

// 1. CEK STATUS SHIFT USER
exports.getCurrentShift = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const { data, error } = await supabase
            .from('shifts')
            .select('*')
            .eq('userId', userId)
            .eq('status', 'open')
            .single();

        // Jika tidak ada shift open, return null (bukan error 500)
        if (error && error.code !== 'PGRST116') throw error;
        
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. BUKA KASIR (START SHIFT)
exports.startShift = async (req, res) => {
    try {
        const { userId, startCash } = req.body;
        
        // Cek apakah user sudah punya shift aktif?
        const { data: active } = await supabase
            .from('shifts')
            .select('shiftId')
            .eq('userId', userId)
            .eq('status', 'open')
            .single();

        if (active) {
            return res.status(400).json({ message: "Anda masih memiliki shift aktif." });
        }

        const { data, error } = await supabase
            .from('shifts')
            .insert([{
                userId,
                startCash: startCash || 0,
                startTime: new Date().toISOString(),
                status: 'open'
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. RANGKUMAN SHIFT & DASHBOARD KASIR
exports.getShiftSummary = async (req, res) => {
    try {
        const { userId } = req.query; // Opsional: filter by user or global today
        const startOfDay = getStartOfDay();

        // A. Ambil Data Transaksi HARI INI (Global Store)
        const { data: orders, error } = await supabase
            .from('orders')
            .select('totalAmount, paymentMethod, createdAt, status')
            .gte('createdAt', startOfDay)
            .eq('status', 'paid'); // Hanya yang lunas

        if (error) throw error;

        // B. Hitung Metrik
        let totalSales = 0;
        let totalCash = 0;
        let totalNonCash = 0;
        let totalTransactions = orders.length;
        
        // Untuk Grafik (Per Jam)
        const hourlySales = {}; 

        orders.forEach(o => {
            const amount = Number(o.totalAmount);
            totalSales += amount;

            if (o.paymentMethod === 'cash') totalCash += amount;
            else totalNonCash += amount;

            // Grouping Jam untuk Grafik
            const hour = new Date(o.createdAt).getHours();
            const hourKey = `${hour}:00`;
            hourlySales[hourKey] = (hourlySales[hourKey] || 0) + amount;
        });

        // Format data grafik array
        const chartData = Object.keys(hourlySales).map(key => ({
            time: key,
            revenue: hourlySales[key]
        })).sort((a, b) => parseInt(a.time) - parseInt(b.time));

        // C. Ambil Item Terlaris Hari Ini
        // (Menggunakan logic mirip reportController tapi limit 5)
        const { data: items } = await supabase
            .from('orderitems')
            .select('itemName, quantity, totalPrice, orders!inner(createdAt)')
            .gte('orders.createdAt', startOfDay)
            .order('quantity', { ascending: false }) // Sort kasar dulu
            .limit(50); // Ambil sampel cukup banyak untuk di-aggregate di JS

        const itemMap = {};
        items?.forEach(i => {
            if(!itemMap[i.itemName]) itemMap[i.itemName] = 0;
            itemMap[i.itemName] += i.quantity;
        });
        
        const topItems = Object.entries(itemMap)
            .map(([name, qty]) => ({ name, qty }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);

        res.json({
            summary: {
                totalSales,
                totalCash,
                totalNonCash,
                totalTransactions
            },
            chartData,
            topItems
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. TUTUP KASIR (END SHIFT)
exports.endShift = async (req, res) => {
    try {
        const { shiftId, endCash } = req.body;

        const { data, error } = await supabase
            .from('shifts')
            .update({
                endCash,
                endTime: new Date().toISOString(),
                status: 'closed'
            })
            .eq('shiftId', shiftId)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};