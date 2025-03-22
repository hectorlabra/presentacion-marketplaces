/**
 * Sistema de logging centralizado para eventos de seguridad
 * 
 * Este módulo proporciona funciones para registrar eventos de seguridad,
 * detectar patrones sospechosos y enviar alertas cuando sea necesario.
 */

// Tipos de eventos de seguridad
export enum SecurityEventType {
  // Eventos de autenticación
  LOGIN_SUCCESS = 'auth.login.success',
  LOGIN_FAILURE = 'auth.login.failure',
  LOGOUT = 'auth.logout',
  PASSWORD_RESET_REQUEST = 'auth.password.reset.request',
  PASSWORD_RESET_SUCCESS = 'auth.password.reset.success',
  PASSWORD_CHANGE = 'auth.password.change',
  MFA_ENABLED = 'auth.mfa.enabled',
  MFA_DISABLED = 'auth.mfa.disabled',
  MFA_CHALLENGE = 'auth.mfa.challenge',
  
  // Eventos de acceso
  ACCESS_DENIED = 'access.denied',
  ACCESS_GRANTED = 'access.granted',
  PERMISSION_CHANGE = 'access.permission.change',
  
  // Eventos de datos
  DATA_EXPORT = 'data.export',
  SENSITIVE_DATA_ACCESS = 'data.sensitive.access',
  DATA_MODIFICATION = 'data.modification',
  
  // Eventos de seguridad
  RATE_LIMIT_EXCEEDED = 'security.rate_limit.exceeded',
  SUSPICIOUS_ACTIVITY = 'security.suspicious_activity',
  ATTACK_DETECTED = 'security.attack.detected',
  IP_BLOCKED = 'security.ip.blocked',
  CONFIG_CHANGE = 'security.config.change',
  
  // Eventos de sistema
  SYSTEM_ERROR = 'system.error',
  SYSTEM_STARTUP = 'system.startup',
  SYSTEM_SHUTDOWN = 'system.shutdown',
  DEPLOYMENT = 'system.deployment',
}

// Niveles de severidad
export enum SecurityEventSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Interfaz para eventos de seguridad
export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  outcome?: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Configuración del logger
interface LoggerConfig {
  enableConsole: boolean;
  enableDatabase: boolean;
  enableAlerts: boolean;
  minSeverityForAlert: SecurityEventSeverity;
  retentionDays: number;
}

// Configuración por defecto
const DEFAULT_CONFIG: LoggerConfig = {
  enableConsole: true,
  enableDatabase: true,
  enableAlerts: true,
  minSeverityForAlert: SecurityEventSeverity.ERROR,
  retentionDays: 90, // Retención de logs por 90 días
};

// Almacenamiento en memoria para detección de patrones (en producción usar Redis/DB)
const recentEvents: SecurityEvent[] = [];
const MAX_RECENT_EVENTS = 1000; // Máximo número de eventos recientes a mantener en memoria

/**
 * Clase principal para el logging de seguridad
 */
