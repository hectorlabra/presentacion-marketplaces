"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthButton({ user, redirectAfterLogin = '/admin' }: { user?: any; redirectAfterLogin?: string }) {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    try {
      // Obtener la URL del sitio desde las variables de entorno
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      // Construir URL de redirección explícita
      const redirectUrl = `${siteUrl}/auth/callback`;
      
      console.log('URL de redirección para autenticación:', redirectUrl);
      
      // Iniciar sesión con OAuth
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',  // Siempre mostrar selector de cuentas
            access_type: 'offline'     // Permitir refresh tokens
          },
          scopes: 'email profile',     // Solicitar acceso al email y perfil
        },
      })
      
      console.log('Iniciando sesión con Google...')
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error)
      // Aquí podríamos implementar un sistema de notificación al usuario
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    
    // Redirigir al inicio después de cerrar sesión
    window.location.href = '/'
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

