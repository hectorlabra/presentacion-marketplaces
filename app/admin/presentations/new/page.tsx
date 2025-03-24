"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import PresentationForm from "@/components/admin/presentation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function NewPresentationPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no estamos cargando y no hay usuario, redirigir al inicio
    if (!isLoading && !user) {
      console.log('No hay sesión activa, redirigiendo...')
      router.push('/')
    } else if (user) {
      console.log('Usuario autenticado en nueva presentación:', user.email)
    }
  }, [router, user, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-sm">Cargando...</div>
        </div>
      </div>
    )
  }
  
  // Si no hay usuario y no estamos cargando, mostrar mensaje
  if (!user && !isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="text-lg text-zinc-400">Necesitas iniciar sesión para crear una presentación</div>
          <Button 
            onClick={() => router.push('/')}
            className="mt-4 bg-neon-green hover:bg-neon-green/90 text-black"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      {user && <PresentationForm user={user} />}
    </div>
  )
}
