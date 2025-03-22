/**
 * Validador de variables de entorno
 * Este script verifica que todas las variables de entorno requeridas estén definidas
 */

// Lista de variables de entorno requeridas
const requiredEnvVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    isPublic: true,
    description: 'URL de Supabase'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    isPublic: true,
    description: 'Clave anónima de Supabase'
  },
  {
    name: 'GITHUB_PERSONAL_ACCESS_TOKEN',
    required: false,
    isPublic: false,
    description: 'Token de acceso personal de GitHub para MCP'
  }
];

/**
 * Valida que todas las variables de entorno requeridas estén definidas
 * @returns {boolean} true si todas las variables requeridas están definidas, false en caso contrario
 */
export function validateEnv() {
  let isValid = true;
  const missingVars = [];

  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar.name];
    if (envVar.required && (!value || value.trim() === '')) {
      isValid = false;
      missingVars.push(`${envVar.name} (${envVar.description})`);
    }
  });

  if (!isValid) {
    console.error('❌ Error: Faltan variables de entorno requeridas:');
    missingVars.forEach(variable => {
      console.error(`  - ${variable}`);
    });
    console.error('\nPor favor, verifica tu archivo .env.local y asegúrate de que todas las variables requeridas estén definidas.');
  } else {
    console.log('✅ Todas las variables de entorno requeridas están definidas.');
    
    // Advertencia sobre variables públicas
    const publicVars = requiredEnvVars.filter(v => v.isPublic);
    if (publicVars.length > 0) {
      console.warn('⚠️ Advertencia: Las siguientes variables son públicas y estarán disponibles en el cliente:');
      publicVars.forEach(v => {
        console.warn(`  - ${v.name}`);
      });
      console.warn('Asegúrate de que no contengan información sensible.');
    }
  }

  return isValid;
}
