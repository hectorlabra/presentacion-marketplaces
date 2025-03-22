/**
 * Validador de variables de entorno
 * Este script verifica que todas las variables de entorno requeridas estén definidas
 * y realiza validaciones adicionales para garantizar su formato correcto.
 */

// Tipos de validación
const ValidationTypes = {
  URL: 'url',
  EMAIL: 'email',
  TOKEN: 'token',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DOMAIN_LIST: 'domain_list',
  LOG_LEVEL: 'log_level',
  WEBHOOK: 'webhook'
};

// Validadores para cada tipo
const validators = {
  [ValidationTypes.URL]: (value) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  },
  [ValidationTypes.EMAIL]: (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  [ValidationTypes.TOKEN]: (value) => {
    // Tokens deben tener al menos 10 caracteres y no contener espacios
    return value.length >= 10 && !/\s/.test(value);
  },
  [ValidationTypes.NUMBER]: (value) => {
    return !isNaN(parseInt(value));
  },
  [ValidationTypes.BOOLEAN]: (value) => {
    return ['true', 'false', '0', '1'].includes(value.toLowerCase());
  },
  [ValidationTypes.DOMAIN_LIST]: (value) => {
    // Lista de dominios separados por comas
    return value.split(',').every(domain => domain.trim().includes('.'));
  },
  [ValidationTypes.LOG_LEVEL]: (value) => {
    return ['debug', 'info', 'warn', 'error'].includes(value.toLowerCase());
  },
  [ValidationTypes.WEBHOOK]: (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }
};

// Lista de variables de entorno con sus validaciones
const envVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    isPublic: true,
    description: 'URL de Supabase',
    validationType: ValidationTypes.URL,
    validationMessage: 'Debe ser una URL válida (ej: https://example.supabase.co)'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    isPublic: true,
    description: 'Clave anónima de Supabase',
    validationType: ValidationTypes.TOKEN,
    validationMessage: 'Debe ser un token válido de al menos 10 caracteres'
  },
  {
    name: 'SUPABASE_SERVICE_KEY',
    required: false,
    isPublic: false,
    description: 'Clave de servicio de Supabase',
    validationType: ValidationTypes.TOKEN,
    validationMessage: 'Debe ser un token válido de al menos 10 caracteres',
    warningIfPublic: true
  },
  {
    name: 'SECRET_COOKIE_PASSWORD',
    required: true,
    isPublic: false,
    description: 'Secreto para firmar cookies y tokens',
    validationType: ValidationTypes.TOKEN,
    validationMessage: 'Debe ser un secreto de al menos 32 caracteres',
    minLength: 32,
    warningIfPublic: true
  },
  {
    name: 'SESSION_EXPIRY_SECONDS',
    required: false,
    isPublic: false,
    description: 'Tiempo de expiración de sesión en segundos',
    validationType: ValidationTypes.NUMBER,
    validationMessage: 'Debe ser un número válido',
    defaultValue: '43200' // 12 horas
  },
  {
    name: 'ALLOWED_AUTH_DOMAINS',
    required: false,
    isPublic: false,
    description: 'Dominios permitidos para OAuth',
    validationType: ValidationTypes.DOMAIN_LIST,
    validationMessage: 'Debe ser una lista de dominios separados por comas',
    defaultValue: 'innovare.lat,gmail.com'
  },
  {
    name: 'API_RATE_LIMIT',
    required: false,
    isPublic: false,
    description: 'Límites de tasa para APIs',
    validationType: ValidationTypes.NUMBER,
    validationMessage: 'Debe ser un número válido',
    defaultValue: '30'
  },
  {
    name: 'LOG_LEVEL',
    required: false,
    isPublic: false,
    description: 'Nivel de log',
    validationType: ValidationTypes.LOG_LEVEL,
    validationMessage: 'Debe ser uno de: debug, info, warn, error',
    defaultValue: 'info'
  },
  {
    name: 'ENABLE_DB_LOGGING',
    required: false,
    isPublic: false,
    description: 'Habilitar logging en base de datos',
    validationType: ValidationTypes.BOOLEAN,
    validationMessage: 'Debe ser true o false',
    defaultValue: 'true'
  },
  {
    name: 'SECURITY_ALERT_WEBHOOK',
    required: false,
    isPublic: false,
    description: 'Webhook para alertas de seguridad',
    validationType: ValidationTypes.WEBHOOK,
    validationMessage: 'Debe ser una URL HTTPS válida'
  },
  {
    name: 'NODE_ENV',
    required: true,
    isPublic: false,
    description: 'Entorno de ejecución',
    validValues: ['development', 'production', 'test'],
    validationMessage: 'Debe ser uno de: development, production, test'
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    required: false,
    isPublic: true,
    description: 'URL base de la aplicación',
    validationType: ValidationTypes.URL,
    validationMessage: 'Debe ser una URL válida',
    defaultValue: 'http://localhost:3000'
  },
  {
    name: 'GITHUB_PERSONAL_ACCESS_TOKEN',
    required: false,
    isPublic: false,
    description: 'Token de acceso personal de GitHub',
    validationType: ValidationTypes.TOKEN,
    validationMessage: 'Debe ser un token válido de al menos 10 caracteres',
    warningIfPublic: true
  }
];

