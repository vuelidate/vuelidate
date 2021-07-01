import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    messages: {
      required: '{property} is required',
      minLength: 'The {property} field has a value of "{model}", but must have a min length of {min}.',
      asyncValidator: '{property} should equal "aaaa", but it is "{model}".'
    }
  },
  bg: {
    messages: {
      required: '{property} e задължително',
      minLength: 'Полето {property} има стойност "{model}", но трябва да е дълго поне {min} символа.',
      asyncValidator: '{property} трябва да е "aaaa", но е "{model}".'
    }
  }
}

export const i18n = createI18n({
  locale: 'en',
  messages
})
