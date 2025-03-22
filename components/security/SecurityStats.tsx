import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityEventSeverity } from '@/lib/security-logger';
import { AlertTriangle, AlertCircle, Info, Shield } from "lucide-react";

interface SecurityStatsProps {
  statistics: {
    total: number;
    bySeverity: {
      critical: number;
      error: number;
      warning: number;
      info: number;
      debug: number;
    };
  };
}

export default function SecurityStats({ statistics }: SecurityStatsProps) {
  // Función para obtener el color según la severidad
  const getSeverityColor = (severity: SecurityEventSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'error':
        return 'text-orange-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'debug':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  // Función para obtener el icono según la severidad
  const getSeverityIcon = (severity: SecurityEventSeverity) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'info':
        return <Info className="h-4 w-4 mr-1" />;
      case 'debug':
        return <Shield className="h-4 w-4 mr-1" />;
      default:
        return <Info className="h-4 w-4 mr-1" />;
    }
  };

  // Calcular el porcentaje de eventos críticos y de error
  const criticalPercentage = statistics.total > 0 
    ? ((statistics.bySeverity.critical + statistics.bySeverity.error) / statistics.total * 100).toFixed(1) 
    : '0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Eventos
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total}</div>
          <p className="text-xs text-muted-foreground">
            Eventos de seguridad registrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Eventos Críticos
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.bySeverity.critical}</div>
          <p className="text-xs text-muted-foreground">
            Requieren atención inmediata
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Alertas
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.bySeverity.error + statistics.bySeverity.warning}
          </div>
          <p className="text-xs text-muted-foreground">
            Errores y advertencias
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Índice de Criticidad
          </CardTitle>
          <Info className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{criticalPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            Porcentaje de eventos críticos y errores
          </p>
        </CardContent>
      </Card>

      {/* Desglose por severidad */}
      <div className="md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Desglose por Severidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(statistics.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex flex-col items-center">
                  <div className={`text-2xl font-bold ${getSeverityColor(severity as SecurityEventSeverity)}`}>
                    {count}
                  </div>
                  <div className="flex items-center text-sm">
                    {getSeverityIcon(severity as SecurityEventSeverity)}
                    <span className="capitalize">{severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
