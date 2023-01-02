<template lang="html">
  <div class="">
    <div style="margin-bottom: 20px">
      <label>Number B</label>
      <input type="number" v-model.number="numberB">
    </div>
    <!-- <NestedA /> -->
    <!-- <pre style="background-color: white;">{{ v$.$errors }}</pre> -->
  </div>
</template>

<script>
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxValue, minValue } from '@vuelidate/validators'

export default {
  setup () {
    const numberB = ref(8)
    const rules = { numberB: { required, maxValue: maxValue(5), minValue: minValue(3) } }
    const v$ = useVuelidate(rules, { numberB }, 'NestedB')

    return { numberB, v$ }
  }
}
</script>

<style lang="css" scoped>
</style>
