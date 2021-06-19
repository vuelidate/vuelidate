<script>
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'ValidateEach',
  props: ['rules', 'state', 'options'],
  setup (props) {
    const v = useVuelidate(props.rules, props.state, props.options)
    return { v }
  },
  render () {
    return ('$scopedSlots' in this ? this.$scopedSlots : this.$slots).default({ v: this.v })
  }
}
</script>
