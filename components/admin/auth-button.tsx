"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function AuthButton({ user }: { user?: any }) {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
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

