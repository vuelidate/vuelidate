<template>
  <div class="SimpleForm">
    <input
      v-model="name"
      type="text"
    >
    <input
      v-model="social.twitter"
      type="text"
    >
    <input
      v-model="social.github"
      type="text"
    >
    <button @click="validate">
      Validate
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

const asyncValidator = withAsync({
  $message: 'Should aaaa',
  $validator: (v) => {
    return new Promise(resolve => {
      console.log('called')
      setTimeout(() => {
        console.log('resolved')
        resolve(v === 'aaaa')
      }, 2000)
    })
  }
})

export default {
  name: 'SimpleForm',
  setup () {
    const name = ref('')
    const social = reactive({
      github: 'hi',
      twitter: 'hey'
    })

    let v$ = useVuelidate(
      {
        name: {
          required, minLength: minLength(4), asyncValidator
        },
        social: {
          github: { minLength: minLength(4) },
          twitter: { asyncValidator, minLength: minLength(6) }
        }
      },
      { name, social },
      { $autoDirty: true }
    )
    return { name, v$, social }
  },
  methods: {
    validate () {
      this.v$.$validate().then((result) => {
        console.log('Result is', result)
      })
    }
  }
}
</script>
