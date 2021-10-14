/**
 * Markdown 文件转为 Html
 */
const { readFileSync } = require('fs')
const { resolve } = require('path')
const { compilerHTML } = require('./html-compiler')

const INNER_TAG = '<!-- inner -->'

class MdToHtmlPlugin {
  constructor({ template, filename }) {
    if (!template) {
      throw new Error('The config for "template" must be configurated!')
    }

    this.template = template
    this.filename = filename ? filename : 'md.html'
  }

  apply(compiler) {
    compiler.hooks.emit.tap('md-to-html-plugin', (compilation) => {
      const _assets = compilation.assets
      const _mdContent = readFileSync(this.template, 'utf-8')
      const _templateContent = readFileSync(
        resolve(__dirname, './template.html'),
        'utf-8',
      )
      const _mdContentArr = _mdContent.split(/\n/)
      const _htmlStr = compilerHTML(_mdContentArr)
      const _finalHTML = _templateContent.replace(INNER_TAG, _htmlStr)

      _assets[this.filename] = {
        source() {
          return _finalHTML
        },
        size() {
          return _finalHTML.length
        },
      }

    })
  }
}

module.exports = MdToHtmlPlugin
