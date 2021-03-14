import { h, toRefs } from 'vue-demi'
import useVuelidate from '@vuelidate/core'

export function withVuelidate (Component, options) {
  return {
    props: {
      rules: {
        type: Object,
        default: () => ({})
      },
      modelValue: {
        type: String,
        default: ''
      },
      vConfig: {
        type: Object,
        default: () => ({})
      }
    },
    setup (props, { attrs }) {
      const { rules, modelValue, vConfig } = toRefs(props)
      const v$ = useVuelidate({ modelValue: rules }, { modelValue: modelValue }, vConfig.value)
      return () => h(Component, { ...props, ...attrs, errors: v$.value })
    }
  }
}
