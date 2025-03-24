"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

// Definir interfaces para mayor claridad
interface AuthContextType {
  user: any | null
  session: any | null
  isLoading: boolean
  signOut: () => Promise<void>
  getSession: () => Promise<any>
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Función para obtener la sesión actual
  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error al obtener la sesión:', error)
        return { session: null }
      }
      return data
    } catch (error) {
      console.error('Error inesperado al obtener la sesión:', error)
      return { session: null }
    }
  }

  // Función para cerrar sesión
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.push('/')
  }

  // Efecto para cargar la sesión al inicio
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true)
      try {
        const { session } = await getSession()
        if (session) {
          setSession(session)
          setUser(session.user)
          console.log('Sesión cargada:', {
            email: session.user.email,
            id: session.user.id
          })
        }
      } catch (error) {
        console.error('Error al cargar la sesión:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Cambio en el estado de autenticación:', event)
        if (newSession) {
          setSession(newSession)
          setUser(newSession.user)
        } else {
          setSession(null)
          setUser(null)
        }
        
        // Refrescar la página para reflejar el nuevo estado
        router.refresh()
      }
    )

    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Valor del contexto
  const value = {
    user,
    session,
    isLoading,
    signOut,
    getSession
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
