/**
 * API de ejemplo con implementación de seguridad
 */
import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, ValidationSchema } from '@/lib/api-validator';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Esquema de validación para la API de ejemplo
const exampleSchema: ValidationSchema = {
  name: { 
    required: true, 
    minLength: 2, 
    maxLength: 50,
    errorMessage: 'El nombre debe tener entre 2 y 50 caracteres'
  },
  email: { 
    required: true, 
    isEmail: true, 
    maxLength: 100,
    errorMessage: 'Por favor, proporciona un email válido'
  },
  message: { 
    required: true, 
    minLength: 10, 
    maxLength: 500,
    errorMessage: 'El mensaje debe tener entre 10 y 500 caracteres'
  },
  type: { 
    required: true, 
    custom: (value) => ['feedback', 'support', 'info'].includes(value),
    errorMessage: 'El tipo debe ser feedback, support o info'
  }
};

// Límite de tamaño para la carga útil (1MB)
const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024;

/**
 * Manejador POST seguro con validación de esquema
 */
export const POST = createSecureHandler(async (req: NextRequest) => {
  // 1. Verificar tamaño de la carga útil
  const contentLength = parseInt(req.headers.get('content-length') || '0');
  if (contentLength > MAX_PAYLOAD_SIZE) {
    return NextResponse.json(
      { error: 'Payload too large' },
      { status: 413 }
    );
  }

  // 2. Obtener datos validados
  const { name, email, message, type } = await req.json();

  // 3. Verificar autenticación para ciertos tipos de solicitudes
  if (type === 'support') {
    // Crear cliente Supabase
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar sesión
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required for support requests' },
        { status: 401 }
      );
    }
  }

  try {
    // 4. Procesar la solicitud (aquí iría la lógica real)
    // Por ejemplo, guardar en base de datos, enviar email, etc.
    
    // 5. Registrar la actividad para auditoría
    console.log(`API request processed: ${type} from ${email}`);
    
    // 6. Devolver respuesta exitosa con datos mínimos
    return NextResponse.json(
      { 
        success: true,
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    // 7. Manejo de errores seguro (sin exponer detalles internos)
    console.error('Error processing request:', error);
    
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}, exampleSchema);

/**
 * Manejador GET seguro
 */
export const GET = createSecureHandler(async (req: NextRequest) => {
  // Verificar autenticación para todos los GETs
  const supabase = createRouteHandlerClient({ cookies });

  // Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Obtener parámetros de consulta de manera segura
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  
  // Validar parámetros de consulta
  if (type && !['feedback', 'support', 'info'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  }

  try {
    // Procesar la solicitud (aquí iría la lógica real)
    // Por ejemplo, obtener datos de la base de datos
    
    // Devolver respuesta con datos mínimos
    return NextResponse.json(
      { 
        success: true,
        data: {
          types: ['feedback', 'support', 'info'],
          currentType: type || 'all'
        },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing GET request:', error);
    
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
});
