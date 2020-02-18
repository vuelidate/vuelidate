<template>
  <div style="padding-top: 2rem;">
    <div style="float: right">
      <pre style="max-height: 100vh; overflow-y: auto">{{ vuelidate }}</pre>
    </div>
    <div style="margin-bottom: 20px">
      <label>Number X <input
        v-model.number="vuelidate.numberX.$model"
        type="number"
      ></label>
      <br>
      <label>Username<input
        v-model="vuelidate.form.username.$model"
        type="text"
      ></label>
      <br>
      <label>Email<input
        v-model="vuelidate.form.email.$model"
        type="email"
      ></label>
      <br>
      <label>
        Validate Conditional
        <input
          v-model="validateConditional"
          type="checkbox"
        >
      </label>
    </div>
    <button @click="vuelidate.$touch()">
      Touch
    </button>
    <button @click="vuelidate.$reset()">
      Reset
    </button>
    <pre>{{ state }}</pre>
    <NestedA />
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import useVuelidate from '@vuelidate/core/src'
import { required, minValue, email } from '@vuelidate/validators/src/withMessages'
import NestedA from './NestedA'

export default {
  components: { NestedA },
  setup () {
    const state = reactive({
      numberX: 0,
      conditionalParam: false,
      form: {
        username: '',
        email: ''
      }
    })
    const validateConditional = ref(false)

    const validations = {
      numberX: { required, minValue: minValue(3) },
      conditionalParam: computed(() => {
        if (validateConditional.value === true) {
          return { requiredConditionalParam: required }
        } else {
          return {}
        }
      }),
      form: {
        username: { required },
        email: { email }
      }
    }

    let vuelidate = useVuelidate(
      validations,
      state
    )

    return { vuelidate, state, validateConditional }
  }
}
</script>
