<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.form.userName.$error }")
      label.form__label Nested A
      input.form__input(v-model.trim="form.userName" @input="$v.form.userName.$touch()")
    span.form-group__message(v-if="!$v.form.userName.required")
      | Field is required.
    span.form-group__message(v-if="!$v.form.userName.minLength")
      | Field must have at least {{ $v.form.userName.$params.minLength.min }} characters.
    .form-group(v-bind:class="{ 'form-group--error': $v.form.password.$error }")
      label.form__label Nested B
      input.form__input(v-model.trim="form.password" @input="$v.form.password.$touch()" type="password")
    span.form-group__message(v-if="!$v.form.password.required")
      | Field is required.
    span.form-group__message(v-if="!$v.form.password.minLength")
      | Field must have at least {{ $v.form.password.$params.minLength.min }} characters.

    .form-group(v-bind:class="{ 'form-group--error': $v.form.$error }")
      span.form-group__message(v-if="$v.form.$error") Form is invalid.

    pre form: {{ $v.form }}
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      userName: {
        required,
        minLength: minLength(5)
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  }
}
</script>
