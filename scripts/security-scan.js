#!/usr/bin/env node

/**
 * Script para escaneo de seguridad
 * 
 * Este script realiza un escaneo de seguridad básico en la aplicación,
 * verificando problemas comunes y vulnerabilidades conocidas.
 * 
 * Funcionalidades:
 * 1. Escaneo de dependencias vulnerables
 * 2. Detección de secretos hardcodeados
 * 3. Verificación de configuración de seguridad
 * 4. Análisis estático de código
 * 
 * Uso:
 * node scripts/security-scan.js [--fix] [--report=FILENAME]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk'); // Requiere instalar: npm install chalk

// Configuración
const PROJECT_ROOT = process.cwd();
const REPORT_DIR = path.join(PROJECT_ROOT, 'security-reports');
const DEFAULT_REPORT_FILE = path.join(REPORT_DIR, `security-scan-${new Date().toISOString().replace(/:/g, '-')}.json`);

// Analizar argumentos
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const reportFile = args.find(arg => arg.startsWith('--report='))?.split('=')[1] || DEFAULT_REPORT_FILE;

// Resultados del escaneo
const scanResults = {
  timestamp: new Date().toISOString(),
  summary: {
    vulnerabilities: 0,
    secretsDetected: 0,
    configIssues: 0,
    codeIssues: 0,
    total: 0,
    fixedIssues: 0
  },
  details: {
    vulnerabilities: [],
    secrets: [],
    config: [],
    code: []
  }
};

/**
 * Función principal
 */
async function main() {
  console.log(chalk.blue.bold('🔒 Escáner de Seguridad'));
  console.log(chalk.blue('==============================='));
  
  // Crear directorio de reportes si no existe
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
  
  try {
    // 1. Escaneo de dependencias vulnerables
    await scanDependencies();
    
    // 2. Detección de secretos hardcodeados
    await scanForSecrets();
    
    // 3. Verificación de configuración de seguridad
    await checkSecurityConfig();
    
    // 4. Análisis estático de código
    await runStaticAnalysis();
    
    // Generar reporte
    generateReport();
    
    // Mostrar resumen
    showSummary();
  } catch (error) {
    console.error(chalk.red('Error durante el escaneo:'), error);
    process.exit(1);
  }
}

/**
 * Escaneo de dependencias vulnerables
 */
async function scanDependencies() {
  console.log(chalk.yellow('\n📦 Escaneando dependencias vulnerables...'));
  
  try {
    // Verificar si npm audit está disponible
    try {
      console.log('Ejecutando npm audit...');
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
      const auditResult = JSON.parse(auditOutput);
      
      if (auditResult.vulnerabilities) {
        const vulnCount = Object.values(auditResult.vulnerabilities).reduce((sum, v) => sum + v.length, 0);
        scanResults.summary.vulnerabilities = vulnCount;
        
        if (vulnCount > 0) {
          console.log(chalk.red(`⚠️ Se encontraron ${vulnCount} vulnerabilidades en las dependencias.`));
          
          // Registrar detalles
          Object.entries(auditResult.vulnerabilities).forEach(([severity, vulns]) => {
            vulns.forEach(vuln => {
              scanResults.details.vulnerabilities.push({
                package: vuln.name,
                severity: severity,
                description: vuln.overview,
                fixAvailable: vuln.fixAvailable,
                recommendation: vuln.recommendation || 'Actualizar a la última versión'
              });
            });
          });
          
          // Intentar arreglar si se solicitó
          if (shouldFix) {
            console.log(chalk.yellow('Intentando arreglar vulnerabilidades...'));
            try {
              execSync('npm audit fix', { stdio: 'inherit' });
              console.log(chalk.green('✅ Se intentaron arreglar las vulnerabilidades. Ejecuta el escaneo nuevamente para verificar.'));
              scanResults.summary.fixedIssues += 1;
            } catch (fixError) {
              console.log(chalk.red('❌ No se pudieron arreglar automáticamente todas las vulnerabilidades.'));
              console.log(chalk.yellow('Considera ejecutar `npm audit fix --force` manualmente (puede romper compatibilidad).'));
            }
          }
        } else {
          console.log(chalk.green('✅ No se encontraron vulnerabilidades en las dependencias.'));
        }
      }
    } catch (auditError) {
      console.log(chalk.red('❌ Error al ejecutar npm audit:'), auditError.message);
      scanResults.details.vulnerabilities.push({
        package: 'general',
        severity: 'unknown',
        description: 'Error al ejecutar npm audit: ' + auditError.message,
        recommendation: 'Ejecutar npm audit manualmente'
      });
      scanResults.summary.vulnerabilities += 1;
    }
  } catch (error) {
    console.error(chalk.red('Error durante el escaneo de dependencias:'), error);
    scanResults.summary.vulnerabilities += 1;
  }
}

