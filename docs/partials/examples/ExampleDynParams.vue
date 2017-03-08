<template lang="pug">
  div
    .form-group
      label.form__label Validator name
      input.form__input(v-model.trim="valName" @input="$v.name.$touch()")
    .form-group
      label.form__label Dynamic min length
      input.form__input(type="number" v-model.number="minLength" @input="$v.name.$touch()")
    .form-group(v-bind:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="name" @input="$v.name.$touch()")
    span.form-group__message(v-if="!$v.name[valName]") Field is invalid
    pre
      | $v: {{ $v }}
</template>

<script>
import { minLength } from 'vuelidate/lib/validators'

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
        [this.valName]: minLength(this.minLength)
      }
    }
  }
}
</script>
