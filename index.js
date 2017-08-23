/**
 * @name extract-yaml-from-markdown-plugin.js
 * @author Jrain Lau
 * @desc extract yaml information from a markdown file automatically
 */

const { resolve, basename } = require('path')
const chokidar = require('chokidar')
const fm = require('front-matter')
const fs = require('fs')
const { readFileSync, writeFileSync } = require('fs')

/**
 * extract yaml from the given .md file,
 * then generate a .json file with all the yaml information
 * @param { Array } pathArr .md files path
 * @param { Object } instance plugin instance
 */
function extractYaml (pathArr, instance) {
  const yamlJson = JSON.parse(fs.readFileSync(instance.options.output).toString())
  pathArr.forEach((path) => {
    const fileName = basename(path)
    const rawYaml = fs.readFileSync(path).toString()
    const yaml = fm(rawYaml).attributes
    yamlJson[fileName] = yaml
    fs.writeFileSync(instance.options.output, JSON.stringify(yamlJson, null, instance.options.format))
  })
}

/**
 * delete a yaml information from the .json file
 * @param { String } path deleted .md file
 * @param { Object } instance plugin instance
 */
function deleteYaml (path, instance) {
  const fileName = basename(path)
  const yamlJson = JSON.parse(fs.readFileSync(instance.options.output).toString())
  delete yamlJson[fileName]
  fs.writeFileSync(instance.options.output, JSON.stringify(yamlJson, null, instance.options.format))
}

/**
 * whether it is running with webpack-dev-server
 * @param { Object } options plugin options
 */
function onDevServer (options) {
  return /webpack-dev-server/.test(JSON.stringify(options.entry))
}

class extractYamlFromMarkdownPlugin {
  constructor ({
    exclude = [],  // an array of exclude regx
    mdDir = '',    // markdown file directory
    output = '',   // yaml json file output directory
    format = 0     // json format
  }) {
    this.options = { exclude, mdDir, output, format }
    this.rawMarkdowns = new Set()
  }

  apply (compiler) {
    const self = this
    const watcher = chokidar.watch(self.options.mdDir, {
      ignored: self.options.exclude
    })
    // init a blank json object
    fs.writeFileSync(self.options.output, '{}')
    compiler.plugin('make', (compilation, callback) => {
      watcher
        .on('add', (path) => {
          console.log('add' + path)
          ;/\.md/.test(path) && self.rawMarkdowns.add(path)
          extractYaml([...self.rawMarkdowns], self)
        })
        .on('change', (path) => {
          console.log('change' + path)
          extractYaml([...self.rawMarkdowns], self)
        })
        .on('unlink', (path) => {
          console.log('delete' + path)
          ;/\.md/.test(path) && self.rawMarkdowns.delete(path)
          deleteYaml(path, self)
        })
      callback();
    });
    compiler.plugin('emit', (compilation, callback) => {
      if (!compiler.options.watch && !onDevServer(compiler.options)) {
        watcher.close()
      }
      callback()
    })
  }
}

module.exports = extractYamlFromMarkdownPlugin
