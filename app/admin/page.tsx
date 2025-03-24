"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    recent: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Primero verificamos si hay datos en la tabla
        const { data: tableInfo, error: tableError } = await supabase
          .from('presentations')
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.error('Error verificando tabla:', tableError);
          throw tableError;
        }

        // Si no hay datos, establecemos estadísticas en cero
        if (!tableInfo || tableInfo.length === 0) {
          setStats({
            total: 0,
            published: 0,
            drafts: 0,
            recent: 0
          });
          setLoading(false);
          return;
        }

        // Obtenemos la sesión actual
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          console.error('No hay sesión de usuario activa');
          throw new Error('No hay sesión de usuario activa');
        }

        // Obtenemos las estadísticas
        const { data, error } = await supabase
          .from('presentations')
          .select('status, created_at')
          .eq('user_id', session.user.id)

        if (error) {
          console.error('Error obteniendo presentaciones:', { error, userId: session.user.id });
          throw error;
        }

        // Asegurar que data es un array, incluso si está vacío
        const presentations = data || []
        
        const now = new Date()
        const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30))

        setStats({
          total: presentations.length,
          published: presentations.filter(p => p.status === 'published').length,
          drafts: presentations.filter(p => p.status === 'draft').length,
          recent: presentations.filter(p => new Date(p.created_at) > thirtyDaysAgo).length
        })
      } catch (error: any) {
        console.error('Error fetching stats:', { error: error.message || error, details: error })
        // Establecer estadísticas en cero en caso de error
        setStats({
          total: 0,
          published: 0,
          drafts: 0,
          recent: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-sm">Cargando estadísticas...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-zinc-400">Bienvenido a tu panel de control.</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/presentations/new')}
          className="bg-neon-green hover:bg-neon-green/90 text-black"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Presentación
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Presentaciones</CardTitle>
            <FileText className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-zinc-500">Presentaciones creadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Star className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-zinc-500">Presentaciones activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <FileText className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-zinc-500">En progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 30 días</CardTitle>
            <Clock className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent}</div>
            <p className="text-xs text-zinc-500">Presentaciones recientes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/admin/presentations')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver todas las presentaciones
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/admin/presentations/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear nueva presentación
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ayuda Rápida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-500">
              Desde aquí puedes gestionar todas tus presentaciones. Usa el menú superior para navegar
              entre las diferentes secciones.
            </p>
            <p className="text-sm text-zinc-500">
              Para crear una nueva presentación, haz clic en el botón "Nueva Presentación" en la
              esquina superior derecha.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

