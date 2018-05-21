const { parseComponent } = require('vue-template-compiler')
const pugCompiler = require('pug')

module.exports = function(source) {
  const parsed = parseComponent(source)

  const pug = parsed.template.content
  const html = pugCompiler.compile(pug, { pretty: true })()
  const slices = {
    javascript: parsed.script.content,
    html,
    pug
  }

  return `module.exports = ${JSON.stringify(slices)}`
}
