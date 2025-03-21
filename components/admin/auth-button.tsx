"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthButton({ user }: { user?: any }) {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    // Usar la URL completa en producción
    const isProduction = window.location.host.includes('innovare.lat') || window.location.host.includes('vercel.app')
    const redirectUrl = isProduction
      ? 'https://presentacion.innovare.lat/auth/callback'
      : `${window.location.origin}/auth/callback`
    
    console.log('Using redirect URL:', redirectUrl)
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    
    const isProduction = window.location.host.includes('innovare.lat') || window.location.host.includes('vercel.app')
    const redirectUrl = isProduction
      ? 'https://presentacion.innovare.lat/admin'
      : '/admin'
    
    console.log('Logout redirecting to:', redirectUrl)
    window.location.href = redirectUrl
  }

  return user ? (
    <Button variant="outline" onClick={handleLogout} className="text-white border-zinc-700 hover:bg-zinc-800">
      Cerrar Sesión
    </Button>
  ) : (
    <Button onClick={handleLogin} className="bg-neon-green hover:bg-neon-green/90 text-black">
      Iniciar Sesión con Google
    </Button>
  )
}

