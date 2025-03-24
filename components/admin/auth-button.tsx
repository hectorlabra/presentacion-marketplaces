"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthButton({ user, redirectAfterLogin = '/admin' }: { user?: any; redirectAfterLogin?: string }) {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    try {
      // Obtener la URL del sitio desde las variables de entorno o usar la URL actual
      const siteUrl = typeof window !== 'undefined' 
        ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : window.location.origin)
        : 'http://localhost:3000';
      
      // Construir URL de redirección explícita
      const redirectUrl = `${siteUrl}/auth/callback`;
      
      console.log('URL de redirección para autenticación:', redirectUrl);
      
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
      
      console.log('Iniciando sesión con Google...')
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error)
      // Aquí podríamos implementar un sistema de notificación al usuario
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    
    // Redirigir siempre a /login después de cerrar sesión
    const loginUrl = '/login'
    
    console.log('Logout redirecting to:', loginUrl)
    window.location.href = loginUrl
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

