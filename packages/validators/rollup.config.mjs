import { generateConfigFactory, generateOutputConfig } from '../../rollup.base.mjs'

export default [
  generateConfigFactory({
    libraryName: 'VuelidateValidators',
    outputConfigs: generateOutputConfig('index')
  }),
  generateConfigFactory({
    libraryName: 'VuelidateValidators',
    input: 'src/raw.js',
    outputConfigs: generateOutputConfig('raw')
  })
]
