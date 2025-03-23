'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecurityEventSeverity, SecurityEventType } from '@/lib/security-logger';
import SecurityEventsList from '@/components/security/SecurityEventsList';
import SecurityStats from '@/components/security/SecurityStats';
import { Download, RefreshCw, Search, Shield, AlertTriangle } from "lucide-react";

export default function SecurityDashboard() {
  const router = useRouter();
  const supabase = createClient();
  
  // Estado para eventos de seguridad
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0
  });
  
  // Estado para estadísticas
  const [statistics, setStatistics] = useState({
    total: 0,
    bySeverity: {
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
      debug: 0
    }
  });
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    severity: '',
    type: '',
    search: '',
    fromDate: '',
    toDate: ''
  });

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        // Verificar si el usuario es administrador
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error || !data || data.role !== 'admin') {
          router.push('/');
        } else {
          // Cargar eventos de seguridad
          fetchSecurityEvents();
        }
      }
    };
    
    checkAuth();
  }, []);

  // Función para obtener eventos de seguridad
  const fetchSecurityEvents = async () => {
    setLoading(true);
    
    try {
      // Construir URL con parámetros
      const params = new URLSearchParams();
      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());
      
      if (filters.severity) {
        params.append('severity', filters.severity);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.fromDate) {
        params.append('from', filters.fromDate);
      }
      
      if (filters.toDate) {
        params.append('to', filters.toDate);
      }
      
      // Realizar petición a la API
      const response = await fetch(`/api/security/events?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener eventos de seguridad');
      }
      
      const data = await response.json();
      
      // Actualizar estado
      setEvents(data.events || []);
      setPagination(data.pagination || { total: 0, limit: 10, offset: 0 });
      setStatistics(data.statistics || {
        total: 0,
        bySeverity: {
          critical: 0,
          error: 0,
          warning: 0,
          info: 0,
          debug: 0
        }
      });
    } catch (error) {
      console.error('Error al obtener eventos de seguridad:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de página
  const handlePageChange = (offset: number) => {
    setPagination(prev => ({ ...prev, offset }));
    fetchSecurityEvents();
  };

  // Manejar cambio de filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Aplicar filtros
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchSecurityEvents();
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      severity: '',
      type: '',
      search: '',
      fromDate: '',
      toDate: ''
    });
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchSecurityEvents();
  };

  // Exportar eventos
  const exportEvents = () => {
    // Convertir eventos a CSV
    const headers = ['Fecha', 'Tipo', 'Severidad', 'Usuario', 'IP', 'Recurso', 'Acción', 'Resultado'];
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        event.timestamp,
        event.type,
        event.severity,
        event.userId || '',
        event.ip || '',
        event.resource || '',
        event.action || '',
        event.outcome || ''
      ].join(','))
    ].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `security-events-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Seguridad</h1>
          <p className="text-muted-foreground">
            Monitoreo y análisis de eventos de seguridad
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchSecurityEvents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="default" onClick={exportEvents}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <SecurityStats statistics={statistics} />

      <div className="mt-8">
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">
              <Shield className="h-4 w-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Eventos de Seguridad</CardTitle>
                <CardDescription>
                  Historial completo de eventos de seguridad registrados en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <Select
                      value={filters.severity}
                      onValueChange={(value) => handleFilterChange('severity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <Select
                      value={filters.type}
                      onValueChange={(value) => handleFilterChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="authentication">Autenticación</SelectItem>
                        <SelectItem value="access">Acceso</SelectItem>
                        <SelectItem value="data">Datos</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                        <SelectItem value="suspicious">Sospechoso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      type="date"
                      placeholder="Desde"
                      value={filters.fromDate}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      type="date"
                      placeholder="Hasta"
                      value={filters.toDate}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="secondary" onClick={applyFilters}>
                      <Search className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button variant="outline" onClick={resetFilters}>
                      Limpiar
                    </Button>
                  </div>
                </div>
                
                {/* Lista de eventos */}
                <SecurityEventsList
                  events={events}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Seguridad</CardTitle>
                <CardDescription>
                  Alertas activas que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtrar solo eventos críticos y errores */}
                <SecurityEventsList
                  events={events.filter(event => 
                    event.severity === 'critical' || event.severity === 'error'
                  )}
                  pagination={{
                    total: events.filter(event => 
                      event.severity === 'critical' || event.severity === 'error'
                    ).length,
                    limit: pagination.limit,
                    offset: 0
                  }}
                  onPageChange={() => {}}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
