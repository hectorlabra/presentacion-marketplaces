/**
 * Utilidades de seguridad para protección contra ataques y detección de bots
 */

// Lista de User Agents conocidos de bots maliciosos
const MALICIOUS_USER_AGENTS = [
  'zgrab',
  'semrush',
  'masscan',
  'nmap',
  'nikto',
  'wpscan',
  'sqlmap',
  'acunetix',
  'nessus',
  'w3af',
  'dirbuster',
  'gobuster',
  'zmap',
  'burpsuite',
  'shodan',
  'censys',
];

// Lista de patrones de rutas comúnmente atacadas
const SUSPICIOUS_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/admin/login',
  '/administrator',
  '/phpmyadmin',
  '/.env',
  '/config',
  '/.git',
  '/vendor',
  '/node_modules',
  '/api/proxy',
  '/actuator',
  '/console',
  '/jenkins',
  '/solr',
  '/xmlrpc.php',
];

/**
 * Verifica si un User Agent pertenece a un bot malicioso conocido
 * @param userAgent - User Agent del cliente
 * @returns true si es un bot malicioso, false en caso contrario
 */
export function isMaliciousBot(userAgent: string): boolean {
  if (!userAgent) return false;
  
  const lowerUserAgent = userAgent.toLowerCase();
  return MALICIOUS_USER_AGENTS.some(bot => lowerUserAgent.includes(bot));
}

/**
 * Verifica si una ruta es sospechosa (comúnmente atacada)
 * @param path - Ruta solicitada
 * @returns true si es una ruta sospechosa, false en caso contrario
 */
export function isSuspiciousPath(path: string): boolean {
  if (!path) return false;
  
  return SUSPICIOUS_PATHS.some(suspiciousPath => 
    path === suspiciousPath || path.startsWith(`${suspiciousPath}/`)
  );
}

/**
 * Verifica si una solicitud tiene características de un ataque automatizado
 * @param userAgent - User Agent del cliente
 * @param path - Ruta solicitada
 * @param method - Método HTTP
 * @param headers - Encabezados HTTP
 * @returns Objeto con resultado y razón
 */
export function detectAutomatedAttack(
  userAgent: string,
  path: string,
  method: string,
  headers: Headers
): { isAttack: boolean; reason?: string } {
  // Verificar User Agent
  if (isMaliciousBot(userAgent)) {
    return { isAttack: true, reason: 'Malicious bot detected' };
  }
  
  // Verificar rutas sospechosas
  if (isSuspiciousPath(path)) {
    return { isAttack: true, reason: 'Suspicious path requested' };
  }
  
  // Verificar ausencia de encabezados comunes en navegadores legítimos
  if (method !== 'OPTIONS' && !headers.get('accept') && !headers.get('accept-language')) {
    return { isAttack: true, reason: 'Missing standard browser headers' };
  }
  
  // Verificar solicitudes rápidas (potencial scraping)
  const lastRequestTime = parseInt(headers.get('x-last-request-time') || '0');
  const currentTime = Date.now();
  
  if (lastRequestTime > 0 && (currentTime - lastRequestTime < 50)) {
    return { isAttack: true, reason: 'Request rate too high' };
  }
  
  return { isAttack: false };
}

/**
 * Genera una respuesta de bloqueo para ataques detectados
 * @param reason - Razón del bloqueo
 * @returns Respuesta HTTP con código 403
 */
export function generateBlockResponse(reason: string): Response {
  return new Response(
    JSON.stringify({
      error: 'Access denied',
      message: 'This request has been blocked for security reasons',
      code: 'SECURITY_BLOCK',
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        'X-Block-Reason': reason,
      },
    }
  );
}

/**
 * Valida una entrada para prevenir inyecciones
 * @param input - Entrada a validar
 * @returns true si la entrada es segura, false en caso contrario
 */
export function validateInput(input: string): boolean {
  if (!input) return true;
  
  // Detectar patrones de inyección SQL
  const sqlInjectionPattern = /(\b(select|insert|update|delete|drop|alter|union|exec|declare|script)\b.*\b(from|into|table|database|values)\b)|('--|\b(or|and)\b\s+\d+=\d+|\/\*|\*\/|;\s*$)/i;
  if (sqlInjectionPattern.test(input)) {
    return false;
  }
  
  // Detectar patrones de inyección NoSQL
  const noSqlInjectionPattern = /(\{\s*\$where\s*:|\{\s*\$regex\s*:|\{\s*\$ne\s*:|\{\s*\$gt\s*:|\{\s*\$lt\s*:)/i;
  if (noSqlInjectionPattern.test(input)) {
    return false;
  }
  
  // Detectar patrones de inyección de comandos
  const commandInjectionPattern = /(\||;|&|`|\$\(|\$\{|\/bin\/|\/etc\/|\/tmp\/|\.\.\/)/i;
  if (commandInjectionPattern.test(input)) {
    return false;
  }
  
  // Detectar patrones de XSS
  const xssPattern = /(<script|javascript:|onerror=|onload=|eval\(|setTimeout\(|setInterval\(|new\s+Function\(|document\.cookie|document\.write|window\.location)/i;
  if (xssPattern.test(input)) {
    return false;
  }
  
  return true;
}

/**
 * Sanitiza una entrada para prevenir inyecciones
 * @param input - Entrada a sanitizar
 * @returns Entrada sanitizada
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Reemplazar caracteres peligrosos
  return input
    .replace(/[&<>"']/g, (match) => {
      switch (match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return match;
      }
    })
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/eval\(/gi, '')
    .replace(/setTimeout\(/gi, '')
    .replace(/setInterval\(/gi, '')
    .replace(/new\s+Function\(/gi, '');
}
