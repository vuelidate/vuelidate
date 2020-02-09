<template lang="html">
  <div class="">
    <div style="margin-bottom: 20px">
      <label>Number A</label>
      <input
        v-model.number="numberA"
        type="number"
      >
      <label>Max
        <input
          v-model.number="max"
          type="number"
        >
      </label>
    </div>
    <NestedB :max="max" />
    <!-- <pre style="background-color: white;">{{ $v.$errors }}</pre> -->
  </div>
</template>

<script>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core/src'
import { required, maxValue } from '@vuelidate/validators/src/withMessages'
import NestedB from './NestedB'

export default {
  components: { NestedB },
  setup () {
    const numberA = ref(8)
    const max = ref(5)
    const rules = { numberA: { required, maxValue: maxValue(max) } }
    const $v = useVuelidate(rules, { numberA }, 'NestedA')

    return { numberA, $v, max }
  }
}
</script>

<style lang="css" scoped>
</style>
