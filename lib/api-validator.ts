/**
 * API Validator
 * Proporciona funciones para validar y sanitizar entradas de API
 */
import { sanitizeInput, validateInput } from './security-utils';
import { NextRequest, NextResponse } from 'next/server';

// Tipos de validación
export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isNumeric?: boolean;
  isBoolean?: boolean;
  isDate?: boolean;
  isUrl?: boolean;
  custom?: (value: any) => boolean;
  errorMessage?: string;
};

export type ValidationSchema = {
  [key: string]: ValidationRule;
};

export type ValidationResult = {
  valid: boolean;
  errors: { [key: string]: string };
};

/**
 * Valida un objeto contra un esquema de validación
 * @param data - Datos a validar
 * @param schema - Esquema de validación
 * @returns Resultado de la validación
 */
export function validateSchema(data: any, schema: ValidationSchema): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: {},
  };

  // Verificar que data sea un objeto
  if (!data || typeof data !== 'object') {
    result.valid = false;
    result.errors['_global'] = 'Invalid data format';
    return result;
  }

  // Validar cada campo según el esquema
  for (const field in schema) {
    const rules = schema[field];
    const value = data[field];

    // Verificar si es requerido
    if (rules.required && (value === undefined || value === null || value === '')) {
      result.valid = false;
      result.errors[field] = rules.errorMessage || `${field} is required`;
      continue;
    }

    // Si no es requerido y no tiene valor, saltar validaciones
    if ((value === undefined || value === null || value === '') && !rules.required) {
      continue;
    }

    // Validar tipo de string
    if (typeof value === 'string') {
      // Validar longitud mínima
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be at least ${rules.minLength} characters`;
        continue;
      }

      // Validar longitud máxima
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be at most ${rules.maxLength} characters`;
        continue;
      }

      // Validar patrón
      if (rules.pattern && !rules.pattern.test(value)) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} has an invalid format`;
        continue;
      }

      // Validar email
      if (rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be a valid email`;
        continue;
      }

      // Validar URL
      if (rules.isUrl && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be a valid URL`;
        continue;
      }

      // Validar numérico
      if (rules.isNumeric && !/^-?\d+(\.\d+)?$/.test(value)) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be a number`;
        continue;
      }

      // Validar fecha
      if (rules.isDate && isNaN(Date.parse(value))) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be a valid date`;
        continue;
      }

      // Validar booleano
      if (rules.isBoolean && !['true', 'false', '0', '1'].includes(value.toLowerCase())) {
        result.valid = false;
        result.errors[field] = rules.errorMessage || `${field} must be a boolean`;
        continue;
      }
    }

    // Validación personalizada
    if (rules.custom && !rules.custom(value)) {
      result.valid = false;
      result.errors[field] = rules.errorMessage || `${field} is invalid`;
      continue;
    }

    // Validar contra inyecciones
    if (typeof value === 'string' && !validateInput(value)) {
      result.valid = false;
      result.errors[field] = `${field} contains potentially harmful content`;
      continue;
    }
  }

  return result;
}

/**
 * Sanitiza un objeto según un esquema
 * @param data - Datos a sanitizar
 * @param schema - Esquema de validación
 * @returns Datos sanitizados
 */
export function sanitizeData(data: any, schema: ValidationSchema): any {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const sanitized: any = {};

  // Solo incluir campos definidos en el esquema
  for (const field in schema) {
    if (data[field] !== undefined) {
      // Sanitizar strings
      if (typeof data[field] === 'string') {
        sanitized[field] = sanitizeInput(data[field]);
      } else {
        sanitized[field] = data[field];
      }
    }
  }

  return sanitized;
}

/**
 * Middleware para validar solicitudes API
 * @param schema - Esquema de validación
 * @returns Middleware de Next.js
 */
export function withValidation(schema: ValidationSchema) {
  return async (req: NextRequest) => {
    try {
      // Solo validar solicitudes POST, PUT, PATCH
      if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        const contentType = req.headers.get('content-type') || '';
        
        // Validar solicitudes JSON
        if (contentType.includes('application/json')) {
          const body = await req.json();
          
          // Validar el cuerpo de la solicitud
          const validationResult = validateSchema(body, schema);
          
          if (!validationResult.valid) {
            return NextResponse.json(
              { error: 'Validation failed', details: validationResult.errors },
              { status: 400 }
            );
          }
          
          // Sanitizar datos
          const sanitizedData = sanitizeData(body, schema);
          
          // Crear una nueva solicitud con los datos sanitizados
          const newRequest = new Request(req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(sanitizedData),
          });
          
          // Añadir propiedad para indicar que la solicitud ha sido validada
          Object.defineProperty(newRequest, 'validatedBody', {
            value: sanitizedData,
            writable: false,
          });
          
          return newRequest;
        }
      }
      
      // Para otros métodos o tipos de contenido, pasar la solicitud sin modificar
      return req;
    } catch (error) {
      console.error('API validation error:', error);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
  };
}

/**
 * Función de ayuda para crear un controlador de API seguro
 * @param handler - Controlador de API
 * @param schema - Esquema de validación
 * @returns Controlador de API con validación
 */
export function createSecureHandler(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  schema?: ValidationSchema
) {
  return async (req: NextRequest) => {
    try {
      // Aplicar validación si se proporciona un esquema
      if (schema) {
        const validatedReq = await withValidation(schema)(req);
        
        // Si la validación devuelve una respuesta, es un error
        if (validatedReq instanceof NextResponse) {
          return validatedReq;
        }
        
        // Llamar al controlador con la solicitud validada
        return handler(validatedReq as NextRequest);
      }
      
      // Si no hay esquema, llamar al controlador directamente
      return handler(req);
    } catch (error) {
      console.error('API handler error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Ejemplo de uso:
 * 
 * // Definir esquema de validación
 * const loginSchema: ValidationSchema = {
 *   email: { required: true, isEmail: true, maxLength: 100 },
 *   password: { required: true, minLength: 8, maxLength: 100 }
 * };
 * 
 * // Crear controlador seguro
 * export const POST = createSecureHandler(async (req) => {
 *   const { email, password } = await req.json();
 *   // Lógica de autenticación...
 *   return NextResponse.json({ success: true });
 * }, loginSchema);
 */
