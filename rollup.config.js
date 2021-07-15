import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import glslify from 'rollup-plugin-glslify';
import json from '@rollup/plugin-json';

export default [{
  input: 'src/index.js',
  output: {
    name: 'karas',
    file: 'index.umd.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      runtimeHelpers: true
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
      runtimeHelpers: true
    }),
    json(),
    glslify(),
  ],
}, {
  input: 'src/index.js',
  output: {
    name: 'karas',
    file: 'index.umd.min.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    uglify({
      sourcemap: true,
    }),
    json(),
    glslify(),
  ],
}];
