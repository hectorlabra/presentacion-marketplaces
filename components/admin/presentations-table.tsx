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
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Presentation {
  id: string
  title: string
  created_at: string
  updated_at: string
  url: string
  status: 'draft' | 'published'
}

interface PresentationsTableProps {
  presentations: Presentation[]
  onEdit: (id: string) => void
  onView: (url: string) => void
  onDelete: (id: string) => void
}

export function PresentationsTable({
  presentations,
  onEdit,
  onView,
  onDelete,
}: PresentationsTableProps) {
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
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  presentation.status === 'published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {presentation.status === 'published' ? 'Publicada' : 'Borrador'}
                </span>
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
