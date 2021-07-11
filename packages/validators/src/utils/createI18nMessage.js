import withMessage from './withMessage'

/**
 * Creates a translatable version of `withMessage` helper.
 * @param {function} t - the translation function of your choice
 * @param {function} [messagePath] - a function to generate the message path for each validator. By default it is `validations.${$validator}`
 */
export default function createI18nMessage ({
  t,
  messagePath = ({ $validator }) => `validations.${$validator}`
}) {
  return function withI18nMessage (validator, withArguments = false) {
    function message (props) {
      return t(messagePath(props), {
        model: props.$model,
        property: props.$property,
        pending: props.$pending,
        invalid: props.$invalid,
        response: props.$response,
        validator: props.$validator,
        propertyPath: props.$propertyPath,
        ...props.$params
      })
    }

    if (withArguments && typeof validator === 'function') {
      return (...args) => withMessage(message, validator(...args))
    }

    return withMessage(message, validator)
  }
}
