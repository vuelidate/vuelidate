<template>
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
      <label>Min
        <input
          v-model.number="min"
          type="number"
        >
      </label>
    </div>
    <NestedB
      :max="max"
      :min="min"
    />
    <!-- <pre style="background-color: white;">{{ $v.$errors }}</pre> -->
  </div>
</template>

<script>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, maxValue } from '@vuelidate/validators'
import NestedB from './NestedB.vue'

export default {
  name: 'NestedA',
  components: { NestedB },
  data () {
    return {
      min: 4
    }
  },
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
