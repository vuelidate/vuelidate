export const paramsSymbol = typeof Symbol === 'function' ? Symbol() : '__vuelidate$$paramsForParent'

export default function withParams (params, subject) {
  const entryParams = subject[paramsSymbol] || {}
  if (typeof subject === 'function') {
    const origFn = subject
    subject = function (...args) { return origFn.apply(this, args) }
  } else {
    subject = {...subject}
  }

  subject[paramsSymbol] = Object.assign({}, entryParams, params)
  return subject
}
