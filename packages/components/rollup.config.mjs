import { generateConfigFactory, generateOutputConfig } from '../../rollup.base.mjs'

const config = generateConfigFactory({
  input: 'index.js',
  libraryName: 'VuelidateComponents',
  outputConfigs: generateOutputConfig('index', {
    globals: {
      '@vuelidate/core': 'Vuelidate'
    }
  })
})
config.external = [/packages\/(vuelidate|validators)/, 'vue-demi']

export default config

