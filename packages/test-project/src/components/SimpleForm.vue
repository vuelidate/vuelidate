<template>
  <div class="SimpleForm">
    <label>name</label>
    <input
      v-model="name"
      type="text"
    >
    <label>twitter</label>
    <input
      v-model="social.twitter"
      type="text"
    >
    <label>github</label>
    <input
      v-model="social.github"
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
import { ref, reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

const asyncValidator = {
  $message: 'Should be aaaa',
  $validator: (v) => {
    return new Promise(resolve => {
      console.log('called')
      setTimeout(() => {
        console.log('resolved')
        resolve(v === 'aaaa')
      }, 2000)
    })
  }
}

export default {
  name: 'SimpleForm',
  setup () {
    const name = ref('given name')
    const social = reactive({
      github: 'hi',
      twitter: 'hey'
    })

    let v$ = useVuelidate(
      computed(() => ({
        name: {
          required: helpers.withMessage('This field is required', required),
          minLength: helpers.withMessage(({
            $pending,
            $invalid,
            $params,
            $model
          }) => `This field has a value of '${$model}' but must have a min length of ${$params.min} so it is ${$invalid ? 'invalid' : 'valid'}`, minLength(4)),
          asyncValidator
        },
        social: {
          github: { minLength: minLength(social.twitter.length) },
          twitter: { minLength: minLength(name.value.length) }
        }
      })),
      { name, social },
      { $autoDirty: true }
    )
    return { name, v$, social }
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
