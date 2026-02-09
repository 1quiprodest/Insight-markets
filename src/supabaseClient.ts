import { createClient } from '@supabase/supabase-js'

// Эти данные возьми в Supabase: Settings -> API
const supabaseUrl = 'https://xjvppfrrpcqmfqojtkcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdnBwZnJycGNxbWZxb2p0a2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTM4MTUsImV4cCI6MjA4NjIyOTgxNX0.fqbVbPR573QM8lds9MtRxe7-kQBsSI2W9y5Swhy6YQ0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)