import { createClient } from '@supabase/supabase-js'

// ИСПОЛЬЗУЙ import.meta.env, А НЕ process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ОШИБКА: Переменные окружения не найдены!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)