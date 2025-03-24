import { createClient } from "@supabase/supabase-js"

// Asegúrate de que estas variables estén definidas en tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Obtener la URL del sitio desde las variables de entorno
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Configuración del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
  },
  // Configuración global de redirección para autenticación
  global: {
    headers: {
      'x-application-name': 'presentacion-marketplaces',
    },
  }
})
