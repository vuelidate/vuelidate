import { withParams, req } from './common'

/**
 * Json rule
 *
 * @param {'array_object' | 'array' | 'object'} [type] - The json type
 */
export default (type) =>
  withParams({ type: 'numeric', jsonType: type }, (value) => {
    if (!helpers.req(value)) {
      return true
    }

    try {
      const jsonValue = JSON.parse(value)

      if (type === 'array_object') {
        if (Array.isArray(jsonValue)) {
          jsonValue.forEach((value) => {
            if (!utils.isObject(value)) {
              throw new Error('is not Object')
            }
          })

          return true
        }

        return false
      } else if (type === 'array') {
        return Array.isArray(jsonValue)
      } else if (type === 'object') {
        return utils.isObject(jsonValue) && !Array.isArray(jsonValue)
      }
    } catch (e) {
      return false
    }

    return true
  })
