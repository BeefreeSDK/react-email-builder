import { fileURLToPath } from 'node:url'
import typescriptParser from '@typescript-eslint/parser'
import globals from 'globals'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import stylisticPlugin from '@stylistic/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

const tsconfigPath = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url))


const eslintConfig = [{
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      project: tsconfigPath,
    },
    globals: {
      ...globals.jest,
      ...globals.browser,
      ...globals.node,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    '@stylistic': stylisticPlugin,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    import: importPlugin,
  },
  files: ['src/**/*.[jt]s*(x)', 'example/**/*.[jt]s*(x)', '*.config.[jt]s', '.storybook/**/*.[jt]s*(x)'],
  rules: {
    ...stylisticPlugin.configs.recommended.rules,
    ...typescriptEslintPlugin.configs['eslint-recommended'].rules,
    ...typescriptEslintPlugin.configs.recommended.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    // React 17+ JSX transform: React no longer needs to be in scope
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'import/order': ['warn', {
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling', 'index'],
        'type',
        'unknown',
      ],
      warnOnUnassignedImports: true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
  },
}]

export default eslintConfig
