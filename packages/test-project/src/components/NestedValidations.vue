<template>
  <div style="padding-top: 2rem;">
    <div style="float: right">
      <pre>{{ vuelidate }}</pre>
    </div>
    <div style="margin-bottom: 20px">
      <label>Number X</label>
      <input
        v-model.number="vuelidate.numberX.$model"
        type="number"
      >
    </div>
    <NestedA />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import NestedA from './NestedA.vue'

export default {
  components: { NestedA },
  setup () {
    const numberX = ref(0)
    const conditionalParam = ref('')

    const validations = computed(() => {
      const v = { numberX: { required, minValue: minValue(3) } }
      if (numberX.value > 5) {
        v.conditionalParam = { required }
      }
      return v
    })

    let vuelidate = useVuelidate(
      validations,
      { numberX, conditionalParam }
    )

    return { vuelidate, numberX, conditionalParam }
  }
}
</script>
