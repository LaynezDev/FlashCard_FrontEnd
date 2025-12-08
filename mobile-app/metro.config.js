// mobile-app/metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Obtiene la configuración base de Expo
const config = getDefaultConfig(__dirname);

// Define la ubicación de la raíz del Monorepo (un nivel arriba de mobile-app)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..'); // Sube a project-brainscape-client/

// 1. Añade los directorios a observar (watchFolders)
config.watchFolders = [workspaceRoot];

// 2. Resuelve los módulos de shared/ (Permite importaciones fuera de node_modules)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Define la fuente (source) de los archivos de TypeScript/JavaScript
// Esto permite que Metro procese archivos desde la carpeta shared/
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  // Añadir las extensiones que uses
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
  'mjs',
];

module.exports = config;