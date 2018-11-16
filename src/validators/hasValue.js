import {withParams, req, ref} from './common'
export default equalTo => withParams(
  { type: 'includes', value: equalTo },
  value => {
    if (!req(equalTo) || !req(value)) return false

    if (Array.isArray(value)) {
      return value.some((v, index) => {
        if (Array.isArray(equalTo)) {
          return equalTo.includes(v)
        } else if (typeof v === 'object') {
          return ref(equalTo, this, v, index)
        } else {
          return v === equalTo
        }
      })
    }

    if (typeof value === 'object') {
      for (let key in value) {
        if (value[key] === equalTo || ref(equalTo, this, value[key], key)) {
          return true
        }
      }
      return false
    }

    return value === equalTo
  }
)
