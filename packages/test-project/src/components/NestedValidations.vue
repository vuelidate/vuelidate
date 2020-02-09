<template>
  <div style="padding-top: 2rem;">
    <div style="margin-bottom: 20px">
      <label>Number X</label>
      <input
        v-model.number="numberX"
        type="number"
      >
    </div>
    <pre style="background-color: white;">
      {{ vuelidate }}
    </pre>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import useVuelidate from '@vuelidate/core/src'
import { required, minValue } from '@vuelidate/validators/src/withMessages'

export default {
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