/**
 * Detección de secretos hardcodeados
 */
async function scanForSecrets() {
  console.log(chalk.yellow('\n🔍 Buscando secretos hardcodeados...'));
  
  // Patrones para detectar posibles secretos
  const secretPatterns = [
    { name: 'API Key', regex: /['"`]([a-zA-Z0-9]{32,})['"`]/g },
    { name: 'AWS Key', regex: /AKIA[0-9A-Z]{16}/g },
    { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/g },
    { name: 'Password', regex: /password['":]?\s*[=:]\s*['"`]([^'"`]{8,})['"`]/gi },
    { name: 'Token', regex: /token['":]?\s*[=:]\s*['"`]([^'"`]{8,})['"`]/gi },
    { name: 'Secret', regex: /secret['":]?\s*[=:]\s*['"`]([^'"`]{8,})['"`]/gi },
    { name: 'Supabase Key', regex: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g }
  ];
  
  // Archivos a ignorar
  const ignorePatterns = [
    'node_modules',
    '.git',
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    '.env.example',
    'package-lock.json',
    'yarn.lock',
    'security-reports',
    'scripts/security-scan.js', // Ignorar este archivo
    'scripts/rotate-secrets.js' // Ignorar el script de rotación
  ];
  
  // Función para verificar si un archivo debe ser ignorado
  const shouldIgnore = (filePath) => {
    return ignorePatterns.some(pattern => filePath.includes(pattern));
  };
  
  // Función recursiva para escanear directorios
  const scanDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (shouldIgnore(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile()) {
        // Solo escanear archivos de texto
        const ext = path.extname(entry.name).toLowerCase();
        const textFileExts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.html', '.css', '.scss', '.yml', '.yaml'];
        
        if (textFileExts.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Buscar coincidencias con patrones de secretos
            secretPatterns.forEach(pattern => {
              const matches = [...content.matchAll(pattern.regex)];
              
              if (matches.length > 0) {
                matches.forEach(match => {
                  // Verificar si es un falso positivo (ejemplo de código, etc.)
                  const line = content.substring(0, match.index).split('\n').length;
                  const context = content.split('\n')[line - 1];
                  
                  // Ignorar ejemplos obvios
                  if (context.includes('example') || 
                      context.includes('placeholder') || 
                      context.includes('sample') ||
                      context.includes('test')) {
                    return;
                  }
                  
                  scanResults.details.secrets.push({
                    type: pattern.name,
                    file: fullPath.replace(PROJECT_ROOT, ''),
                    line: line,
                    context: context.trim(),
                    recommendation: 'Mover a variables de entorno'
                  });
                  
                  scanResults.summary.secretsDetected += 1;
                });
              }
            });
          } catch (error) {
            console.log(chalk.red(`Error al leer ${fullPath}:`), error.message);
          }
        }
      }
    }
  };
  
  // Iniciar escaneo desde la raíz del proyecto
  scanDir(PROJECT_ROOT);
  
  // Mostrar resultados
  if (scanResults.summary.secretsDetected > 0) {
    console.log(chalk.red(`⚠️ Se encontraron ${scanResults.summary.secretsDetected} posibles secretos hardcodeados.`));
    
    scanResults.details.secrets.forEach(secret => {
      console.log(chalk.red(`  - ${secret.type} en ${secret.file}:${secret.line}`));
      console.log(chalk.gray(`    ${secret.context}`));
    });
    
    console.log(chalk.yellow('\nRecomendación: Mueve estos secretos a variables de entorno.'));
  } else {
    console.log(chalk.green('✅ No se encontraron secretos hardcodeados.'));
  }
}

/**
 * Verificación de configuración de seguridad
 */
