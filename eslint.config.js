/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */
const path = require('path')
const typescriptParser = require('@typescript-eslint/parser')
const globals = require('globals')
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin')
const stylisticPlugin = require('@stylistic/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const importPlugin = require('eslint-plugin-import')
const reactHooksPlugin = require('eslint-plugin-react-hooks')

const eslintConfig = [{
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      project: path.resolve(__dirname, './tsconfig.eslint.json'),
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
  files: ['src/**/*.[jt]s*(x)', '*.config.[jt]s', '.storybook/**/*.[jt]s*(x)'],
  rules: {
    ...stylisticPlugin.configs['recommended-extends'].rules,
    ...typescriptEslintPlugin.configs['eslint-recommended'].rules,
    ...typescriptEslintPlugin.configs.recommended.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
  },
}]

module.exports = eslintConfig
