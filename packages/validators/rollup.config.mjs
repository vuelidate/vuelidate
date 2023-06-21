import { generateConfigFactory, generateOutputConfig } from '../../rollup.base.mjs'

export default [
  generateConfigFactory({
    libraryName: 'VuelidateValidators',
    outputConfigs: generateOutputConfig('index'),
    copyTypes: true
  }),
  generateConfigFactory({
    libraryName: 'VuelidateValidators',
    input: 'src/raw.js',
    outputConfigs: generateOutputConfig('raw')
  })
]
