const withParams = process.env.BUILD === 'web'
  ? require('./withParamsBrowser')
  : require('./index').withParams

export default withParams
