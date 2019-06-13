import withParams from '../withParams'
export { withParams }

// "required" core, used in almost every validator to allow empty values
export const req = (value) => {
  if (Array.isArray(value)) return !!value.length
  if (value === undefined || value === null) {
    return false
  }

  if (value === false) {
    return true
  }

  if (value instanceof Date) {
    // invalid date won't pass
    return !isNaN(value.getTime())
  }

  if (typeof value === 'object') {
    for (let _ in value) return true
    return false
  }

  return !!String(value).length
}

// get length in type-agnostic way
export const len = (value) => {
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object') {
    return Object.keys(value).length
  }
  return String(value).length
}

// resolve referenced value
export const ref = (reference, vm, parentVm) =>
  typeof reference === 'function'
    ? reference.call(vm, parentVm)
    : parentVm[reference]

// regex based validator template
export const regex = (type, expr) =>
  withParams({ type }, (value) => !req(value) || expr.test(value))

/**
 * Supported locales for validator
 * @typedef {('ar' | 'ar-AE' | 'ar-BH' | 'ar-DZ' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-QA' | 'ar-QM' | 'ar-SA' | 'ar-SD' | 'ar-SY' | 'ar-TN' | 'ar-YE' | 'bg-BG' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fr-FR' | 'hu-HU' | 'it-IT' | 'ku-IQ' | 'nb-NO' | 'nl-NL' | 'nn-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ru-RU' | 'sl-SI' | 'sk-SK' | 'sr-RS' | 'sr-RS@latin' | 'sv-SE' | 'tr-TR' | 'uk-UA')} Locales
 */
