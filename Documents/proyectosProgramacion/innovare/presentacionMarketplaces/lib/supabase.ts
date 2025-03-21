import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Usar solo variables de entorno, sin valores por defecto para mayor seguridad
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cliente para componentes del lado del cliente
export const supabase = typeof window !== 'undefined'
  ? createClientComponentClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    })
  : createClient(supabaseUrl, supabaseAnonKey)

