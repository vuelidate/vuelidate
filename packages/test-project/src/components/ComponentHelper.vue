<template>
  <div class="SimpleForm">
    <TextInput
      v-model="name"
      label="Name"
      :rules="{ required, minLength: minLength(3) }"
      :v-config="{ $autoDirty: false }"
    />
    <button @click="validate">
      Validate
    </button>
    <button @click="v$.$touch">
      $touch
    </button>
    <button @click="v$.$reset">
      $reset
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
import { ref } from 'vue-demi'
import useVuelidate from '@vuelidate/core'
import { withVuelidate } from '@vuelidate/components'
import { required, minLength } from '@vuelidate/validators'
import _TextInput from './TextInput.vue'

const TextInput = withVuelidate(_TextInput)

export default {
  name: 'ComponentHelper',
  components: { TextInput },
  setup () {
    const name = ref('given name')

    let v$ = useVuelidate()
    return { name, v$, required, minLength }
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
