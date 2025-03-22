import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SecurityEventType, SecurityEventSeverity } from '@/lib/security-logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // Crear cliente de Supabase
    const supabase = createClient();

    // Verificar autenticación (solo administradores pueden ver eventos de seguridad)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Construir consulta para obtener eventos de seguridad
    let query = supabase
      .from('security_events')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (severity) {
      query = query.eq('severity', severity);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (fromDate) {
      query = query.gte('timestamp', fromDate);
    }

    if (toDate) {
      query = query.lte('timestamp', toDate);
    }

    // Aplicar paginación
    const { data: events, error, count } = await query
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error al obtener eventos de seguridad:', error);
      return NextResponse.json(
        { error: 'Error al obtener eventos de seguridad' },
        { status: 500 }
      );
    }

    // Obtener estadísticas
    const { data: stats, error: statsError } = await supabase
      .from('security_events')
      .select('severity, count(*)')
      .group('severity');

    if (statsError) {
      console.error('Error al obtener estadísticas:', statsError);
    }

    // Formatear estadísticas
    const statistics = {
      total: count || 0,
      bySeverity: {
        critical: 0,
        error: 0,
        warning: 0,
        info: 0,
        debug: 0,
      }
    };

    // Actualizar estadísticas con los datos obtenidos
    if (stats) {
      stats.forEach((item: any) => {
        if (item.severity in statistics.bySeverity) {
          statistics.bySeverity[item.severity as SecurityEventSeverity] = item.count;
        }
      });
    }

    return NextResponse.json({
      events,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
      statistics
    });
  } catch (error) {
    console.error('Error en la API de eventos de seguridad:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
