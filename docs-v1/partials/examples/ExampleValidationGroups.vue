<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.flatA.$error }")
      label.form__label Flat A
      input.form__input(v-model.trim="$v.flatA.$model")
    .error(v-if="!$v.flatA.required") Field is required.
    .form-group(:class="{ 'form-group--error': $v.flatB.$error }")
      label.form__label Flat B
      input.form__input(v-model.trim="$v.flatB.$model")
    .error(v-if="!$v.flatB.required") Field is required.
    .form-group(:class="{ 'form-group--error': $v.forGroup.nested.$error }")
      label.form__label Nested field
      input.form__input(v-model.trim="$v.forGroup.nested.$model")
    .error(v-if="!$v.forGroup.nested.required") Field is required.

    .form-group(:class="{ 'form-group--error': $v.validationGroup.$error }")
    .error(v-if="$v.validationGroup.$error") Group is invalid.

    tree-view(:data="$v.validationGroup", :options="{rootObjectKey: '$v.validationGroup', maxDepth: 2}")
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
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
