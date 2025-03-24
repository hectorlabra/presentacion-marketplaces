"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import PresentationForm from "@/components/admin/presentation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EditPresentationPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [presentation, setPresentation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const getSessionAndPresentation = async () => {
      try {
        // Obtener sesión
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push('/login')
          return
        }
        setUser(session.user)

        // Obtener presentación
        const { data, error } = await supabase
          .from('presentations')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching presentation:', error)
          router.push('/admin/presentations')
          return
        }

        if (!data) {
          router.push('/admin/presentations')
          return
        }

        // Verificar que la presentación pertenece al usuario
        if (data.user_id !== session.user.id) {
          router.push('/admin/presentations')
          return
        }

        setPresentation(data)
      } catch (error) {
        console.error('Error:', error)
        router.push('/admin/presentations')
      } finally {
        setLoading(false)
      }
    }

    getSessionAndPresentation()
  }, [id, router, supabase])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-sm">Cargando presentación...</div>
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

      {user && presentation && (
        <PresentationForm 
          user={user} 
          initialPresentation={presentation}
          isEditing={true}
        />
      )}
    </div>
  )
}
