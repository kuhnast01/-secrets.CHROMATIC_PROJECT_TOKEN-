import * as espree from 'espree';
// ESLint flat config for ESLint v9+
// Top-tier, industry-grade rules for accessibility, i18n, error handling, and maintainability
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import i18nextPlugin from 'eslint-plugin-i18next';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  js.configs.recommended,
  // TypeScript rules (flat config style)
  // TS/TSX: Only match .ts/.tsx, never .js/.jsx
  // TypeScript rules for each package (flat config style)
  // models
  {
    files: ['packages/models/src/**/*.ts', 'packages/models/src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './packages/models/tsconfig.eslint.json',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-deprecated': 'off',
    },
  },
  // api
  {
    files: ['packages/api/src/**/*.ts', 'packages/api/src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './packages/api/tsconfig.eslint.json',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['strict-type-checked'].rules,
    },
  },
  // ui
  {
    files: ['packages/ui/src/**/*.ts', 'packages/ui/src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './packages/ui/tsconfig.eslint.json',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['strict-type-checked'].rules,
    },
  },
  // apps
  {
    files: ['apps/*/src/**/*.ts', 'apps/*/src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['strict-type-checked'].rules,
    },
  },
  // backend
  {
    files: ['backend/src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [__dirname + '/backend/tsconfig.json'],
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'off',
      'no-useless-assignment': 'warn',
      'preserve-caught-error': 'off',
    },
  },
  {
    files: ['backend/src/poseidon/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-useless-assignment': 'off',
    },
  },
  // JS/JSX: Only match .js/.jsx, never .ts/.tsx
  {
    files: ['apps/*/src/**/*.js', 'apps/*/src/**/*.jsx', 'packages/*/src/**/*.js', 'packages/*/src/**/*.jsx'],
    languageOptions: {
      parser: espree,
    },
  },

  // Flat config ignores (replace .eslintignore)
  {
    ignores: [
      '**/dist/**',
      '**/*.d.ts',
      'coverage/**',
      'node_modules/**',
    ],
  },
  // React, React Hooks, and JSX A11y rules are included below in the main config block.
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      i18next: i18nextPlugin,
      '@typescript-eslint': tseslint,
    },
    files: ['apps/admin-dashboard/src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [__dirname + '/apps/admin-dashboard/tsconfig.json'],
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React/JSX accessibility
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/label-has-associated-control': 'error',
      // i18n
      'i18next/no-literal-string': ['warn', { markupOnly: true, ignoreAttribute: ['data-testid', 'id', 'key'] }],
      // Error handling
      'no-throw-literal': 'error',
      'no-useless-catch': 'error',
      'consistent-return': 'error',
      // TypeScript strictness
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      // React/TS best practices
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      // General best practices
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true, 'avoidEscape': true }],
      'jsx-quotes': ['error', 'prefer-double'],
      'indent': ['error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['JSXElement *', 'JSXElement'] }],
      'react/jsx-curly-brace-presence': ['warn', { 'props': 'never', 'children': 'never' }],
      'react/jsx-indent': ['warn', 2],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];