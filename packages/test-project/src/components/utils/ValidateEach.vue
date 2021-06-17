<script>
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'EachProvider',
  props: ['rules', 'state', 'options'],
  setup (props, { slots }) {
    const v = useVuelidate(props.rules, props.state, props.options)
    return () => slots.default({ v: v.value })
  }
}
</script>
