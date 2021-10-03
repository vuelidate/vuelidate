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

export default {
  name: 'ExternalValidationsForm',
  setup () {
    const name = ref('given name')
    const social = reactive({
      github: 'hi',
      twitter: 'hey'
    })

    const $externalResults = reactive({
      name: '',
      social: {
        github: '',
        twitter: ''
      }
    })

    let v$ = useVuelidate(
      {
        name: {
          required: helpers.withMessage('This field is required', required)
        },
        social: {
          github: { minLength: minLength(5) },
          twitter: { minLength: minLength(5) }
        }
      }, { name, social }, { $autoDirty: true, $externalResults })

    return { name, v$, social, external: $externalResults }
  },
  methods: {
    validate () {
      this.v$.$validate().then((result) => {
        console.log('Result is', result)
        this.external.name = 'Name External'
        this.external.social.github = 'Github External'
      })
    }
  }
}
</script>
