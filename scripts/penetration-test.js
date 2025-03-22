#!/usr/bin/env node

/**
 * Script para pruebas de penetración automatizadas
 * 
 * Este script configura y ejecuta pruebas de penetración básicas utilizando OWASP ZAP.
 * Permite identificar vulnerabilidades comunes como:
 * - Inyección SQL
 * - Cross-Site Scripting (XSS)
 * - Cross-Site Request Forgery (CSRF)
 * - Vulnerabilidades de autenticación
 * - Problemas de configuración de seguridad
 * 
 * Requisitos:
 * - Docker instalado (para ejecutar ZAP en un contenedor)
 * - Node.js 14+
 * 
 * Uso:
 * node scripts/penetration-test.js [--target=URL] [--report=FILENAME] [--level=LEVEL]
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

// Configuración por defecto
const DEFAULT_CONFIG = {
  target: 'http://localhost:3000', // URL de la aplicación local
  reportDir: path.join(process.cwd(), 'security-reports'),
  reportFile: `zap-report-${new Date().toISOString().replace(/:/g, '-')}.html`,
  level: 'low', // Nivel de escaneo: low, medium, high
  duration: 1, // Duración del escaneo en minutos (para escaneo rápido)
  zapDockerImage: 'owasp/zap2docker-stable',
  zapApiKey: 'zapbot-api-key', // Clave API para ZAP
  endpoints: [
    '/',
    '/admin',
    '/api/example'
  ]
};

// Analizar argumentos de línea de comandos
const args = process.argv.slice(2);
const targetArg = args.find(arg => arg.startsWith('--target='))?.split('=')[1];
const reportArg = args.find(arg => arg.startsWith('--report='))?.split('=')[1];
const levelArg = args.find(arg => arg.startsWith('--level='))?.split('=')[1];

// Configuración final
const config = {
  ...DEFAULT_CONFIG,
  target: targetArg || DEFAULT_CONFIG.target,
  reportFile: reportArg || DEFAULT_CONFIG.reportFile,
  level: levelArg || DEFAULT_CONFIG.level
};

// Crear interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Función principal
 */
async function main() {
  console.log(chalk.blue.bold('🔒 Pruebas de Penetración Automatizadas'));
  console.log(chalk.blue('======================================='));
  
  // Verificar requisitos
  await checkRequirements();
  
  // Crear directorio de reportes si no existe
  if (!fs.existsSync(config.reportDir)) {
    fs.mkdirSync(config.reportDir, { recursive: true });
  }
  
  // Mostrar configuración
  console.log(chalk.yellow('\nConfiguración:'));
  console.log(`Target URL: ${config.target}`);
  console.log(`Nivel de escaneo: ${config.level}`);
  console.log(`Reporte: ${path.join(config.reportDir, config.reportFile)}`);
  
  // Confirmar ejecución
  const answer = await question(chalk.yellow('\n⚠️ Las pruebas de penetración pueden generar tráfico significativo y potencialmente afectar el rendimiento de la aplicación. ¿Deseas continuar? (s/n): '));
  
  if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'si' && answer.toLowerCase() !== 'sí') {
    console.log('Operación cancelada.');
    rl.close();
    return;
  }
  
  try {
    // Iniciar servidor de desarrollo si es local
    let serverProcess = null;
    if (config.target.includes('localhost') || config.target.includes('127.0.0.1')) {
      console.log(chalk.yellow('\nIniciando servidor de desarrollo...'));
      serverProcess = await startDevServer();
      
      // Esperar a que el servidor esté listo
      console.log('Esperando a que el servidor esté listo...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // Ejecutar pruebas de penetración
    await runPenetrationTests();
    
    // Detener servidor si se inició
    if (serverProcess) {
      console.log(chalk.yellow('\nDeteniendo servidor de desarrollo...'));
      serverProcess.kill();
    }
    
    console.log(chalk.green('\n✅ Pruebas de penetración completadas.'));
    console.log(chalk.blue(`Reporte generado en: ${path.join(config.reportDir, config.reportFile)}`));
  } catch (error) {
    console.error(chalk.red('\n❌ Error durante las pruebas de penetración:'), error);
  } finally {
    rl.close();
  }
}

/**
 * Verificar requisitos
 */
async function checkRequirements() {
  console.log(chalk.yellow('\nVerificando requisitos...'));
  
  // Verificar Docker
  try {
    execSync('docker --version', { stdio: 'pipe' });
    console.log(chalk.green('✅ Docker está instalado.'));
  } catch (error) {
    console.error(chalk.red('❌ Docker no está instalado o no está en el PATH.'));
    console.log('Por favor, instala Docker para continuar: https://docs.docker.com/get-docker/');
    process.exit(1);
  }
  
  // Verificar si la imagen de ZAP está disponible
  try {
    console.log('Verificando imagen de OWASP ZAP...');
    execSync(`docker image inspect ${config.zapDockerImage}`, { stdio: 'pipe' });
    console.log(chalk.green(`✅ Imagen de OWASP ZAP (${config.zapDockerImage}) está disponible.`));
  } catch (error) {
    console.log(chalk.yellow(`⚠️ Imagen de OWASP ZAP (${config.zapDockerImage}) no encontrada. Descargando...`));
    try {
      execSync(`docker pull ${config.zapDockerImage}`, { stdio: 'inherit' });
      console.log(chalk.green('✅ Imagen de OWASP ZAP descargada correctamente.'));
    } catch (pullError) {
      console.error(chalk.red('❌ Error al descargar la imagen de OWASP ZAP:'), pullError.message);
      process.exit(1);
    }
  }
}

/**
 * Iniciar servidor de desarrollo
 */
async function startDevServer() {
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      detached: true
    });
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(chalk.gray(output));
      
      // Detectar cuando el servidor está listo
      if (output.includes('ready') || output.includes('started')) {
        resolve(serverProcess);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(chalk.red(data.toString()));
    });
    
    serverProcess.on('error', (error) => {
      reject(error);
    });
    
    // Timeout para evitar esperar indefinidamente
    setTimeout(() => {
      resolve(serverProcess);
    }, 15000);
  });
}

