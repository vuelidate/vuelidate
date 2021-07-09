import withMessage from './withMessage'

export default function createI18nMessage ({ t }) {
  const withI18nMessage = (validator, args = null) => {
    if (typeof validator === 'function' && args === null) {
      return (...args) => withI18nMessage(validator, args)
    }
    return withMessage((props) => t(`messages.${props.$validator}`, {
      model: props.$model,
      property: props.$property,
      ...props.$params
    }), args === null ? validator : validator(...args))
  }
  return withI18nMessage
}
