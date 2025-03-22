"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AuthButton from "@/components/admin/auth-button"
import PresentationForm from "@/components/admin/presentation-form"
import { logSecurityEvent, setupSessionMonitoring } from "@/lib/auth-security"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user || null
        setUser(currentUser)
        
        // Registrar evento de seguridad si hay un usuario activo
        if (currentUser) {
          // Obtener información del navegador
          const userAgent = navigator.userAgent
          const ipAddress = 'client-side' // No podemos obtener la IP real del cliente desde el navegador
          
          // Registrar evento de inicio de sesión exitoso
          logSecurityEvent({
            event_type: 'login_success',
            user_id: currentUser.id,
            email: currentUser.email,
            user_agent: userAgent,
            ip_address: ipAddress,
            metadata: {
              provider: currentUser.app_metadata?.provider || 'unknown',
              last_sign_in: currentUser.last_sign_in_at
            }
          })
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Configurar monitoreo de sesión para detectar cambios sospechosos
    const sessionMonitor = setupSessionMonitoring((event) => {
      // Manejar eventos sospechosos
      if (event.type === 'suspicious_activity') {
        console.warn('Actividad sospechosa detectada:', event.details)
        // Aquí podríamos mostrar una alerta al usuario o tomar otras acciones
      }
    })

    // Escuchar cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      
      // Registrar eventos de autenticación
      if (event === 'SIGNED_IN') {
        logSecurityEvent({
          event_type: 'login_success',
          user_id: session?.user?.id,
          email: session?.user?.email,
          user_agent: navigator.userAgent,
          metadata: { auth_event: event }
        })
      } else if (event === 'SIGNED_OUT') {
        logSecurityEvent({
          event_type: 'logout',
          user_id: user?.id, // Usar el usuario anterior
          email: user?.email,
          user_agent: navigator.userAgent,
          metadata: { auth_event: event }
        })
      }
    })

    return () => {
      // Limpiar suscripciones
      authListener.subscription.unsubscribe()
      sessionMonitor.stop()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
            <h1 className="mb-6 text-2xl font-bold text-white text-center">Panel de Administración</h1>
            <p className="mb-6 text-sm text-zinc-400 text-center">
              Inicia sesión para crear y gestionar presentaciones personalizadas.
            </p>
            <div className="flex justify-center">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <AuthButton user={user} />
        </div>

        <PresentationForm user={user} />
      </div>
    </div>
  )
}

