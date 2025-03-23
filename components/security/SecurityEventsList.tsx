import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, Info, Bug, Shield } from "lucide-react";
import { SecurityEvent, SecurityEventSeverity, SecurityEventType } from '@/lib/security-logger';

interface SecurityEventsListProps {
  events: SecurityEvent[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
  onPageChange: (offset: number) => void;
  loading?: boolean;
}

export default function SecurityEventsList({
  events,
  pagination,
  onPageChange,
  loading = false
}: SecurityEventsListProps) {
  // Función para obtener el color de la badge según la severidad
  const getSeverityColor = (severity: SecurityEventSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'error':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'debug':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Función para obtener el icono según el tipo de evento
  const getEventTypeIcon = (type: SecurityEventType) => {
    // Determinar la categoría basada en el prefijo del tipo de evento
    if (type.startsWith('auth.')) {
      return <Shield className="h-4 w-4 mr-1" />;
    } else if (type.startsWith('access.')) {
      return <AlertCircle className="h-4 w-4 mr-1" />;
    } else if (type.startsWith('data.')) {
      return <Info className="h-4 w-4 mr-1" />;
    } else if (type.startsWith('system.')) {
      return <Bug className="h-4 w-4 mr-1" />;
    } else if (type.startsWith('security.')) {
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    } else {
      return <Info className="h-4 w-4 mr-1" />;
    }
  };

  // Calcular páginas
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  // Función para cambiar de página
  const changePage = (page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    onPageChange(newOffset);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full">
      <Table>
        <TableCaption>
          {loading ? (
            "Cargando eventos de seguridad..."
          ) : (
            `Mostrando ${events.length} de ${pagination.total} eventos de seguridad`
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Severidad</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Recurso</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Cargando...
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No hay eventos de seguridad para mostrar
              </TableCell>
            </TableRow>
          ) : (
            events.map((event, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {formatDate(event.timestamp)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getEventTypeIcon(event.type)}
                    {event.type}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </TableCell>
                <TableCell>{event.userId || '-'}</TableCell>
                <TableCell>{event.ip || '-'}</TableCell>
                <TableCell>{event.resource || '-'}</TableCell>
                <TableCell>{event.action || '-'}</TableCell>
                <TableCell>{event.outcome || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="text-sm">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
