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
import { ref, reactive } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core/src'
import { required, minValue } from '@vuelidate/validators/src/withMessages'
import NestedA from './NestedA'

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