/**
 * Ejecutar pruebas de penetración con OWASP ZAP
 */
async function runPenetrationTests() {
  console.log(chalk.yellow('\nIniciando pruebas de penetración con OWASP ZAP...'));
  
  // Configurar opciones según el nivel
  let scanOptions = '';
  switch (config.level) {
    case 'high':
      scanOptions = '-j -T 60 -m 10';
      break;
    case 'medium':
      scanOptions = '-j -T 30 -m 5';
      break;
    case 'low':
    default:
      scanOptions = '-j -T 15 -m 2';
      break;
  }
  
  // Crear comando Docker para ZAP
  const reportPath = path.join(config.reportDir, config.reportFile);
  const zapCommand = `docker run --rm -v "${config.reportDir}:/zap/wrk/:rw" -t ${config.zapDockerImage} zap-baseline.py -t ${config.target} -g gen.conf -r "${config.reportFile}" ${scanOptions}`;
  
  console.log(chalk.gray(`Ejecutando: ${zapCommand}`));
  
  try {
    // Ejecutar ZAP
    console.log(chalk.yellow('\nEjecutando escaneo básico...'));
    console.log(chalk.gray('Esto puede tomar varios minutos dependiendo del nivel de escaneo.'));
    
    execSync(zapCommand, { stdio: 'inherit' });
    
    // Verificar si se generó el reporte
    if (fs.existsSync(reportPath)) {
      console.log(chalk.green('\n✅ Escaneo básico completado.'));
      
      // Analizar resultados
      analyzeResults(reportPath);
    } else {
      console.error(chalk.red('\n❌ No se generó el reporte de escaneo.'));
    }
    
    // Ejecutar escaneo activo para endpoints específicos si el nivel es medium o high
    if (config.level === 'medium' || config.level === 'high') {
      console.log(chalk.yellow('\nEjecutando escaneo activo en endpoints específicos...'));
      
      for (const endpoint of config.endpoints) {
        const targetUrl = `${config.target}${endpoint}`;
        console.log(chalk.gray(`Escaneando: ${targetUrl}`));
        
        const activeReportFile = `active-${endpoint.replace(/\//g, '-')}-${config.reportFile}`;
        const activeReportPath = path.join(config.reportDir, activeReportFile);
        
        const activeZapCommand = `docker run --rm -v "${config.reportDir}:/zap/wrk/:rw" -t ${config.zapDockerImage} zap-full-scan.py -t ${targetUrl} -g gen.conf -r "${activeReportFile}" ${scanOptions}`;
        
        try {
          execSync(activeZapCommand, { stdio: 'inherit' });
          
          if (fs.existsSync(activeReportPath)) {
            console.log(chalk.green(`✅ Escaneo activo completado para ${endpoint}`));
          }
        } catch (activeError) {
          console.error(chalk.red(`❌ Error en escaneo activo para ${endpoint}:`), activeError.message);
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error durante el escaneo:'), error.message);
    throw error;
  }
}

/**
 * Analizar resultados del escaneo
 */
function analyzeResults(reportPath) {
  console.log(chalk.yellow('\nAnalizando resultados...'));
  
  // En un entorno real, aquí se analizaría el contenido del reporte HTML o XML
  // Para simplificar, solo verificamos si el archivo existe
  
  if (fs.existsSync(reportPath)) {
    const reportSize = fs.statSync(reportPath).size;
    console.log(`Tamaño del reporte: ${(reportSize / 1024).toFixed(2)} KB`);
    
    // Mostrar instrucciones para revisar el reporte
    console.log(chalk.yellow('\nPara revisar el reporte completo:'));
    console.log(`1. Abre el archivo: ${reportPath}`);
    console.log('2. Busca las secciones "Alerts" para ver las vulnerabilidades detectadas');
    console.log('3. Prioriza la corrección de vulnerabilidades según su severidad (High, Medium, Low)');
  }
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
  console.error(chalk.red('Error fatal:'), error);
  rl.close();
  process.exit(1);
});
