import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import devServer from 'rollup-plugin-serve'
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json' with { type: 'json' }

const production = !process.env.ROLLUP_WATCH;

const commonPlugins = [
  // peerDepsExternal(), // TODO: commented for now, check if needed
  nodeResolve({
    extensions: ['.ts', '.tsx']
  }),
  commonjs(),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
    extensions: ['.ts', '.tsx'],
    presets: ['@babel/preset-react', '@babel/preset-typescript']
  }),
]

const distConfig = {
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    sourcemap: false,
    name: 'index',
    format: 'cjs',
  }, {
    file: 'dist/index.es.js',
    sourcemap: false,
    name: 'index',
    format: 'es',
  }],
  external: [/@babel\/runtime/, production && 'react'],
  plugins: [...commonPlugins]
}

const exampleConfig = {
  input: 'example/index.tsx',
  output: {
    file: 'example/index.js',
    sourcemap: true,
    name: 'example',
    format: 'iife'
  },
  external: [/@babel\/runtime/, production && 'react'],
  plugins: [
    ...commonPlugins,
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      preventAssignment: true
    }),
    devServer({
      open: false,
      contentBase: ['example'],
      host: 'localhost',
      port: 3003
    })
  ]
}

export default [
  distConfig,
  !production && exampleConfig,
]