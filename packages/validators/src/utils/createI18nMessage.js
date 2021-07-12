import withMessage from './withMessage'

/**
 * Creates a translatable version of `withMessage` helper.
 * @param {function} t - the translation function of your choice
 * @param {function} [messagePath] - a function to generate the message path, passed to `t` for each message. By default it is `validations.${$validator}`
 * @param {function} [messageParams] - a function to augment the params, passed to `t` for each message.
 */
export default function createI18nMessage ({
  t,
  messagePath = ({ $validator }) => `validations.${$validator}`,
  messageParams = (params) => params
}) {
  return function withI18nMessage (
    validator,
    {
      withArguments = false,
      messagePath: localMessagePath = messagePath,
      messageParams: localMessageParams = messageParams
    } = {}
  ) {
    function message (props) {
      return t(localMessagePath(props), localMessageParams({
        model: props.$model,
        property: props.$property,
        pending: props.$pending,
        invalid: props.$invalid,
        response: props.$response,
        validator: props.$validator,
        propertyPath: props.$propertyPath,
        ...props.$params
      }))
    }

    if (withArguments && typeof validator === 'function') {
      return (...args) => withMessage(message, validator(...args))
    }

    return withMessage(message, validator)
  }
}
