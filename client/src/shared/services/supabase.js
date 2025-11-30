import { createClient } from '@supabase/supabase-js';

// Pastikan variabel ini ada di .env file client Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL atau Anon Key tidak ditemukan. Cek file .env Anda.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);