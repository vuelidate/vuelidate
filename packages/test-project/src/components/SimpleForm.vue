<template>
  <div class="SimpleForm">
    <label>name</label>
    <input
      v-model="name"
      :class="{ error: v$.name.$error }"
      type="text"
    >
    <button @click="validate">
      Validate
    </button>
    <button @click="v$.$touch">
      $touch
    </button>
    <button @click="v$.$reset">
      $reset
    </button>
    <button @click="v$.name.$commit">
      $commit
    </button>
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of v$.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
    <pre>{{ v$ }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

export default {
  name: 'SimpleForm',
  setup () {
    const name = ref('')

    const v$ = useVuelidate(
      {
        name: {
          required: helpers.withMessage('This field is required', required),
          minLength: minLength(4),
          is12345: {
            $validator: v => v === '12345',
            $message: 'Is not 12345'
          }
        }
      },
      { name },
      { $autoDirty: true }
    )
    return { name, v$ }
  },
  methods: {
    validate () {
      this.v$.$validate({ silent: true }).then((result) => {
        console.log('Result is', result)
      })
    }
  }
}
</script>
<style>
input[type=text] {
  border: none;
}

.error {
  background: #dbb9b9;
}
</style>