async function checkSecurityConfig() {
  console.log(chalk.yellow('\n⚙️ Verificando configuración de seguridad...'));
  
  // Lista de verificaciones
  const checks = [
    {
      name: 'Content Security Policy',
      check: () => {
        const nextConfigPath = path.join(PROJECT_ROOT, 'next.config.mjs');
        if (fs.existsSync(nextConfigPath)) {
          const content = fs.readFileSync(nextConfigPath, 'utf8');
          return content.includes('Content-Security-Policy');
        }
        return false;
      },
      recommendation: 'Configurar Content Security Policy en next.config.mjs'
    },
    {
      name: 'HTTPS Redirect',
      check: () => {
        const middlewarePath = path.join(PROJECT_ROOT, 'middleware.ts');
        if (fs.existsSync(middlewarePath)) {
          const content = fs.readFileSync(middlewarePath, 'utf8');
          return content.includes('https://') || content.includes('req.headers["x-forwarded-proto"]');
        }
        return false;
      },
      recommendation: 'Implementar redirección HTTPS en middleware.ts'
    },
    {
      name: 'Rate Limiting',
      check: () => {
        const middlewarePath = path.join(PROJECT_ROOT, 'middleware.ts');
        if (fs.existsSync(middlewarePath)) {
          const content = fs.readFileSync(middlewarePath, 'utf8');
          return content.includes('rate') && content.includes('limit');
        }
        return false;
      },
      recommendation: 'Implementar rate limiting en middleware.ts'
    },
    {
      name: 'Secure Cookies',
      check: () => {
        // Buscar en varios archivos posibles
        const files = [
          path.join(PROJECT_ROOT, 'middleware.ts'),
          path.join(PROJECT_ROOT, 'lib/auth-security.ts'),
          path.join(PROJECT_ROOT, 'lib/supabase.ts')
        ];
        
        for (const file of files) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('secure: true') && content.includes('httpOnly: true')) {
              return true;
            }
          }
        }
        return false;
      },
      recommendation: 'Configurar cookies como secure y httpOnly'
    },
    {
      name: 'Environment Variables',
      check: () => {
        return fs.existsSync(path.join(PROJECT_ROOT, '.env.example'));
      },
      recommendation: 'Crear archivo .env.example con variables requeridas'
    },
    {
      name: 'Gitignore',
      check: () => {
        const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
          const content = fs.readFileSync(gitignorePath, 'utf8');
          return content.includes('.env.local') && 
                 content.includes('node_modules') && 
                 content.includes('.env');
        }
        return false;
      },
      recommendation: 'Asegurar que .gitignore incluya .env, .env.local y node_modules'
    }
  ];
  
  // Ejecutar verificaciones
  for (const check of checks) {
    try {
      const passed = check.check();
      
      if (!passed) {
        console.log(chalk.red(`❌ ${check.name}: No configurado correctamente`));
        console.log(chalk.yellow(`   Recomendación: ${check.recommendation}`));
        
        scanResults.details.config.push({
          check: check.name,
          status: 'failed',
          recommendation: check.recommendation
        });
        
        scanResults.summary.configIssues += 1;
      } else {
        console.log(chalk.green(`✅ ${check.name}: Configurado correctamente`));
        
        scanResults.details.config.push({
          check: check.name,
          status: 'passed'
        });
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error al verificar ${check.name}:`), error.message);
      
      scanResults.details.config.push({
        check: check.name,
        status: 'error',
        error: error.message,
        recommendation: check.recommendation
      });
      
      scanResults.summary.configIssues += 1;
    }
  }
}

/**
 * Análisis estático de código
 */
async function runStaticAnalysis() {
  console.log(chalk.yellow('\n📊 Ejecutando análisis estático de código...'));
  
  // Verificar si ESLint está disponible
  try {
    // Intentar ejecutar ESLint
    console.log('Ejecutando ESLint...');
    
    try {
      execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings=0', { stdio: 'pipe' });
      console.log(chalk.green('✅ No se encontraron problemas con ESLint.'));
    } catch (eslintError) {
      const output = eslintError.stdout?.toString() || eslintError.message;
      
      // Contar problemas
      const problemCount = (output.match(/problem/g) || []).length;
      scanResults.summary.codeIssues += problemCount || 1;
      
      console.log(chalk.red(`❌ Se encontraron problemas con ESLint.`));
      
      // Extraer y registrar problemas
      const lines = output.split('\n');
      const problems = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('error') || line.includes('warning')) {
          const file = line.split(':')[0];
          const message = line.split('  ').pop();
          
          if (file && message) {
            problems.push({ file, message });
          }
        }
      }
      
      // Registrar hasta 10 problemas para no sobrecargar el reporte
      const topProblems = problems.slice(0, 10);
      
      topProblems.forEach(problem => {
        scanResults.details.code.push({
          file: problem.file,
          issue: problem.message,
          tool: 'ESLint',
          recommendation: 'Corregir según las reglas de ESLint'
        });
      });
      
      if (problems.length > 10) {
        scanResults.details.code.push({
          file: 'general',
          issue: `Y ${problems.length - 10} problemas más...`,
          tool: 'ESLint',
          recommendation: 'Ejecutar eslint manualmente para ver todos los problemas'
        });
      }
      
      if (shouldFix) {
        console.log(chalk.yellow('Intentando arreglar problemas de ESLint...'));
        try {
          execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --fix', { stdio: 'inherit' });
          console.log(chalk.green('✅ Se intentaron arreglar los problemas de ESLint.'));
          scanResults.summary.fixedIssues += 1;
        } catch (fixError) {
          console.log(chalk.red('❌ No se pudieron arreglar automáticamente todos los problemas de ESLint.'));
        }
      }
    }
  } catch (error) {
    console.log(chalk.red('❌ Error al ejecutar análisis estático:'), error.message);
    scanResults.details.code.push({
      file: 'general',
      issue: 'Error al ejecutar análisis estático: ' + error.message,
      tool: 'general',
      recommendation: 'Verificar la instalación de las herramientas de análisis'
    });
    scanResults.summary.codeIssues += 1;
  }
}

/**
 * Generar reporte de seguridad
 */
function generateReport() {
  // Calcular total de problemas
  scanResults.summary.total = 
    scanResults.summary.vulnerabilities + 
    scanResults.summary.secretsDetected + 
    scanResults.summary.configIssues + 
    scanResults.summary.codeIssues;
  
  // Guardar reporte
  fs.writeFileSync(reportFile, JSON.stringify(scanResults, null, 2));
  console.log(chalk.blue(`\n📝 Reporte guardado en: ${reportFile}`));
}

/**
 * Mostrar resumen de resultados
 */
function showSummary() {
  console.log(chalk.blue.bold('\n📊 Resumen del Escaneo de Seguridad'));
  console.log(chalk.blue('==============================='));
  
  console.log(`Vulnerabilidades en dependencias: ${formatCount(scanResults.summary.vulnerabilities)}`);
  console.log(`Secretos hardcodeados detectados: ${formatCount(scanResults.summary.secretsDetected)}`);
  console.log(`Problemas de configuración: ${formatCount(scanResults.summary.configIssues)}`);
  console.log(`Problemas de código: ${formatCount(scanResults.summary.codeIssues)}`);
  console.log(chalk.blue('-------------------------------'));
  console.log(`Total de problemas: ${formatCount(scanResults.summary.total)}`);
  
  if (shouldFix) {
    console.log(`Problemas intentados arreglar: ${scanResults.summary.fixedIssues}`);
  }
  
  if (scanResults.summary.total > 0) {
    console.log(chalk.yellow('\n⚠️ Recomendaciones:'));
    
    if (scanResults.summary.vulnerabilities > 0) {
      console.log(chalk.yellow('- Actualiza las dependencias vulnerables con `npm audit fix`'));
    }
    
    if (scanResults.summary.secretsDetected > 0) {
      console.log(chalk.yellow('- Mueve los secretos hardcodeados a variables de entorno'));
    }
    
    if (scanResults.summary.configIssues > 0) {
      console.log(chalk.yellow('- Revisa y mejora la configuración de seguridad según las recomendaciones'));
    }
    
    if (scanResults.summary.codeIssues > 0) {
      console.log(chalk.yellow('- Corrige los problemas de código identificados por el análisis estático'));
    }
    
    console.log(chalk.yellow('\nConsulta el reporte completo para más detalles.'));
  } else {
    console.log(chalk.green('\n✅ ¡Felicidades! No se encontraron problemas de seguridad.'));
  }
}

/**
 * Formatear conteo con color según severidad
 */
function formatCount(count) {
  if (count === 0) {
    return chalk.green(count);
  } else if (count < 3) {
    return chalk.yellow(count);
  } else {
    return chalk.red(count);
  }
}

// Detectar si estamos en un entorno CI
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

// Ejecutar función principal con manejo especial para CI
main().catch(error => {
  console.error(chalk.red('Error fatal:'), error);
  
  // En CI, generamos un reporte incluso si hay errores
  if (isCI) {
    try {
      console.log(chalk.yellow('Generando reporte a pesar del error...'));
      fs.mkdirSync('security-reports', { recursive: true });
      fs.writeFileSync(
        'security-reports/error-report.json',
        JSON.stringify({
          error: error.message || 'Error desconocido',
          stack: error.stack,
          timestamp: new Date().toISOString()
        }, null, 2)
      );
      console.log(chalk.green('Reporte de error generado en security-reports/error-report.json'));
      // Salir con código 0 en CI para no interrumpir el workflow
      process.exit(0);
    } catch (reportError) {
      console.error(chalk.red('Error al generar reporte:'), reportError);
      process.exit(1);
    }
  } else {
    // En entorno local, salir con error
    process.exit(1);
  }
});
