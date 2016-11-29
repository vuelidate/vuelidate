<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.form.nestedA.$error }")
      label.form__label Nested A
      input.form__input(v-model.trim="form.nestedA" @input="$v.form.nestedA.$touch()")
    span.form-group__message(v-if="!$v.form.nestedA.required") Field is required.
    .form-group(v-bind:class="{ 'form-group--error': $v.form.nestedB.$error }")
      label.form__label Nested B
      input.form__input(v-model.trim="form.nestedB" @input="$v.form.nestedB.$touch()")
    span.form-group__message(v-if="!$v.form.nestedB.required") Field is required.

    .form-group(v-bind:class="{ 'form-group--error': $v.form.$error }")
    span.form-group__message(v-if="$v.form.$error") Form is invalid.

    pre form: {{ $v.form }}
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        nestedA: '',
        nestedB: ''
      }
    }
  },
  validations: {
    form: {
      nestedA: {
        required
      },
      nestedB: {
        required
      }
    }
  }
}
</script>
