import { unwrapNormalizedValidator, unwrapValidatorResponse, unwrap } from './common'

export default function forEach (validators) {
  return {
    $validator (list, ...others) {
      return unwrap(list).reduce((previous, object) => {
        const result = Object.entries(object).reduce((all, [key, value]) => {
          const innerValidators = validators[key]
          const result = Object.entries(innerValidators).reduce((all, [propertyName, currentValidator]) => {
            const validatorFunction = unwrapNormalizedValidator(currentValidator)
            const result = validatorFunction.call(this, value, ...others)
            const $valid = unwrapValidatorResponse(result)
            all.$data[propertyName] = result
            if (!$valid) {
              let message = currentValidator.$message || ''
              let params = currentValidator.$params || {}
              if (typeof message === 'function' && !$valid) {
                message = message({
                  $pending: false,
                  $invalid: !$valid,
                  $params: params,
                  $model: value,
                  $response: result
                })
              }
              all.$messages[propertyName] = message
            }
            return {
              $valid: all.$valid && $valid,
              $data: all.$data,
              $messages: all.$messages
            }
          }, { $valid: true, $data: {}, $messages: {} })

          all.$data[key] = result.$data
          all.$messages[key] = result.$messages
          return {
            $valid: all.$valid && result.$valid,
            $data: all.$data,
            $messages: all.$messages
          }
        }, { $valid: true, $data: {}, $messages: {} })
        return {
          $valid: previous.$valid && result.$valid,
          $data: previous.$data.concat(result.$data),
          $messages: previous.$messages.concat(result.$messages)
        }
      }, { $valid: true, $data: [], $messages: [] })
    },
    $message: ({ $response }) => ($response ? $response.$messages : [])
  }
}
