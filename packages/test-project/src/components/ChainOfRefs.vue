<template>
  <div class="">
    <input
      v-model="form.foo.bar"
      type="text"
    >
    <button
      type="button"
      name="button"
      @click="vv.$touch()"
    >
      $touch
    </button>
    <pre>{{ vv }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  setup () {
    const $autoDirty = true

    const form = ref({
      foo: {
        bar: ''
      }
    })

    const validationArgs = {
      form: {
        required,
        foo: {
          required,
          bar: {
            required,
            $autoDirty
          }
        }
      }
    }

    const vv = useVuelidate(validationArgs, { form })

    return {
      form,
      vv
    }
  }
}
</script>

<style lang="css" scoped>
</style>
