/* istanbul ignore next */
const withParams = process.env.BUILD === 'web'
  ? require('./params').withParams
  : require('./index').withParams

export default withParams
