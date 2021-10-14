const { resolve } = require('path')
const MdToHtmlPlugin = require('./md-to-html-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  plugins: [
    new MdToHtmlPlugin({
      template: resolve(__dirname, 'example/test.md'),
      filename: 'test.html',
    }),
  ],
}
