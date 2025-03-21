import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Renovar la sesión si existe
  await supabase.auth.getSession()
  
  return res
}

// Aplicar este middleware solo a las rutas que lo necesitan
export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto las siguientes
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}
