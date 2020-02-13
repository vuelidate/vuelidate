<template lang="html">
  <div class="">
    <div style="margin-bottom: 20px">
      <label>Number B</label>
      <input
        v-model.number="numberB"
        type="number"
      >
    </div>
    <!-- <NestedA /> -->
    <!-- <pre style="background-color: white;">{{ $v.$errors }}</pre> -->
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import useVuelidate from '@vuelidate/core/src'
import { required, maxValue, minValue } from '@vuelidate/validators/src/withMessages'

export default {
  setup (props) {
    const { max, min } = toRefs(props)
    const numberB = ref(8)
    const rules = { numberB: { required, maxValue: maxValue(max), minValue: minValue(min) } }
    const $v = useVuelidate(rules, { numberB }, 'NestedB')

    return { numberB, $v }
  }
}
</script>

<style lang="css" scoped>
</style>
