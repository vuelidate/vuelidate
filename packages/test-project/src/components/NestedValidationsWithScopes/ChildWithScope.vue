<template>
  <div>
    <div>child control</div>
    <div :class="{ valid: !v$.$error && v$.$dirty, error: v$.$error }">
      <input
        v-model="v$.childNumber.$model"
        type="text"
      >
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'

export default {
  name: 'ChildComponent',
  setup () {
    const childRules = {
      childNumber: {
        required,
        minLength: minValue(5)
      }
    }
    const childState = reactive({
      childNumber: null
    })

    const v$ = useVuelidate(childRules, childState, {
      $scope: 'form1',
      $registerAs: 'ChildForm'
    })

    return { v$ }
  }
}
</script>
