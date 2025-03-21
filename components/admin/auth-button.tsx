"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthButton({ user }: { user?: any }) {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    // Usar la URL completa en producción
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? 'https://presentacion.innovare.lat/auth/callback'
      : `${window.location.origin}/auth/callback`
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/admin"
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

