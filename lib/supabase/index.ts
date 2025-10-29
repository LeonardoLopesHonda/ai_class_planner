import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL}.supabase.co`;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || ""; // Use a Service Role Key

export const supabase = createClient(supabaseUrl, supabaseKey);
