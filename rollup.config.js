import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  external: [
    'react',
    '@react-pdf/renderer',
    'canvas',
    'pdfjs-dist/es5/build/pdf',
    'buffer',
    'fs/promises',
    'path'
  ],
  output: {
    format: 'cjs',
    file: 'dist/index.js',
    sourcemap: false
  },
  plugins: [
    nodeResolve(),
    copy({
      targets: [{ src: 'src/crop/assembly/code.wasm', dest: 'dist/assembly' }]
    }),
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      extensions: ['js'],
      include: ['src/**/*'],
      presets: ['@babel/preset-react']
    })
  ]
}
