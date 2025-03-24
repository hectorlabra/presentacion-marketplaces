"use client"

import { useState, useEffect, Suspense } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AuthButton from "@/components/admin/auth-button"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Componente que usa searchParams
function LoginContent() {
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // Verificar si el usuario ya está autenticado y comprobar parámetros de URL
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Verificando sesión...')
        // Verificar si hay un parámetro de sesión expirada
        if (searchParams.get('session_expired') === 'true') {
          console.log('Sesión expirada detectada')
          setSessionExpired(true)
        }
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error al verificar sesión:', error)
          setLoading(false)
          return
        }
        
        console.log('Estado de sesión:', session ? 'Activa' : 'Inactiva')
        
        if (session?.user) {
          console.log('Usuario autenticado, redirigiendo a /admin')
          router.push('/admin')
        } else {
          console.log('No hay sesión activa')
          setLoading(false)
        }
      } catch (error) {
        console.error('Error inesperado:', error)
        setLoading(false)
      }
    }
    
    checkUser()
  }, [router, searchParams, supabase.auth])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-white text-sm">Verificando sesión...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-white text-center">Panel de Administración</h1>
          
          {sessionExpired && (
            <Alert className="mb-6 bg-amber-900/30 border-amber-800 text-amber-200">
              <AlertDescription className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495a.75.75 0 01.53 0l7.5 3a.75.75 0 010 1.41l-7.5 3a.75.75 0 01-.53 0L1.485 6.91a.75.75 0 010-1.41l7-2.995zM10 7.5L3.585 5l6.415-2.57L16.415 5 10 7.5zm0 4L3.585 9l6.415-2.57L16.415 9 10 11.5z" clipRule="evenodd" />
                </svg>
                <span>Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</span>
              </AlertDescription>
            </Alert>
          )}
          
          <p className="mb-6 text-sm text-zinc-400 text-center">
            Inicia sesión para crear y gestionar presentaciones personalizadas.
          </p>
          <div className="flex justify-center">
            <AuthButton redirectAfterLogin="/admin" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal que envuelve el contenido en Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-white text-sm">Cargando...</div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
