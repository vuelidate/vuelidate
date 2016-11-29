<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.flatA.$error }")
      label.form__label Flat A
      input.form__input(v-model.trim="flatA" @input="$v.flatA.$touch()")
    span.form-group__message(v-if="!$v.flatA.required") Field is required.
    .form-group(v-bind:class="{ 'form-group--error': $v.flatB.$error }")
      label.form__label Flat B
      input.form__input(v-model.trim="flatB" @input="$v.flatB.$touch()")
    span.form-group__message(v-if="!$v.flatB.required") Field is required.
    .form-group(v-bind:class="{ 'form-group--error': $v.forGroup.nested.$error }")
      label.form__label Nested field
      input.form__input(v-model.trim="forGroup.nested" @input="$v.forGroup.nested.$touch()")
    span.form-group__message(v-if="!$v.forGroup.nested.required") Field is required.

    .form-group(v-bind:class="{ 'form-group--error': $v.validationGroup.$error }")
    span.form-group__message(v-if="$v.validationGroup.$error") Group is invalid.

    pre
      | validationGroup: {{ $v.validationGroup }}
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      flatA: '',
      flatB: '',
      forGroup: {
        nested: ''
      }
    }
  },
  validations: {
    flatA: { required },
    flatB: { required },
    forGroup: {
      nested: { required }
    },
    validationGroup: ['flatA', 'flatB', 'forGroup.nested']
  }
}
</script>
