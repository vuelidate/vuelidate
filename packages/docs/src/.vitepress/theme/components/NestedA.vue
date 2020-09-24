<template lang="html">
  <div class="">
    <div style="margin-bottom: 20px">
      <label>Number A</label>
      <input type="number" v-model.number="numberA">
    </div>
    <NestedB />
    <!-- <pre style="background-color: white;">{{ $v.$errors }}</pre> -->
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, maxValue } from '@vuelidate/validators'
import NestedB from './NestedB.vue'

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
