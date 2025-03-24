import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectAutomatedAttack, generateBlockResponse, isSuspiciousPath } from './lib/security-utils'

// Almacenamiento en memoria para rate limiting (en un entorno de producción usar Redis)
const loginAttempts: Record<string, { count: number, timestamp: number }> = {}
const requestCounts: Record<string, { count: number, timestamp: number, blockedUntil?: number }> = {}

// Configuración de seguridad
const RATE_LIMIT_MAX_ATTEMPTS = 5 // Máximo número de intentos de login
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // Ventana de tiempo para login (15 minutos)
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60 // 12 horas
const PROTECTED_ROUTES = ['/admin', '/api/protected']

// Rutas públicas de autenticación
const AUTH_ROUTES = ['/login', '/auth/callback']

// Configuración de rate limiting general
const GLOBAL_RATE_LIMIT = {
  MAX_REQUESTS: 100, // Máximo número de solicitudes
  WINDOW_MS: 60 * 1000, // Ventana de tiempo (1 minuto)
  BLOCK_DURATION_MS: 5 * 60 * 1000, // Duración del bloqueo (5 minutos)
}

// Configuración de rate limiting para APIs
const API_RATE_LIMIT = {
  MAX_REQUESTS: 30, // Máximo número de solicitudes a APIs
  WINDOW_MS: 60 * 1000, // Ventana de tiempo (1 minuto)
  BLOCK_DURATION_MS: 10 * 60 * 1000, // Duración del bloqueo (10 minutos)
}

export async function middleware(req: NextRequest) {
  // Obtener la IP del cliente (usar X-Forwarded-For en producción con proxy)
  const clientIp = req.headers.get('x-forwarded-for') || 
                  req.headers.get('x-real-ip') || 
                  'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const path = req.nextUrl.pathname
  const method = req.method
  const now = Date.now()
  
  // 1. Detección de ataques automatizados
  const attackDetection = detectAutomatedAttack(userAgent, path, method, req.headers)
  if (attackDetection.isAttack) {
    console.warn(`Ataque bloqueado: ${attackDetection.reason} desde ${clientIp}`)
    return generateBlockResponse(attackDetection.reason || 'Suspicious activity')
  }
  
  // 2. Rate limiting global por IP
  if (!requestCounts[clientIp]) {
    requestCounts[clientIp] = { count: 0, timestamp: now }
  }
  
  // Verificar si la IP está bloqueada
  if (requestCounts[clientIp].blockedUntil && requestCounts[clientIp].blockedUntil > now) {
    const remainingSeconds = Math.ceil((requestCounts[clientIp].blockedUntil! - now) / 1000)
    return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': remainingSeconds.toString()
      }
    })
  }
  
  // Limpiar contadores antiguos
  if (now - requestCounts[clientIp].timestamp > GLOBAL_RATE_LIMIT.WINDOW_MS) {
    requestCounts[clientIp] = { count: 0, timestamp: now }
  }
  
  // Incrementar contador
  requestCounts[clientIp].count++
  
  // 3. Rate limiting específico para APIs
  const isApiRequest = path.startsWith('/api/')
  const maxRequests = isApiRequest ? API_RATE_LIMIT.MAX_REQUESTS : GLOBAL_RATE_LIMIT.MAX_REQUESTS
  const blockDuration = isApiRequest ? API_RATE_LIMIT.BLOCK_DURATION_MS : GLOBAL_RATE_LIMIT.BLOCK_DURATION_MS
  
  // Si excede el límite, bloquear la solicitud
  if (requestCounts[clientIp].count > maxRequests) {
    // Bloquear la IP por un tiempo
    requestCounts[clientIp].blockedUntil = now + blockDuration
    
    return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(blockDuration / 1000).toString()
      }
    })
  }
  
  // 4. Redireccionar la ruta principal a /login
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // 5. Rate limiting para rutas de autenticación
  if (path.startsWith('/auth') && method === 'POST') {
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
  
  // 6. Preparar respuesta y cliente Supabase
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // 7. Verificar y renovar la sesión
  const { data: { session } } = await supabase.auth.getSession()
  
  // 8. Para rutas protegidas, verificar si el usuario está autenticado
  if (PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    // Si no hay sesión y estamos en una ruta protegida, redirigir a login
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Si hay sesión, verificar su validez pero solo si realmente ha expirado
    // Verificar tiempo de expiración de la sesión usando expires_at
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).getTime() : 0
    
    // Solo si la sesión ha expirado completamente
    if (expiresAt < now) {
      console.log('Sesión expirada. Tiempo de expiración:', new Date(expiresAt).toISOString())
      console.log('Tiempo actual:', new Date(now).toISOString())
      
      // Evitar bucle de redirección verificando si ya estamos en una redirección por sesión expirada
      if (req.nextUrl.searchParams.get('session_expired') !== 'true') {
        // Forzar cierre de sesión si ha expirado
        await supabase.auth.signOut()
        
        // Obtener la URL base del sitio desde las variables de entorno
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.url
        
        // Redirigir a /login con parámetro de sesión expirada
        const redirectUrl = new URL('/login', siteUrl)
        redirectUrl.searchParams.set('session_expired', 'true')
        return NextResponse.redirect(redirectUrl)
      }
    }
    
    // Almacenar IP en la sesión para futuras verificaciones
    res.headers.set('X-Session-IP', clientIp)
    
    // Añadir encabezados de seguridad adicionales para rutas protegidas
    res.headers.set('Cache-Control', 'no-store, max-age=0')
    res.headers.set('Pragma', 'no-cache')
  }
  
  // 9. Añadir encabezado para seguimiento de tiempo entre solicitudes
  res.headers.set('x-last-request-time', now.toString())
  
  return res
}

// Aplicar este middleware solo a las rutas que lo necesitan
export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto las siguientes
    '/((?!_next/static|_next/image|favicon.ico|api/auth|auth/callback).*)',
  ],
}
