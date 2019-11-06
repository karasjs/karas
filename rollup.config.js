import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

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
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    uglify({
      sourcemap: true,
    }),
  ],
}];
