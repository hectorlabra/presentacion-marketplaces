/**
 * Módulo de seguridad para autenticación
 * Proporciona funciones para mejorar la seguridad de la autenticación
 */
import { createClient } from '@supabase/supabase-js'

// Crear cliente Supabase para operaciones de seguridad
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interfaz para eventos de seguridad
interface SecurityEvent {
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'session_expired' | 'suspicious_activity'
  user_id?: string
  email?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
  timestamp: string
}

/**
 * Registra un evento de seguridad
 * @param event Evento de seguridad a registrar
 */
export async function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  try {
    // Añadir timestamp actual
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    // En un entorno de producción, esto debería guardarse en una tabla de Supabase
    // Por ahora, solo lo registramos en la consola en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Security Event]', securityEvent)
      return { success: true }
    }

    // En producción, guardar en Supabase (requiere crear la tabla 'security_events')
    // Descomentar cuando la tabla esté creada
    /*
    const { error } = await supabase
      .from('security_events')
      .insert(securityEvent)

    if (error) {
      console.error('Error logging security event:', error)
      return { success: false, error }
    }
    */

    return { success: true }
  } catch (error) {
    console.error('Error logging security event:', error)
    return { success: false, error }
  }
}

/**
 * Verifica si una dirección IP está en una lista negra
 * @param ipAddress Dirección IP a verificar
 */
export async function isIpBlacklisted(ipAddress: string): Promise<boolean> {
  try {
    // En un entorno de producción, esto debería verificar contra una tabla en Supabase
    // Por ahora, retornamos false (no bloqueado)
    
    // Lista negra de ejemplo (en producción, esto estaría en Supabase)
    const blacklistedIps = [
      // IPs conocidas de atacantes o servicios no deseados
      '0.0.0.0', // Ejemplo
    ]

    return blacklistedIps.includes(ipAddress)
  } catch (error) {
    console.error('Error checking IP blacklist:', error)
    return false
  }
}

/**
 * Verifica si un correo electrónico está en una lista de dominios permitidos
 * @param email Correo electrónico a verificar
 */
export function isEmailDomainAllowed(email: string): boolean {
  // Lista de dominios permitidos
  const allowedDomains = [
    'innovare.lat',
    'gmail.com',
    // Añadir más dominios según sea necesario
  ]

  try {
    const domain = email.split('@')[1].toLowerCase()
    return allowedDomains.includes(domain)
  } catch (error) {
    return false
  }
}

/**
 * Verifica si hay actividad sospechosa en una sesión
 * @param userId ID del usuario
 * @param ipAddress Dirección IP actual
 * @param userAgent User Agent actual
 */
export async function detectSuspiciousActivity(
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<{ suspicious: boolean; reason?: string }> {
  try {
    // En producción, esto verificaría contra el historial de sesiones en Supabase
    // Por ahora, retornamos false (no sospechoso)
    
    // Implementación básica: verificar si la IP está en la lista negra
    const ipBlacklisted = await isIpBlacklisted(ipAddress)
    if (ipBlacklisted) {
      return { 
        suspicious: true, 
        reason: 'IP address is blacklisted' 
      }
    }

    return { suspicious: false }
  } catch (error) {
    console.error('Error detecting suspicious activity:', error)
    return { suspicious: false }
  }
}

/**
 * Función para implementar en el cliente que monitorea cambios en la sesión
 * @param callback Función a llamar cuando se detecta un cambio sospechoso
 */
export function setupSessionMonitoring(
  callback: (event: { type: string; details: any }) => void
) {
  // Esta función se implementaría en el cliente para monitorear cambios en la sesión
  // Por ejemplo, cambios en la IP, User Agent, etc.
  
  // En un entorno real, esto podría usar localStorage para almacenar información de la sesión
  // y compararla con la información actual
  
  // Por ahora, es solo un placeholder
  return {
    stop: () => {
      // Función para detener el monitoreo
    }
  }
}
