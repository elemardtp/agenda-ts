// Nome do arquivo: ./frontend/tailwind.config.ts
// Finalidade: Configuração do Tailwind para o frontend.
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ]
};

export default config;
