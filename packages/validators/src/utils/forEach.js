import { unwrapNormalizedValidator, unwrapValidatorResponse, unwrap } from './common'

export default function forEach (validators) {
  return {
    $validator (collection, ...others) {
      // go over the collection. It can be a ref as well.
      return unwrap(collection).reduce((previous, object) => {
        // go over each property
        const collectionEntryResult = Object.entries(object).reduce((all, [key, $model]) => {
          // get the validators for this property
          const innerValidators = validators[key]
          // go over each validator and run it
          const propertyResult = Object.entries(innerValidators).reduce((all, [validatorName, currentValidator]) => {
            // extract the validator. Supports simple and extended validators.
            const validatorFunction = unwrapNormalizedValidator(currentValidator)
            // Call the validator with correct parameters
            const $response = validatorFunction.call(this, $model, ...others)
            // extract the valid from the result
            const $valid = unwrapValidatorResponse($response)
            // store the entire response for later
            all.$data[validatorName] = $response
            // if not valid, get the $message
            if (!$valid) {
              let $message = currentValidator.$message || ''
              let $params = currentValidator.$params || {}
              // If $message is a function, we call it with the appropriate parameters
              if (typeof $message === 'function') {
                $message = $message({
                  $pending: false,
                  $invalid: !$valid,
                  $params,
                  $model,
                  $response
                })
              }
              // save the error object
              all.$errors.push({
                $property: key,
                $message,
                $params,
                $response,
                $model,
                $pending: false,
                $validator: validatorName
              })
            }
            return {
              $valid: all.$valid && $valid,
              $data: all.$data,
              $errors: all.$errors
            }
          }, { $valid: true, $data: {}, $errors: [] })

          all.$data[key] = propertyResult.$data
          all.$errors[key] = propertyResult.$errors

          return {
            $valid: all.$valid && propertyResult.$valid,
            $data: all.$data,
            $errors: all.$errors
          }
        }, { $valid: true, $data: {}, $errors: {} })

        return {
          $valid: previous.$valid && collectionEntryResult.$valid,
          $data: previous.$data.concat(collectionEntryResult.$data),
          $errors: previous.$errors.concat(collectionEntryResult.$errors)
        }
      }, { $valid: true, $data: [], $errors: [] })
    },
    // collect all the validation errors into a 2 dimensional array, for each entry in the collection, you have an array of error messages.
    $message: ({ $response }) => ($response ? $response.$errors.map((context) => {
      return Object.values(context).map(errors => errors.map(error => error.$message)).reduce((a, b) => a.concat(b), [])
    }) : [])
  }
}
