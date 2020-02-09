<template lang="html">
  <div class="">
    <div style="margin-bottom: 20px">
      <label>Number A</label>
      <input
        v-model.number="numberA"
        type="number"
      >
    </div>
    <NestedB />
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
    const rules = { numberA: { required, maxValue: maxValue(5) } }
    const $v = useVuelidate(rules, { numberA }, 'NestedA')

    return { numberA, $v }
  }
}
</script>

<style lang="css" scoped>
</style>
