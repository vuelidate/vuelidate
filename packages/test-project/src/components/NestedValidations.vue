<template>
  <div style="padding-top: 2rem;">
    <div style="float: right">
      <pre>{{ vuelidate }}</pre>
    </div>
    <div style="margin-bottom: 20px">
      <label>Number X <input
        v-model.number="numberX"
        type="number"
      ></label>
      <label>
        Validate Conditional
        <input
          v-model="validateConditional"
          type="checkbox"
        >
      </label>
    </div>
    <button @click="vuelidate.$touch()">Touch</button>
    <button @click="vuelidate.$reset()">Reset</button>
    <!--    <NestedA />-->
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import useVuelidate from '@vuelidate/core/src'
import { required, minValue } from '@vuelidate/validators/src/withMessages'
// import NestedA from './NestedA'

export default {
  // components: { NestedA },
  setup () {
    const numberX = ref(0)
    const validateConditional = ref(false)
    const conditionalParam = ref('')

    const validations = {
      numberX: { required, minValue: minValue(3) },
      conditionalParam: computed(() => {
        if (validateConditional.value) {
          return { required }
        } else {
          return {}
        }
      })
    }

    let vuelidate = useVuelidate(
      validations,
      { numberX, conditionalParam }
    )

    return { vuelidate, numberX, conditionalParam, validateConditional }
  }
}
</script>
