import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
  // 基础 ESLint 配置
  eslint.configs.recommended,

  // TypeScript 配置
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        defineProps: 'readonly',
        defineEmits: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      vue: vuePlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },

  // Vue 配置
  {
    files: ['**/*.vue'],
    rules: {
      ...vuePlugin.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off'
    }
  },

  // Prettier 集成配置
  prettierPlugin,
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'none',
          tabWidth: 2,
          printWidth: 100,
          bracketSpacing: true,
          arrowParens: 'avoid',
          endOfLine: 'auto'
        }
      ]
    }
  }
]
