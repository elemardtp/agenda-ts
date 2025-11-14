// Nome do arquivo: ./frontend/craco.config.js
// Finalidade: Configuração do CRACO para o frontend.

import type { Config } from '@craco/craco';  
// Instale @types/craco se precisar: npm i -D @types/craco

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: Config = {
  webpack: {
    configure: (webpackConfig) => {
      if (!webpackConfig.resolve.plugins) {
        webpackConfig.resolve.plugins = [];
      }
      webpackConfig.resolve.plugins.push(
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json'
        })
      );
      return webpackConfig;
    },
  },
};

export default config;
