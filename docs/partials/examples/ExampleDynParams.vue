<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="name" @input="$v.name.$touch()")
    span.form-group__message(v-if="!$v.name[valName]") Field is invalid
    pre
      | $v: {{ $v }}
    .form-group
      label.form__label min length
      input.form__input(type="number" v-model="minLength")
      input.form__input(v-model="valName")
</template>

<script>
import { or, minLength, alpha } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      name: '',
      minLength: 3,
      valName: 'validatorName'
    }
  },
  validations () {
    return {
      name: {
        [this.valName]: or(function (v) { return minLength(this.minLength)(v) }, alpha)
      }
    }
  }
}
</script>
