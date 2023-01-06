const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    square: { import: './src/utils/square.ts', filename: 'utils/square.js' },
    fen: { import: './src/utils/fen.ts', filename: 'utils/fen.js' },
    moveNotation: {
      import: './src/utils/moveNotation.ts',
      filename: 'utils/moveNotation.js'
    },
    typeCheck: {
      import: './src/utils/typeCheck.ts',
      filename: 'utils/typeCheck.js'
    },
    constants: {
      import: './src/utils/constants.ts',
      filename: 'utils/constants.js'
    },
    pieceMap: {
      import: './src/utils/pieceMap.ts',
      filename: 'utils/pieceMap.js'
    }
  },
  // devtool: 'eval-source-map',
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
