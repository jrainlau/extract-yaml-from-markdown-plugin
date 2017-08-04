const { resolve } = require('path')
const extractYamlFromMarkdownPlugin = require('./index.js')

module.exports = {
  entry: './example/index.js',
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  plugins: [
    new extractYamlFromMarkdownPlugin({
      exclude: [/\.js/],
      mdDir: resolve(__dirname, './example'),
      output: resolve(__dirname, './example/yaml.json'),
      format: 2
    })
  ]
}
