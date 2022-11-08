const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    square: { import: './src/utils/square.ts', filename: 'utils/square.js' }
  },
  devtool: 'eval-source-map',
  devServer: {
    static: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js|tsx|ts)$/,
        use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    library: 'croChess',
    libraryTarget: 'umd',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  }
};
