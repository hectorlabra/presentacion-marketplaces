#!/usr/bin/env node

/**
 * Script para la rotación de secretos
 * 
 * Este script ayuda a gestionar y rotar los secretos de la aplicación.
 * Permite:
 * 1. Generar nuevos secretos aleatorios
 * 2. Actualizar los secretos en el archivo .env.local
 * 3. Programar recordatorios para la rotación de secretos
 * 
 * Uso:
 * node scripts/rotate-secrets.js [--force] [--secret=SECRET_NAME]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuración
const ENV_FILE = path.join(process.cwd(), '.env.local');
const BACKUP_DIR = path.join(process.cwd(), '.env-backups');
const LOG_FILE = path.join(process.cwd(), 'secret-rotation.log');

// Definición de secretos y su política de rotación
const SECRETS = [
  {
    name: 'SECRET_COOKIE_PASSWORD',
    description: 'Secreto para firmar cookies y tokens',
    generator: () => crypto.randomBytes(32).toString('base64'),
    rotationPeriodDays: 90, // Rotar cada 90 días
    criticalityLevel: 'HIGH',
  },
  {
    name: 'SUPABASE_SERVICE_KEY',
    description: 'Clave de servicio de Supabase',
    generator: null, // No se puede generar automáticamente, requiere acción manual
    rotationPeriodDays: 180, // Rotar cada 180 días
    criticalityLevel: 'HIGH',
    manualInstructions: 'Visita https://app.supabase.io y genera una nueva clave de servicio'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Clave anónima de Supabase',
    generator: null, // No se puede generar automáticamente, requiere acción manual
    rotationPeriodDays: 365, // Rotar cada 365 días
    criticalityLevel: 'MEDIUM',
    manualInstructions: 'Visita https://app.supabase.io y genera una nueva clave anónima'
  },
  {
    name: 'GITHUB_PERSONAL_ACCESS_TOKEN',
    description: 'Token de acceso personal de GitHub',
    generator: null, // No se puede generar automáticamente, requiere acción manual
    rotationPeriodDays: 90, // Rotar cada 90 días
    criticalityLevel: 'MEDIUM',
    manualInstructions: 'Visita https://github.com/settings/tokens y genera un nuevo token'
  }
];

// Crear interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Analizar argumentos de línea de comandos
const args = process.argv.slice(2);
const forceRotation = args.includes('--force');
const targetSecret = args.find(arg => arg.startsWith('--secret='))?.split('=')[1];

/**
 * Función principal
 */
