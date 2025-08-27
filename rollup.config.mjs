import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import devServer from 'rollup-plugin-serve'
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json' with { type: 'json' }

const production = !process.env.ROLLUP_WATCH;

export default {
  input: {
    dist: 'src/index.ts',
    example: 'example/index.tsx',
  },
  output: [
    {
      entryFileNames: '[name]/' + pkg.main,
      dir: './',
      format: 'cjs',
    }, {
      entryFileNames:'[name]/' + pkg.module,
      dir: './',
      format: 'es',
    }
  ],
  external: [/@babel\/runtime/, production && 'react'],
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
    !production && devServer({
      open: true,
      contentBase: ['example'],
      host: 'localhost',
      port: 3000
    })
  ]
}
