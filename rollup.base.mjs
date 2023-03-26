import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

export function generateOutputConfig (fileName = 'index', opts) {
  return {
    mjs: {
      file: `dist/${fileName}.mjs`,
      format: 'es',
      ...opts,
    },
    cjs: {
      file: `dist/${fileName}.cjs`,
      format: 'cjs',
      ...opts,
    },
    global: {
      file: `dist/${fileName}.iife.min.js`,
      format: 'iife',
      ...opts,
    }
  }
}

function generateConfigFactory ({ libraryName, input = 'src/index.js', outputConfigs }) {
  /**
   * @type {import('rollup').RollupOptions}
   */
  const config = {
    input,
    external: ['vue-demi'],
    plugins: [resolve(), commonjs(), babel({ babelHelpers: 'bundled' })],
    output: []
  }

  /**
   * Create config output
   * @param {string} name
   * @param {import('rollup').OutputOptions} options
   * @return {*}
   */
  function createConfig (name, options) {
    const opts = { ...options }
    opts.exports = 'named'
    opts.globals = {
      ...opts.globals,
      'vue-demi': 'VueDemi'
    }

    const isGlobalBuild = name === 'global'
    const isMinified = opts.file.includes('.min.')

    if (isGlobalBuild) opts.name = libraryName
    opts.plugins = []
    if (isMinified) {
      opts.plugins.push(
        terser()
      )
    }
    return opts
  }

  const packageBuilds = Object.keys(outputConfigs)
  config.output = packageBuilds.map(buildName => createConfig(buildName, outputConfigs[buildName]))

  return config
}

export { generateConfigFactory }
