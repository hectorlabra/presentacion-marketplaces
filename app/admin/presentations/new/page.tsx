"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import PresentationForm from "@/components/admin/presentation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewPresentationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error obteniendo sesión:', error)
          router.push('/')
          return
        }

        if (!session?.user) {
          console.log('No hay sesión activa, redirigiendo...')
          router.push('/')
          return
        }

        console.log('Usuario autenticado:', session.user.email)
        setUser(session.user)
      } catch (error) {
        console.error('Error inesperado:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-sm">Cargando...</div>
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
