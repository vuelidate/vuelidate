<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.form.userName.$error }")
      label.form__label Username
      input.form__input(v-model.trim="$v.form.userName.$model")
    .error(v-if="!$v.form.userName.required")
      | Field is required.
    .error(v-if="!$v.form.userName.minLength")
      | Field must have at least {{ $v.form.userName.$params.minLength.min }} characters.
    .form-group(:class="{ 'form-group--error': $v.form.password.$error }")
      label.form__label Password
      input.form__input(v-model.trim="$v.form.password.$model" type="password")
    .error(v-if="!$v.form.password.required")
      | Field is required.
    .error(v-if="!$v.form.password.minLength")
      | Field must have at least {{ $v.form.password.$params.minLength.min }} characters.

    .form-group(:class="{ 'form-group--error': $v.form.$error }")
      .error(v-if="$v.form.$error") Form is invalid.

    tree-view(:data="$v", :options="{rootObjectKey: '$v', maxDepth: 2}")
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
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