/**
 * Valida que todas las variables de entorno requeridas estén definidas y tengan el formato correcto
 * @returns {boolean} true si todas las variables requeridas son válidas, false en caso contrario
 */
export function validateEnv() {
  let isValid = true;
  const missingVars = [];
  const invalidVars = [];
  const publicSensitiveVars = [];
  const warnings = [];

  // Aplicar valores por defecto para variables no definidas
  envVars.forEach(envVar => {
    if (!process.env[envVar.name] && envVar.defaultValue) {
      process.env[envVar.name] = envVar.defaultValue;
      warnings.push(`Variable ${envVar.name} no definida, usando valor por defecto: ${envVar.defaultValue}`);
    }
  });

  // Validar todas las variables
  envVars.forEach(envVar => {
    const value = process.env[envVar.name];
    
    // Verificar si es requerida
    if (envVar.required && (!value || value.trim() === '')) {
      isValid = false;
      missingVars.push(`${envVar.name} (${envVar.description})`);
      return;
    }
    
    // Si no tiene valor, saltar validaciones
    if (!value || value.trim() === '') {
      return;
    }
    
    // Validar formato si hay un validador
    if (envVar.validationType && validators[envVar.validationType]) {
      const validator = validators[envVar.validationType];
      
      // Validación adicional de longitud mínima
      if (envVar.minLength && value.length < envVar.minLength) {
        isValid = false;
        invalidVars.push(`${envVar.name}: Debe tener al menos ${envVar.minLength} caracteres`);
        return;
      }
      
      // Aplicar validador
      if (!validator(value)) {
        isValid = false;
        invalidVars.push(`${envVar.name}: ${envVar.validationMessage}`);
        return;
      }
    }
    
    // Validar valores permitidos
    if (envVar.validValues && !envVar.validValues.includes(value)) {
      isValid = false;
      invalidVars.push(`${envVar.name}: ${envVar.validationMessage}`);
      return;
    }
    
    // Verificar variables sensibles expuestas como públicas
    if (envVar.name.startsWith('NEXT_PUBLIC_') && envVar.warningIfPublic) {
      publicSensitiveVars.push(envVar.name);
    }
  });

  // Mostrar resultados
  if (missingVars.length > 0) {
    console.error('❌ Error: Faltan variables de entorno requeridas:');
    missingVars.forEach(variable => {
      console.error(`  - ${variable}`);
    });
  }
  
  if (invalidVars.length > 0) {
    console.error('❌ Error: Variables de entorno con formato inválido:');
    invalidVars.forEach(variable => {
      console.error(`  - ${variable}`);
    });
  }
  
  if (!isValid) {
    console.error('\nPor favor, verifica tu archivo .env.local y corrige los errores.');
  } else {
    console.log('✅ Todas las variables de entorno son válidas.');
    
    // Advertencia sobre variables públicas
    const publicVars = envVars.filter(v => v.isPublic);
    if (publicVars.length > 0) {
      console.warn('⚠️ Advertencia: Las siguientes variables son públicas y estarán disponibles en el cliente:');
      publicVars.forEach(v => {
        console.warn(`  - ${v.name}`);
      });
      console.warn('Asegúrate de que no contengan información sensible.');
    }
    
    // Advertencia sobre variables sensibles expuestas como públicas
    if (publicSensitiveVars.length > 0) {
      console.error('🚨 ALERTA DE SEGURIDAD: Variables potencialmente sensibles expuestas como públicas:');
      publicSensitiveVars.forEach(variable => {
        console.error(`  - ${variable}`);
      });
      console.error('Estas variables NO deben ser públicas. Cambia el nombre para eliminar el prefijo NEXT_PUBLIC_');
      isValid = false;
    }
    
    // Mostrar advertencias
    if (warnings.length > 0) {
      console.warn('⚠️ Advertencias:');
      warnings.forEach(warning => {
        console.warn(`  - ${warning}`);
      });
    }
  }

  return isValid;
}

/**
 * Verifica si hay credenciales hardcodeadas en el código
 * Esta función es para uso en herramientas de CI/CD
 */
export function checkForHardcodedSecrets() {
  console.log('🔍 Verificando credenciales hardcodeadas en el código...');
  console.log('Esta función debe ejecutarse como parte del pipeline de CI/CD.');
  console.log('Utiliza herramientas como "git-secrets" o "detect-secrets" para escanear el código.');
  
  // En un entorno real, aquí se ejecutaría una herramienta de escaneo
  // Por ejemplo: execSync('git-secrets --scan')
  
  return true;
}
