<template>
  <div style="padding-top: 2rem;">
    <div style="margin-bottom: 20px">
      <label>Number X</label>
      <input type="number" v-model.number="numberX">
    </div>
    <NestedA />
    <pre style="background-color: white;">{{ $v }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import NestedA from './NestedA.vue'

export default {
  components: { NestedA },
  setup () {
    const numberX = ref(0)

    const $v = useVuelidate({
      numberX: { required, minValue: minValue(3) }
      },
      { numberX }
    )

    return { $v, numberX }
  }
}
</script>
