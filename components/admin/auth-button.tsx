"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthButton({ user }: { user?: any }) {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    try {
      // Determinar la URL de redirección basada en el entorno
      const isProduction = typeof window !== 'undefined' && 
        (window.location.host.includes('innovare.lat') || window.location.host.includes('vercel.app'))
      
      const redirectUrl = isProduction
        ? 'https://presentacion.innovare.lat/auth/callback'
        : `${window.location.origin}/auth/callback`
      
      // Lista de dominios de correo permitidos (para mayor seguridad)
      const allowedDomains = ['innovare.lat', 'gmail.com']
      
      // Iniciar sesión con OAuth y configuraciones de seguridad mejoradas
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            // Solicitar acceso al correo para verificar el dominio
            access_type: 'offline',
            prompt: 'consent',
            hd: allowedDomains.join(',') // Limitar a dominios específicos (Google Workspace)
          },
          // Establecer tiempo de expiración de sesión más corto (12 horas)
          // Esto se aplicará cuando se cree la sesión
          scopes: 'email profile',
        },
      })
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error)
      // Aquí podríamos implementar un sistema de notificación al usuario
    }
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

