import { toRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'ValidateEach',
  props: {
    rules: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup (props, { slots }) {
    const v = useVuelidate(props.rules, toRef(props, "state"), props.options)
    return () => slots.default({ v: v.value })
  }
}
