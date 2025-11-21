// server/src/config/supabase.js
require('dotenv').config(); // <--- WAJIB ADA DI BARIS 1

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("❌ Config Error: URL atau Key Supabase tidak ditemukan di .env");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;