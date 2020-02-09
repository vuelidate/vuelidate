<template>
  <div style="padding-top: 2rem;">
    <div style="float: right">
      <pre style="background-color: white;">
      {{ vuelidate }}
    </pre>
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
import { ref, reactive } from 'vue'
import useVuelidate from '@vuelidate/core/src'
import { required, minValue } from '@vuelidate/validators/src/withMessages'
import NestedA from './NestedA'

export default {
  components: { NestedA },
  setup () {
    const numberX = ref(0)

    const state = reactive({
      b: 'b'
    })

    let vuelidate = useVuelidate(
      { numberX: { required, minValue: minValue(3) } },
      { numberX }
    )

    return { vuelidate, numberX, state }
  }
}
</script>
