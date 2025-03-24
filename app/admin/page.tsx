"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PresentationsTable } from "@/components/admin/presentations-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [presentations, setPresentations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const { data, error } = await supabase
          .from('presentations')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPresentations(data || [])
      } catch (error) {
        console.error('Error fetching presentations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPresentations()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-sm">Cargando presentaciones...</div>
        </div>
      </div>
    )
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/presentations/${id}/edit`)
  }

  const handleView = (url: string) => {
    window.open(url, '_blank')
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta presentación?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('presentations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPresentations(presentations.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting presentation:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Tus Presentaciones</h2>
          <p className="text-zinc-400">Gestiona y edita tus presentaciones personalizadas.</p>
        </div>
        <Button onClick={() => router.push('/admin/presentations/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Presentación
        </Button>
      </div>

      {presentations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-zinc-400">No hay presentaciones aún</h3>
          <p className="text-zinc-500 mt-2">Comienza creando tu primera presentación.</p>
        </div>
      ) : (
        <PresentationsTable
          presentations={presentations}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

