import babel from 'rollup-plugin-babel';
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
      runtimeHelpers: true
    }),
    json(),
    glslify(),
  ],
}];
