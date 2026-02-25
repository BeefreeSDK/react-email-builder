import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import devServer from 'rollup-plugin-serve'
import livereload from "rollup-plugin-livereload";
import dts from 'rollup-plugin-dts'
import pkg from './package.json' with { type: 'json' }
import terser from '@rollup/plugin-terser'
import dotenv from 'dotenv'

const production = !process.env.ROLLUP_WATCH;

// Load .env at config time so all process.env.* references are replaced in the example bundle
dotenv.config()

const exampleEnvReplacements = Object.fromEntries(
  [
    'EMAIL_BUILDER_CLIENT_ID', 'EMAIL_BUILDER_CLIENT_SECRET', 'EMAIL_BUILDER_USER_ID',
    'PAGE_BUILDER_CLIENT_ID', 'PAGE_BUILDER_CLIENT_SECRET', 'PAGE_BUILDER_USER_ID',
    'POPUP_BUILDER_CLIENT_ID', 'POPUP_BUILDER_CLIENT_SECRET', 'POPUP_BUILDER_USER_ID',
    'FILE_MANAGER_CLIENT_ID', 'FILE_MANAGER_CLIENT_SECRET', 'FILE_MANAGER_USER_ID',
  ].map(key => [`process.env.${key}`, JSON.stringify(process.env[key] ?? '')])
)

const commonPlugins = [
  replace({
    preventAssignment: true,
    'process.env.NPM_PACKAGE_NAME': `'${pkg.name}'`,
    'process.env.NPM_PACKAGE_VERSION': `'${pkg.version}'`,
  }),
  nodeResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }),
  commonjs(),
  babel({
    babelHelpers: production ? 'runtime' : 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    presets: [
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript'
    ],
    plugins: production ? ["@babel/plugin-transform-runtime"] : []
  }),
]

const distConfig = {
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    sourcemap: !production,
    name: 'index',
    format: 'cjs',
  }, {
    file: 'dist/index.es.js',
    sourcemap: !production,
    name: 'index',
    format: 'es',
  }],
  external: [/@babel\/runtime/, 'react', 'react/jsx-runtime', '@beefree.io/sdk'],
  plugins: [
    ...commonPlugins,
    terser({
      ecma: 2015,
      mangle: { toplevel: true },
      compress: {
        module: true,
        toplevel: true,
        unsafe_arrows: true,
        drop_debugger: true,
        drop_console: process.env.LOG_ENABLED !== 'enabled'
      },
      output: { comments: false },
    }),
  ]
}

const typesConfig = {
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.d.ts',
    format: 'es'
  }],
  plugins: [dts()]
}

const exampleConfig = {
  input: 'example/index.tsx',
  output: {
    file: 'example/index.js',
    sourcemap: true,
    name: 'example',
    format: 'iife',
  },
  plugins: [
    json(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      ...exampleEnvReplacements,
    }),
    ...commonPlugins,
    ...(!production ? [
      devServer({
        open: false,
        contentBase: ['example'],
        host: 'localhost',
        port: 3000
      }),
      livereload(['dist', 'example/index.js']),
    ] : [])
  ]
}

export default [
  distConfig,
  typesConfig,
  ...production ? [] : [exampleConfig],
]
