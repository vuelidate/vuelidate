import { generateConfigFactory, generateOutputConfig } from '../../rollup.base.mjs'

export default generateConfigFactory({
  libraryName: 'Vuelidate',
  outputConfigs: generateOutputConfig('index')
})
