import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth-error', requestUrl.origin))
    }
  }

  // URL to redirect to after sign in process completes
  // Usar siempre la URL absoluta para evitar problemas de redirección
  const isProduction = requestUrl.host.includes('innovare.lat') || requestUrl.host.includes('vercel.app')
  const redirectUrl = isProduction
    ? 'https://presentacion.innovare.lat/admin'
    : new URL('/admin', requestUrl.origin).toString()
  
  console.log('Redirecting to:', redirectUrl)
  return NextResponse.redirect(redirectUrl)
}
