import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

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
    }
  }
}

function generateConfigFactory({
  libraryName,
  input = 'src/index.js',
  outputConfigs,
  copyTypes = false
}) {
  /**
   * @type {import('rollup').RollupOptions}
   */
  const config = {
    input,
    external: ['vue'],
    plugins: [resolve(), commonjs()],
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

    const isGlobalBuild = name === 'global'

    if (isGlobalBuild) opts.name = libraryName
    opts.plugins = []

    if (copyTypes) {
      opts.plugins.push(
        copy({
          hook: 'writeBundle',
          flatten: true,
          targets: [
            {
              src: 'index.d.ts',
              dest: 'dist',
              rename: 'index.d.cts'
            },
            {
              src: 'index.d.ts',
              dest: 'dist',
              rename: 'index.d.mts'
            }
          ]
        })
      )
    }
    return opts
  }

  const packageBuilds = Object.keys(outputConfigs)
  config.output = packageBuilds.map(buildName => createConfig(buildName, outputConfigs[buildName]))

  return config
}

export { generateConfigFactory }
