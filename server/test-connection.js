require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("--- TEST KONEKSI SUPABASE ---");
console.log("URL:", url);
// Kita print 10 huruf pertama key untuk memastikan bukan kosong/salah copy
console.log("Key Check:", key ? key.substring(0, 15) + "..." : "KOSONG/UNDEFINED");

const supabase = createClient(url, key);

async function test() {
  // Coba ambil data dari salah satu tabel Anda (misal: settings atau users)
  const { data, error } = await supabase.from('settings').select('*');

  if (error) {
    console.error("\n❌ GAGAL KONEK KE DB:");
    console.error(error);
    console.log("\nKESIMPULAN: Kunci API Salah atau Tabel diblokir RLS.");
  } else {
    console.log("\n✅ BERHASIL KONEK!");
    console.log("Data:", data);
  }
}

test();