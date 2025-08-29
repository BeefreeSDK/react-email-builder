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
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }),
  commonjs(),
  babel({
    babelHelpers: production ? 'runtime' : 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
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
  external: [/@babel\/runtime/, ...(production ? ['react', '@beefree.io/sdk'] : [])],
  plugins: [...commonPlugins, ]
}

const exampleConfig = {
  input: 'example/index.tsx',
  output: {
    file: 'example/index.js',
    sourcemap: true,
    name: 'example',
    format: 'iife',
  },
  external: [/@babel\/runtime/],
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
  ...production ? [] : [exampleConfig],
]
