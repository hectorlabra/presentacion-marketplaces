import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nhzmsnrfapwziagjjewo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oem1zbnJmYXB3emlhZ2pqZXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njk3OTYsImV4cCI6MjA1ODE0NTc5Nn0.zcpFrIwozoUmzdefSUBLU0_VBFWmkjoHV3pax8sKPYo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

