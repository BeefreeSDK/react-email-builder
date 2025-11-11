import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import devServer from 'rollup-plugin-serve'
import dotenv from "rollup-plugin-dotenv"
import livereload from "rollup-plugin-livereload";
import dts from 'rollup-plugin-dts'
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';

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
  dotenv()
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
  external: [/@babel\/runtime/, 'react'],
  plugins: [...commonPlugins, ]
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
    ...commonPlugins,
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.SDK_CLIENT_ID': JSON.stringify(process.env.SDK_CLIENT_ID || ''),
      'process.env.SDK_CLIENT_SECRET': JSON.stringify(process.env.SDK_CLIENT_SECRET || ''),
      preventAssignment: true
    }),
    ...(!production ? [
      devServer({
        open: false,
        contentBase: ['example'],
        host: 'localhost',
        port: 3003
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
