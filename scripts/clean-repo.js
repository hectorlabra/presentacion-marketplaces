#!/usr/bin/env node

/**
 * Script para limpiar archivos sensibles y duplicados del repositorio
 * 
 * Este script:
 * 1. Elimina directorios duplicados
 * 2. Busca posibles credenciales en el código
 * 3. Verifica que los archivos .env no estén en el repositorio
 * 4. Configura git hooks para prevenir commits de archivos sensibles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Directorios a eliminar (rutas relativas desde la raíz del proyecto)
const DIRS_TO_REMOVE = [
  'Documents'
];

// Patrones de archivos sensibles
const SENSITIVE_PATTERNS = [
  'password',
  'secret',
  'token',
  'key',
  'credential',
  'apikey',
  'api_key',
  'auth'
];

// Directorio raíz del proyecto
const ROOT_DIR = path.resolve(__dirname, '..');

console.log(chalk.blue('=== Limpieza de Repositorio ==='));
console.log(chalk.blue('Eliminando archivos sensibles y duplicados...'));

// 1. Eliminar directorios duplicados
function removeDuplicateDirectories() {
  console.log(chalk.yellow('\n=== Eliminando directorios duplicados ==='));
  
  DIRS_TO_REMOVE.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    
    if (fs.existsSync(dirPath)) {
      try {
        console.log(`Eliminando directorio: ${dir}`);
        execSync(`rm -rf "${dirPath}"`);
        console.log(chalk.green(`✓ Directorio eliminado: ${dir}`));
      } catch (error) {
        console.error(chalk.red(`✗ Error al eliminar directorio ${dir}: ${error.message}`));
      }
    } else {
      console.log(`Directorio no encontrado: ${dir}`);
    }
  });
}

// 2. Buscar posibles credenciales en el código
function findPotentialCredentials() {
  console.log(chalk.yellow('\n=== Buscando posibles credenciales en el código ==='));
  
  try {
    const patterns = SENSITIVE_PATTERNS.join('\\|');
    const command = `git grep -i "${patterns}" -- "*.ts" "*.js" "*.json" | grep -v "scripts/clean-repo.js"`;
    
    const result = execSync(command, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
    
    if (result.trim()) {
      console.log(chalk.red('Posibles credenciales encontradas:'));
      console.log(result);
      console.log(chalk.yellow('Revisa estos archivos y asegúrate de que no contengan credenciales reales.'));
    } else {
      console.log(chalk.green('✓ No se encontraron patrones de credenciales en el código.'));
    }
  } catch (error) {
    // Si no hay coincidencias, git grep devuelve un código de error
    if (error.status === 1 && !error.stdout.toString().trim()) {
      console.log(chalk.green('✓ No se encontraron patrones de credenciales en el código.'));
    } else {
      console.error(chalk.red(`✗ Error al buscar credenciales: ${error.message}`));
    }
  }
}

// 3. Verificar archivos .env
function checkEnvFiles() {
  console.log(chalk.yellow('\n=== Verificando archivos .env ==='));
  
  try {
    const result = execSync('git ls-files | grep -E "^\\.env|.env\\."').toString();
    
    if (result.trim()) {
      console.log(chalk.red('Archivos .env en el repositorio:'));
      console.log(result);
      console.log(chalk.yellow('Estos archivos deberían ser eliminados del repositorio y añadidos al .gitignore.'));
      console.log(chalk.yellow('Para eliminarlos del historial de git, ejecuta:'));
      console.log('git filter-branch --force --index-filter \\');
      console.log('"git rm --cached --ignore-unmatch <archivo>" \\');
      console.log('--prune-empty --tag-name-filter cat -- --all');
    } else {
      console.log(chalk.green('✓ No se encontraron archivos .env en el repositorio.'));
    }
  } catch (error) {
    // Si no hay coincidencias, grep devuelve un código de error
    if (error.status === 1 && !error.stdout.toString().trim()) {
      console.log(chalk.green('✓ No se encontraron archivos .env en el repositorio.'));
    } else {
      console.error(chalk.red(`✗ Error al verificar archivos .env: ${error.message}`));
    }
  }
}

// 4. Configurar git hooks
function setupGitHooks() {
  console.log(chalk.yellow('\n=== Configurando git hooks ==='));
  
  const hooksDir = path.join(ROOT_DIR, '.git', 'hooks');
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  
  // Contenido del hook pre-commit
  const preCommitContent = `#!/bin/sh
# Hook de pre-commit para prevenir commits de archivos sensibles

echo "Verificando presencia de tokens o credenciales..."

# Patrones a buscar
PATTERNS="password|secret|token|key|credential|apikey|api_key"

# Archivos a revisar
FILES_PATTERN="\\.(js|ts|json|yml|yaml)$"

# Buscar patrones en los archivos a commitear
git diff --cached --name-only | grep -E "$FILES_PATTERN" | xargs grep -l -i -E "$PATTERNS" 2>/dev/null | while read file; do
  echo "ADVERTENCIA: Posible credencial encontrada en $file"
  echo "Conteniendo el patrón: $(git diff --cached "$file" | grep -E "$PATTERNS" | head -1)"
  echo "Por favor, elimina las credenciales antes de hacer commit."
  exit 1
done

# Si llegamos aquí, no se encontraron credenciales
exit 0
`;

  try {
    fs.writeFileSync(preCommitPath, preCommitContent);
    execSync(`chmod +x "${preCommitPath}"`);
    console.log(chalk.green('✓ Hook pre-commit configurado correctamente.'));
  } catch (error) {
    console.error(chalk.red(`✗ Error al configurar git hooks: ${error.message}`));
  }
}

// Ejecutar todas las funciones
try {
  removeDuplicateDirectories();
  findPotentialCredentials();
  checkEnvFiles();
  setupGitHooks();
  
  console.log(chalk.green('\n=== Limpieza completada ==='));
  console.log('Para completar la limpieza, ejecuta:');
  console.log(chalk.blue('git add .gitignore'));
  console.log(chalk.blue('git commit -m "Actualizar .gitignore para mejorar seguridad"'));
  console.log(chalk.blue('git push'));
} catch (error) {
  console.error(chalk.red(`Error general: ${error.message}`));
  process.exit(1);
}
