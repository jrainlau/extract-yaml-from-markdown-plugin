# Extract-Yaml-From-Markdown-Plugin
A webpack plugin for extracting yaml content from a markdown file automatically

# Why
This plugin allows people to write `markdown` with `YAML`, then extrct the `YAML` content to a `.json` file.

What's more, while under `--watch` mode or `webpack-dev-server`, every changes inside a pointed directory will be detected(adding, changing and deleting), and the new content will be written to a `.json` file automatically.

![Img](/example/img/md.png)

![Img](/example/img/json.png)
# Install
Yarn: 
```
yarn add extract-yaml-from-markdown-plugin.js --dev
```

Npm: 
```
npm install extract-yaml-from-markdown-plugin.js --save-dev
```

# Usage
Go into your `webpack.config.js`, require `extract-yaml-from-markdown-plugin.js`, then init it in the `plugins` option.

```javascript
// webpack.config.js

const { resolve } = require('path')
const extractYamlFromMarkdownPlugin = require('extract-yaml-from-markdown-plugin.js')

module.exports = {
  plugins: [
    new extractYamlFromMarkdownPlugin({
      mdDir: resolve(__dirname, './your-markdown-directory'),
      output: resolve(__dirname, './output-path-of-you-want')
    })
  ]
}
```

# Options
- `mdDir` { String }:

  Your markdown files' directory. After defined, the plugin will be watching this directory. Once you `add`/`update`/`delete` one markdown file, the plugin will update the YAML information and then write them to a `.json` file.

- `output` { String }:

  The plugin will extract YAML information from the given markdown file, then write them to a `.json` file from the path you set to `output`.

- `exclude` { Array }:

  An array of **regEx** that you don't want the plugin to care about.

- `format` { Number }: 
  
  The plugin using `JSON.stringify()` method to convert an object into string. `format` will be the last param of this method.

# Test
```
git clone https://github.com/jrainlau/extract-yaml-from-markdown-plugin.git

cd extract-yaml-from-markdown-plugin && yarn

# using `webpack` command
yarn test

# using `webpack --watch` command
yarn test:watch

# using `webpack-dev-server` command
yarn test:dev-server
```
Go to `/example` directory to find out what you got.

# Lisence
MIT
  
