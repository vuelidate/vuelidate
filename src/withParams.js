/* istanbul ignore next */
const withParams = process.env.BUILD === 'web'
  ? require('./withParamsBrowser').default
  : require('./index').withParams

export default withParams
