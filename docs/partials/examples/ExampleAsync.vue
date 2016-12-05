<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.username.$error, 'form-group--loading': $v.username.$pending }")
      label.form__label Username
      input.form__input(v-model.trim="username" @input="$v.username.$touch()")
    span.form-group__message(v-if="!$v.username.required") Username is required.
    span.form-group__message(v-if="!$v.username.isUnique") This username is already registered.
    pre
      | username: {{ $v.username }}
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      username: ''
    }
  },
  validations: {
    username: {
      required,
      isUnique (value) {
        // standalone validator ideally should not assume a field is required
        if (value === '') return true

        // simulate async call, fail for all logins with even length
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(typeof value === 'string' && value.length % 2 !== 0)
          }, 350 + Math.random() * 300)
        })
      }
    }
  }
}
</script>