export class SecurityLogger {
  private config: LoggerConfig;
  private static instance: SecurityLogger;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Registrar inicio del sistema de logging
    this.log({
      type: SecurityEventType.SYSTEM_STARTUP,
      severity: SecurityEventSeverity.INFO,
      timestamp: new Date().toISOString(),
      details: { message: 'Security logging system initialized' },
    });
  }

  /**
   * Obtener la instancia del logger (Singleton)
   */
  public static getInstance(config?: Partial<LoggerConfig>): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger(config);
    }
    return SecurityLogger.instance;
  }

  /**
   * Registrar un evento de seguridad
   */
  public log(event: SecurityEvent): void {
    // Asegurar que el evento tenga timestamp
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
    }

    // Logging en consola
    if (this.config.enableConsole) {
      this.logToConsole(event);
    }

    // Logging en base de datos
    if (this.config.enableDatabase) {
      this.logToDatabase(event);
    }

    // Almacenar evento para detección de patrones
    this.storeEventForPatternDetection(event);

    // Detectar patrones sospechosos
    this.detectSuspiciousPatterns(event);

    // Enviar alertas si es necesario
    if (this.config.enableAlerts && this.shouldSendAlert(event)) {
      this.sendAlert(event);
    }
  }

  /**
   * Logging en consola con formato y colores
   */
  private logToConsole(event: SecurityEvent): void {
    const timestamp = new Date(event.timestamp).toLocaleString();
    let color = '';
    
    // Asignar colores según severidad
    switch (event.severity) {
      case SecurityEventSeverity.DEBUG:
        color = '\x1b[36m'; // Cyan
        break;
      case SecurityEventSeverity.INFO:
        color = '\x1b[32m'; // Verde
        break;
      case SecurityEventSeverity.WARNING:
        color = '\x1b[33m'; // Amarillo
        break;
      case SecurityEventSeverity.ERROR:
        color = '\x1b[31m'; // Rojo
        break;
      case SecurityEventSeverity.CRITICAL:
        color = '\x1b[41m\x1b[37m'; // Fondo rojo, texto blanco
        break;
    }
    
    const reset = '\x1b[0m';
    const userId = event.userId ? `[User: ${event.userId}]` : '';
    const ip = event.ip ? `[IP: ${event.ip}]` : '';
    
    console.log(
      `${color}[${timestamp}][${event.severity.toUpperCase()}][${event.type}]${reset} ${userId} ${ip} ${event.details?.message || ''}`
    );
    
    // Mostrar detalles adicionales para depuración
    if (event.details && Object.keys(event.details).length > 0 && event.severity !== SecurityEventSeverity.DEBUG) {
      console.log('Details:', JSON.stringify(event.details, null, 2));
    }
  }

  /**
   * Logging en base de datos (Supabase)
   * En un entorno de producción, esto guardaría los eventos en una tabla de Supabase
   */
  private async logToDatabase(event: SecurityEvent): Promise<void> {
    try {
      // Aquí iría la lógica para guardar en Supabase
      // Por ahora solo simulamos el guardado
      
      // En producción sería algo como:
      // const { error } = await supabase
      //   .from('security_logs')
      //   .insert([{
      //     event_type: event.type,
      //     severity: event.severity,
      //     timestamp: event.timestamp,
      //     user_id: event.userId,
      //     session_id: event.sessionId,
      //     ip_address: event.ip,
      //     user_agent: event.userAgent,
      //     resource: event.resource,
      //     action: event.action,
      //     outcome: event.outcome,
      //     details: event.details,
      //     metadata: event.metadata,
      //   }]);
      
      // if (error) {
      //   console.error('Error logging to database:', error);
      // }
    } catch (error) {
      console.error('Error logging to database:', error);
    }
  }

  /**
   * Almacenar evento para detección de patrones
   */
  private storeEventForPatternDetection(event: SecurityEvent): void {
    recentEvents.push(event);
    
    // Mantener solo los eventos más recientes
    if (recentEvents.length > MAX_RECENT_EVENTS) {
      recentEvents.shift(); // Eliminar el evento más antiguo
    }
  }

  /**
   * Detectar patrones sospechosos basados en eventos recientes
   */
  private detectSuspiciousPatterns(event: SecurityEvent): void {
    // Detectar múltiples intentos fallidos de login
    if (event.type === SecurityEventType.LOGIN_FAILURE) {
      const recentFailures = recentEvents.filter(e => 
        e.type === SecurityEventType.LOGIN_FAILURE && 
        e.ip === event.ip &&
        new Date(e.timestamp).getTime() > Date.now() - 10 * 60 * 1000 // Últimos 10 minutos
      );
      
      if (recentFailures.length >= 5) {
        this.log({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          severity: SecurityEventSeverity.WARNING,
          timestamp: new Date().toISOString(),
          ip: event.ip,
          userAgent: event.userAgent,
          details: {
            message: `Multiple login failures detected from IP ${event.ip}`,
            count: recentFailures.length,
            timeframe: '10 minutes'
          },
        });
      }
    }
    
    // Detectar accesos desde ubicaciones inusuales
    if (event.type === SecurityEventType.LOGIN_SUCCESS && event.userId) {
      const userPreviousLogins = recentEvents.filter(e => 
        e.type === SecurityEventType.LOGIN_SUCCESS && 
        e.userId === event.userId &&
        e.ip !== event.ip
      );
      
      if (userPreviousLogins.length > 0 && !userPreviousLogins.some(e => e.ip === event.ip)) {
        this.log({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          severity: SecurityEventSeverity.WARNING,
          timestamp: new Date().toISOString(),
          userId: event.userId,
          ip: event.ip,
          userAgent: event.userAgent,
          details: {
            message: `Login from new location for user ${event.userId}`,
            newIp: event.ip,
            previousIps: [...new Set(userPreviousLogins.map(e => e.ip))],
          },
        });
      }
    }
    
    // Detectar múltiples accesos denegados
    if (event.type === SecurityEventType.ACCESS_DENIED) {
      const recentDenials = recentEvents.filter(e => 
        e.type === SecurityEventType.ACCESS_DENIED && 
        e.ip === event.ip &&
        new Date(e.timestamp).getTime() > Date.now() - 30 * 60 * 1000 // Últimos 30 minutos
      );
      
      if (recentDenials.length >= 3) {
        this.log({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          severity: SecurityEventSeverity.WARNING,
          timestamp: new Date().toISOString(),
          ip: event.ip,
          userAgent: event.userAgent,
          userId: event.userId,
          details: {
            message: `Multiple access denied events for IP ${event.ip}`,
            count: recentDenials.length,
            resources: [...new Set(recentDenials.map(e => e.resource))],
          },
        });
      }
    }
  }

  /**
   * Determinar si se debe enviar una alerta
   */
  private shouldSendAlert(event: SecurityEvent): boolean {
    const severityLevels = Object.values(SecurityEventSeverity);
    const eventSeverityIndex = severityLevels.indexOf(event.severity);
    const minSeverityIndex = severityLevels.indexOf(this.config.minSeverityForAlert);
    
    return eventSeverityIndex >= minSeverityIndex;
  }

  /**
   * Enviar alerta (email, SMS, webhook, etc.)
   */
  private sendAlert(event: SecurityEvent): void {
    // En producción, aquí iría la lógica para enviar alertas
    // Por ejemplo, enviar un email, SMS, o notificación a un sistema de monitoreo
    
    console.log(`🚨 ALERT: ${event.severity.toUpperCase()} - ${event.type} - ${event.details?.message || ''}`);
    
    // Ejemplo de integración con un webhook (simulado)
    // fetch('https://hooks.slack.com/services/XXX/YYY/ZZZ', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `🚨 Security Alert: [${event.severity.toUpperCase()}] ${event.type} - ${event.details?.message || ''}`,
    //     attachments: [{ fields: [{ title: 'Details', value: JSON.stringify(event.details) }] }]
    //   })
    // }).catch(error => console.error('Error sending alert webhook:', error));
  }

  /**
   * Limpiar eventos antiguos (útil para mantenimiento)
   */
  public cleanupOldEvents(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    
    // En producción, aquí iría la lógica para limpiar eventos antiguos de la base de datos
    // Por ejemplo:
    // const { error } = await supabase
    //   .from('security_logs')
    //   .delete()
    //   .lt('timestamp', cutoffDate.toISOString());
  }
}

