// ./frontend/eslint.config.js
  // Configuração do ESLint para o frontend
  import js from '@eslint/js'
  import react from 'eslint-plugin-react'

  export default [
    js.configs.recommended,
    {
      files: ['**/*.{js,ts,tsx}'],
      languageOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        globals: {
          browser: true
        }
      },
      plugins: {
        react
      },
      rules: {
        ...react.configs.recommended.rules
      },
      settings: {
        react: {
          version: '18.2'
        }
      }
    }
  ];
