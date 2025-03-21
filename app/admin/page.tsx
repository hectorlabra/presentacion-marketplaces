"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AuthButton from "@/components/admin/auth-button"
import PresentationForm from "@/components/admin/presentation-form"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

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

