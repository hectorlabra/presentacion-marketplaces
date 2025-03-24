import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  console.log('Callback - Iniciando proceso de autenticación')
  console.log('Callback - URL Origin:', requestUrl.origin)
  console.log('Callback - Site URL:', siteUrl)

  // Si hay un error en la autenticación de Google
  if (error) {
    console.error('Error de autenticación OAuth:', error)
    return NextResponse.redirect(
      new URL(`/login?error=oauth&message=${encodeURIComponent(error)}`, siteUrl)
    )
  }

  // Verificar código de autorización
  if (!code) {
    console.error('No se encontró código de autorización')
    return NextResponse.redirect(
      new URL('/login?error=no_code', siteUrl)
    )
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Intercambiar código por sesión
    await supabase.auth.exchangeCodeForSession(code)
    
    // Construir la URL de redirección usando la URL base del sitio
    const redirectUrl = new URL('/admin', siteUrl)
    
    console.log('Callback - Autenticación exitosa')
    console.log('Callback - Redirigiendo a:', redirectUrl.toString())
    
    return NextResponse.redirect(redirectUrl)
  } catch (error: unknown) {
    console.error('Error en el intercambio de código por sesión:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.redirect(
      new URL(`/login?error=session&message=${encodeURIComponent(errorMessage)}`, siteUrl)
    )
  }
}
