<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.password.$error }")
      label.form__label Password
      input.form__input(v-model.trim="$v.password.$model")
    .error(v-if="!$v.password.required") Password is required.
    .error(v-if="!$v.password.minLength")
      | Password must have at least {{ $v.password.$params.minLength.min }} letters.

    .form-group(:class="{ 'form-group--error': $v.repeatPassword.$error }")
      label.form__label Repeat password
      input.form__input(v-model.trim="$v.repeatPassword.$model")
    .error(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical.

    tree-view(:data="$v", :options="{rootObjectKey: '$v', maxDepth: 2}")
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
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
