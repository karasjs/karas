const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    'index': './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/'),
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      }
    ]
  },
  plugins: [
  ]
};
