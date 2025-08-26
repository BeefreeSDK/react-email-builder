import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json' with { type: 'json' }


export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    }, {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [/@babel\/runtime/],
  plugins: [
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
}
