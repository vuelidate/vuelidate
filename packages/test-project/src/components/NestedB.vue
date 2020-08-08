<template>
  <div class="">
    <div style="margin-bottom: 20px">
      <label>Number B</label>
      <input
        v-model.number="numberB"
        type="number"
      >
    </div>
    <pre>{{ $v.$errors }}</pre>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, maxValue, minValue } from '@vuelidate/validators'

export default {
  name: 'NestedB',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup (props) {
    const { max, min } = toRefs(props)
    const numberB = ref(88)
    const rules = {
      numberB: {
        required,
        maxValue: maxValue(max),
        minValue: minValue(min),
        $autoDirty: true
      }
    }
    const $v = useVuelidate(rules, { numberB })

    return { numberB, $v }
  }
}
</script>

<style lang="css" scoped>
</style>
