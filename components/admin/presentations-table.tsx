"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Eye, Trash2, RefreshCw, Check } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Presentation {
  id: string
  title: string
  created_at: string
  updated_at: string
  url: string
  status: 'draft' | 'published' | 'unpublished'
}

interface PresentationsTableProps {
  presentations: Presentation[]
  onEdit: (id: string) => void
  onView: (url: string) => void
  onDelete: (id: string) => void
  onChangeStatus: (id: string, status: string) => void
}

export function PresentationsTable({
  presentations,
  onEdit,
  onView,
  onDelete,
  onChangeStatus,
}: PresentationsTableProps) {
  // Función para obtener el estilo del estado
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">Publicada</span>;
      case 'unpublished':
        return <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700">Despublicada</span>;
      case 'draft':
      default:
        return <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700">Borrador</span>;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creada</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presentations.map((presentation) => (
            <TableRow key={presentation.id}>
              <TableCell className="font-medium">{presentation.title}</TableCell>
              <TableCell>
                {getStatusBadge(presentation.status)}
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(presentation.created_at), { addSuffix: true, locale: es })}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(presentation.updated_at), { addSuffix: true, locale: es })}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(presentation.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(presentation.url)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver presentación
                    </DropdownMenuItem>
                    
                    {/* Nuevo menú para cambiar estado */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Cambiar Estado
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => onChangeStatus(presentation.id, 'published')}>
                            <Check className={`mr-2 h-4 w-4 ${presentation.status === 'published' ? 'opacity-100' : 'opacity-0'}`} />
                            Publicada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeStatus(presentation.id, 'unpublished')}>
                            <Check className={`mr-2 h-4 w-4 ${presentation.status === 'unpublished' ? 'opacity-100' : 'opacity-0'}`} />
                            Despublicada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeStatus(presentation.id, 'draft')}>
                            <Check className={`mr-2 h-4 w-4 ${presentation.status === 'draft' ? 'opacity-100' : 'opacity-0'}`} />
                            Borrador
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    
                    <DropdownMenuItem
                      onClick={() => onDelete(presentation.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
