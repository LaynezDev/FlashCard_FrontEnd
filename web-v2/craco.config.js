// web-v2/craco.config.js

const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1. Agregar el directorio 'shared' al módulo de reglas de carga
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      
      // Remover la restricción de ModuleScopePlugin para permitir importaciones fuera de src
      if (scopePluginIndex !== -1) {
        webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      }

      // 2. Opcional: Configurar alias para '@shared'
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@shared': path.resolve(__dirname, '../shared'),
      };
      
      // 3. Incluir el directorio 'shared' en los loaders (para babel/jsx)
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (oneOfRule) {
        const babelLoader = oneOfRule.oneOf.find(
          rule => rule.loader && rule.loader.includes('babel-loader')
        );

        if (babelLoader) {
          babelLoader.include = [
            babelLoader.include,
            path.resolve(__dirname, '../shared') // ¡Incluye la carpeta 'shared'!
          ];
        }
      }

      return webpackConfig;
    },
  },
};