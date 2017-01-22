<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.password.$error }")
      label.form__label Password
      input.form__input(v-model.trim="password" @input="$v.password.$touch()")
    span.form-group__message(v-if="!$v.password.required") Password is required.
    span.form-group__message(v-if="!$v.password.minLength")
      | Password must have at least {{ $v.password.$params.minLength.min }} letters.

    .form-group(v-bind:class="{ 'form-group--error': $v.repeatPassword.$error }")
      label.form__label Repeat password
      input.form__input(v-model.trim="repeatPassword" @input="$v.repeatPassword.$touch()")
    span.form-group__message(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical.
    pre
      | password: {{ $v.password }}
      | repeatPassword: {{ $v.repeatPassword }}
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      password: '',
      repeatPassword: ''
    }
  },
  validations: {
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  }
}
</script>
