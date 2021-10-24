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
import { ref, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

const { withAsync } = helpers

const asyncValidator = (time = 2000, is = 'aaa') => withAsync({
  $message: ({ $property }) => `${$property} Should be ${is}`,
  $validator: (v) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(v === is)
      }, time)
    })
  }
})

export default {
  name: 'AsyncValidators',
  setup () {
    const name = ref('given name')
    const social = reactive({
      github: 'hi',
      twitter: 'hey'
    })

    const v$ = useVuelidate(
      {
        name: {
          required: helpers.withMessage('This field is required', required),
          isName: asyncValidator(2000, 'name'),
          minLength: minLength(3)
        },
        social: {
          github: { isGithub: asyncValidator(1500, 'github') },
          twitter: { isTwitter: asyncValidator(1000, 'twitter') }
        }
      },
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
