import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These credentials are now set to your specific Supabase project.
const supabaseUrl = 'https://vhaoirjxhasrohcdbgjg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYW9pcmp4aGFzcm9oY2RiZ2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTcxOTIsImV4cCI6MjA3MjEzMzE5Mn0.3F_KEJnopd0KPgupc88DP6yI8seMo71LOpof1sELjAE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials are not set. Please check services/supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
