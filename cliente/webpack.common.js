/* eslint-disable no-undef */
const path = require('path')

const config = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, '../servidor/publico'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/
      },
      {
        test: /\.css$/, use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|png|gif|woff2|woff|ttf)$/, use: ['file-loader']
      }
    ]
  }
}

module.exports = config
