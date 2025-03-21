"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthButton({ user }: { user?: any }) {
  const router = useRouter()

  // Manejar el callback de autenticación al cargar la página
  useEffect(() => {
    // Comprobar si estamos en un entorno de navegador
    if (typeof window !== "undefined") {
      // Verificar si hay hash fragments en la URL (indicando un callback de auth)
      if (window.location.hash.includes("access_token")) {
        // Procesar el hash y establecer la sesión
        supabase.auth.getSession().then(({ data, error }) => {
          if (data.session && !error) {
            // Redirigir a la página admin sin los parámetros en la URL
            router.push("/admin")
          }
        })
      }
    }
  }, [])

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
    // Opcional: recargar la página después de cerrar sesión
    window.location.reload()
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