// Exportar una instancia por defecto para uso sencillo
export const securityLogger = SecurityLogger.getInstance();

/**
 * Funciones de ayuda para logging de eventos comunes
 */

/**
 * Registrar un intento de login exitoso
 */
export function logLoginSuccess(userId: string, ip?: string, userAgent?: string, metadata?: Record<string, any>): void {
  securityLogger.log({
    type: SecurityEventType.LOGIN_SUCCESS,
    severity: SecurityEventSeverity.INFO,
    timestamp: new Date().toISOString(),
    userId,
    ip,
    userAgent,
    details: {
      message: `Successful login for user ${userId}`,
      ...metadata,
    },
  });
}

/**
 * Registrar un intento de login fallido
 */
export function logLoginFailure(userId: string, reason: string, ip?: string, userAgent?: string): void {
  securityLogger.log({
    type: SecurityEventType.LOGIN_FAILURE,
    severity: SecurityEventSeverity.WARNING,
    timestamp: new Date().toISOString(),
    userId,
    ip,
    userAgent,
    details: {
      message: `Failed login attempt for user ${userId}`,
      reason,
    },
  });
}

/**
 * Registrar un cierre de sesión
 */
export function logLogout(userId: string, ip?: string): void {
  securityLogger.log({
    type: SecurityEventType.LOGOUT,
    severity: SecurityEventSeverity.INFO,
    timestamp: new Date().toISOString(),
    userId,
    ip,
    details: {
      message: `Logout for user ${userId}`,
    },
  });
}

/**
 * Registrar un acceso denegado
 */
export function logAccessDenied(userId: string, resource: string, ip?: string): void {
  securityLogger.log({
    type: SecurityEventType.ACCESS_DENIED,
    severity: SecurityEventSeverity.WARNING,
    timestamp: new Date().toISOString(),
    userId,
    ip,
    resource,
    details: {
      message: `Access denied for user ${userId} to resource ${resource}`,
    },
  });
}

/**
 * Registrar un ataque detectado
 */
export function logAttackDetected(attackType: string, ip: string, userAgent?: string, details?: Record<string, any>): void {
  securityLogger.log({
    type: SecurityEventType.ATTACK_DETECTED,
    severity: SecurityEventSeverity.ERROR,
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    details: {
      message: `Attack detected: ${attackType}`,
      attackType,
      ...details,
    },
  });
}

/**
 * Registrar un cambio de configuración de seguridad
 */
export function logConfigChange(userId: string, configItem: string, oldValue: any, newValue: any): void {
  securityLogger.log({
    type: SecurityEventType.CONFIG_CHANGE,
    severity: SecurityEventSeverity.INFO,
    timestamp: new Date().toISOString(),
    userId,
    details: {
      message: `Security configuration changed: ${configItem}`,
      configItem,
      oldValue,
      newValue,
    },
  });
}

/**
 * Registrar acceso a datos sensibles
 */
export function logSensitiveDataAccess(userId: string, dataType: string, reason?: string): void {
  securityLogger.log({
    type: SecurityEventType.SENSITIVE_DATA_ACCESS,
    severity: SecurityEventSeverity.WARNING,
    timestamp: new Date().toISOString(),
    userId,
    details: {
      message: `Sensitive data accessed: ${dataType}`,
      dataType,
      reason,
    },
  });
}

/**
 * Registrar un error del sistema
 */
export function logSystemError(error: Error, context?: Record<string, any>): void {
  securityLogger.log({
    type: SecurityEventType.SYSTEM_ERROR,
    severity: SecurityEventSeverity.ERROR,
    timestamp: new Date().toISOString(),
    details: {
      message: `System error: ${error.message}`,
      errorName: error.name,
      errorStack: error.stack,
      ...context,
    },
  });
}
