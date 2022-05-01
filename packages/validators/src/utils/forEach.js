import { unwrapNormalizedValidator, unwrapValidatorResponse, unwrap } from './common'

export default function forEach (validators) {
  return {
    $validator (collection, ...others) {
      // go over the collection. It can be a ref as well.
      return unwrap(collection).reduce((previous, collectionItem) => {
        // go over each property
        const collectionEntryResult = Object.entries(validators).reduce((all, [property, innerValidators]) => {
          // get the model value for this property
          const $model = collectionItem[property] || ''
          // go over each validator and run it
          const propertyResult = Object.entries(innerValidators).reduce((all, [validatorName, currentValidator]) => {
            // extract the validator. Supports simple and extended validators.
            const validatorFunction = unwrapNormalizedValidator(currentValidator)
            // Call the validator, passing the VM as this, the value, current iterated object and the rest.
            const $response = validatorFunction.call(this, $model, collectionItem, ...others)
            // extract the valid from the result
            const $valid = unwrapValidatorResponse($response)
            // store the entire response for later
            all.$data[validatorName] = $response
            all.$data.$invalid = !$valid || !!all.$data.$invalid
            all.$data.$error = all.$data.$invalid
            // if not valid, get the $message
            if (!$valid) {
              let $message = currentValidator.$message || ''
              const $params = currentValidator.$params || {}
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
                $property: property,
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

          all.$data[property] = propertyResult.$data
          all.$errors[property] = propertyResult.$errors

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
    $message: ({ $response }) => ($response
      ? $response.$errors.map((context) => {
        return Object.values(context).map(errors => errors.map(error => error.$message)).reduce((a, b) => a.concat(b), [])
      })
      : [])
  }
}
