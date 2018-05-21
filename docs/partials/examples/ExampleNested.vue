<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.form.nestedA.$error }")
      label.form__label Nested A
      input.form__input(v-model.trim="$v.form.nestedA.$model")
    .error(v-if="!$v.form.nestedA.required") Field is required.
    .form-group(:class="{ 'form-group--error': $v.form.nestedB.$error }")
      label.form__label Nested B
      input.form__input(v-model.trim="$v.form.nestedB.$model")
    .error(v-if="!$v.form.nestedB.required") Field is required.

    .form-group(:class="{ 'form-group--error': $v.form.$error }")
    .error(v-if="$v.form.$error") Form is invalid.

    tree-view(:data="$v.form", :options="{rootObjectKey: '$v.form', maxDepth: 2}")
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
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