async function main() {
  console.log('🔄 Sistema de Rotación de Secretos');
  console.log('================================');
  
  // Verificar si existe el archivo .env.local
  if (!fs.existsSync(ENV_FILE)) {
    console.error(`❌ Error: No se encontró el archivo ${ENV_FILE}`);
    console.log('Crea este archivo primero copiando .env.example a .env.local y configurando tus secretos.');
    process.exit(1);
  }
  
  // Crear directorio de backups si no existe
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // Leer archivo .env.local
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  const envLines = envContent.split('\n');
  const envVars = {};
  
  // Parsear variables de entorno
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  // Verificar qué secretos necesitan rotación
  const secretsToRotate = [];
  const secretsInfo = [];
  
  SECRETS.forEach(secret => {
    const lastRotation = getLastRotationDate(secret.name);
    const daysSinceRotation = lastRotation ? 
      Math.floor((Date.now() - lastRotation.getTime()) / (1000 * 60 * 60 * 24)) : 
      null;
    
    const needsRotation = forceRotation || 
      (daysSinceRotation !== null && daysSinceRotation >= secret.rotationPeriodDays) ||
      !envVars[secret.name];
    
    // Si se especificó un secreto específico, solo rotar ese
    if (targetSecret && secret.name !== targetSecret) {
      return;
    }
    
    secretsInfo.push({
      ...secret,
      currentValue: envVars[secret.name] || 'No definido',
      lastRotation: lastRotation ? lastRotation.toISOString().split('T')[0] : 'Nunca',
      daysSinceRotation: daysSinceRotation !== null ? daysSinceRotation : 'N/A',
      needsRotation
    });
    
    if (needsRotation) {
      secretsToRotate.push(secret);
    }
  });
  
  // Mostrar información de secretos
  console.log('\nInformación de Secretos:');
  console.log('----------------------');
  secretsInfo.forEach(info => {
    console.log(`${info.name} (${info.criticalityLevel}):`);
    console.log(`  Descripción: ${info.description}`);
    console.log(`  Última rotación: ${info.lastRotation}`);
    console.log(`  Días desde última rotación: ${info.daysSinceRotation}`);
    console.log(`  Período de rotación: ${info.rotationPeriodDays} días`);
    console.log(`  Necesita rotación: ${info.needsRotation ? '✅ Sí' : '❌ No'}`);
    console.log('');
  });
  
  // Si no hay secretos para rotar, terminar
  if (secretsToRotate.length === 0) {
    console.log('✅ Todos los secretos están actualizados. No se requiere rotación.');
    rl.close();
    return;
  }
  
  // Confirmar rotación
  const answer = await question(`¿Deseas rotar ${secretsToRotate.length} secretos? (s/n): `);
  if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'si' && answer.toLowerCase() !== 'sí') {
    console.log('Operación cancelada.');
    rl.close();
    return;
  }
  
  // Hacer backup del archivo .env.local
  const backupFile = path.join(BACKUP_DIR, `.env.local.backup-${new Date().toISOString().replace(/:/g, '-')}`);
  fs.copyFileSync(ENV_FILE, backupFile);
  console.log(`📦 Backup creado: ${backupFile}`);
  
  // Rotar cada secreto
  const updatedEnvVars = { ...envVars };
  let manualRotationNeeded = false;
  
  for (const secret of secretsToRotate) {
    if (secret.generator) {
      // Generar nuevo secreto automáticamente
      const newValue = secret.generator();
      updatedEnvVars[secret.name] = newValue;
      
      console.log(`🔄 Rotado ${secret.name}`);
      logRotation(secret.name);
    } else {
      // Secreto requiere rotación manual
      manualRotationNeeded = true;
      console.log(`⚠️ ${secret.name} requiere rotación manual:`);
      console.log(`   ${secret.manualInstructions}`);
      
      const newValue = await question(`   Ingresa el nuevo valor para ${secret.name}: `);
      if (newValue.trim()) {
        updatedEnvVars[secret.name] = newValue.trim();
        console.log(`🔄 Rotado ${secret.name}`);
        logRotation(secret.name);
      } else {
        console.log(`⚠️ No se rotó ${secret.name} (valor vacío)`);
      }
    }
  }
  
  // Escribir nuevas variables al archivo .env.local
  let newEnvContent = '';
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && updatedEnvVars[key.trim()] !== undefined) {
        newEnvContent += `${key}=${updatedEnvVars[key.trim()]}\n`;
        delete updatedEnvVars[key.trim()]; // Eliminar para detectar nuevas variables
      } else {
        newEnvContent += `${line}\n`;
      }
    } else {
      newEnvContent += `${line}\n`;
    }
  });
  
  // Agregar nuevas variables que no existían antes
  Object.entries(updatedEnvVars).forEach(([key, value]) => {
    newEnvContent += `${key}=${value}\n`;
  });
  
  // Guardar cambios
  fs.writeFileSync(ENV_FILE, newEnvContent);
  console.log(`✅ Archivo ${ENV_FILE} actualizado con los nuevos secretos.`);
  
  // Instrucciones finales
  if (manualRotationNeeded) {
    console.log('\n⚠️ IMPORTANTE: Algunos secretos requieren pasos adicionales:');
    console.log('1. Actualiza los secretos en los servicios correspondientes (Supabase, GitHub, etc.)');
    console.log('2. Actualiza los secretos en los entornos de producción');
    console.log('3. Reinicia los servicios que dependen de estos secretos');
  }
  
  console.log('\n✅ Rotación de secretos completada.');
  rl.close();
}

/**
 * Obtener la fecha de la última rotación de un secreto
 */
function getLastRotationDate(secretName) {
  if (!fs.existsSync(LOG_FILE)) {
    return null;
  }
  
  const logContent = fs.readFileSync(LOG_FILE, 'utf8');
  const logLines = logContent.split('\n').filter(line => line.includes(secretName));
  
  if (logLines.length === 0) {
    return null;
  }
  
  // Obtener la última entrada de log para este secreto
  const lastLog = logLines[logLines.length - 1];
  const dateMatch = lastLog.match(/\d{4}-\d{2}-\d{2}/);
  
  if (dateMatch) {
    return new Date(dateMatch[0]);
  }
  
  return null;
}

/**
 * Registrar la rotación de un secreto en el log
 */
function logRotation(secretName) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - Rotated ${secretName}\n`;
  
  fs.appendFileSync(LOG_FILE, logEntry);
}

/**
 * Función para hacer preguntas en la consola
 */
function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// Ejecutar función principal
main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
