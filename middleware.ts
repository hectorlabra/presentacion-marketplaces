import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Almacenamiento en memoria para rate limiting (en un entorno de producción usar Redis)
const loginAttempts: Record<string, { count: number, timestamp: number }> = {}

// Configuración de seguridad
const RATE_LIMIT_MAX_ATTEMPTS = 5 // Máximo número de intentos
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // Ventana de tiempo (15 minutos)
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60 // 12 horas
const PROTECTED_ROUTES = ['/admin', '/api/protected']

export async function middleware(req: NextRequest) {
  // Redireccionar la ruta principal a /admin
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Obtener la IP del cliente (usar X-Forwarded-For en producción con proxy)
  const clientIp = req.headers.get('x-forwarded-for') || 
                  req.headers.get('x-real-ip') || 
                  'unknown'
  
  // Verificar rate limiting para rutas de autenticación
  if (req.nextUrl.pathname.startsWith('/auth') && req.method === 'POST') {
    const now = Date.now()
    
    // Limpiar entradas antiguas
    Object.keys(loginAttempts).forEach(ip => {
      if (now - loginAttempts[ip].timestamp > RATE_LIMIT_WINDOW_MS) {
        delete loginAttempts[ip]
      }
    })
    
    // Verificar intentos de la IP actual
    if (!loginAttempts[clientIp]) {
      loginAttempts[clientIp] = { count: 0, timestamp: now }
    }
    
    loginAttempts[clientIp].count++
    
    // Si excede el límite, bloquear la solicitud
    if (loginAttempts[clientIp].count > RATE_LIMIT_MAX_ATTEMPTS) {
      return new NextResponse(JSON.stringify({ error: 'Too many login attempts' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(RATE_LIMIT_WINDOW_MS / 1000).toString()
        }
      })
    }
  }
  
  // Verificar y renovar la sesión
  const { data: { session } } = await supabase.auth.getSession()
  
  // Para rutas protegidas, realizar verificaciones adicionales
  if (session && PROTECTED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) {
    // Verificar tiempo de expiración de la sesión usando expires_at
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).getTime() : 0
    const now = Date.now()
    
    // Si la sesión está próxima a expirar (menos de 1 hora) o ya expiró
    if (expiresAt - now < 3600 * 1000 || expiresAt < now) {
      // Forzar cierre de sesión si ha expirado
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    
    // Almacenar IP en la sesión para futuras verificaciones
    // Esto requiere una tabla personalizada en Supabase para almacenar IPs de sesión
    // Por ahora, solo lo registramos en encabezados seguros
    res.headers.set('X-Session-IP', clientIp)
  }
  
  return res
}

// Aplicar este middleware solo a las rutas que lo necesitan
export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto las siguientes
    '/((?!_next/static|_next/image|favicon.ico|api/auth|auth/callback).*)',
  ],
}
