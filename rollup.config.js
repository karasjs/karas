import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import glslify from 'rollup-plugin-glslify';
import json from '@rollup/plugin-json';

export default [{
  input: 'src/index.js',
  output: {
    name: 'karas',
    file: 'index.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelHelpers: 'bundled',
    }),
    json(),
    glslify(),
  ],
}, {
  input: 'src/index.js',
  output: {
    name: 'karas',
    file: 'index.es.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelHelpers: 'bundled',
    }),
    json(),
    glslify(),
  ],
}, {
  input: 'src/index.js',
  output: {
    name: 'karas',
    file: 'index.min.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelHelpers: 'bundled',
    }),
    terser({
    }),
    json(),
    glslify(),
  ],
}];
