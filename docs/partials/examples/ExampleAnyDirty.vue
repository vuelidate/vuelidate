<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.fieldA.$error }")
      label.form__label Field A
      input.form__input(v-model.trim="$v.fieldA.$model")
    .error(v-if="!$v.fieldA.required") Field A is required.
    .error(v-if="!$v.fieldA.minLength")
      | Field A must have at least {{$v.fieldA.$params.minLength.min}} letters.
    .form-group(:class="{ 'form-group--error': $v.fieldB.$error }")
      label.form__label Field B
      input.form__input(v-model.trim="$v.fieldB.$model")
    .error(v-if="!$v.fieldB.required") Field A is required.
    .error(v-if="!$v.fieldB.minLength")
      | Field B must have at least {{$v.fieldB.$params.minLength.min}} letters.

    .form-group
      button.button(@click="$v.$reset") $reset
    .form-group
      label.form__label Validation status:
      ul.list__ul
        li(v-if="$v.fieldA.$invalid") Field A is <kbd>$invalid</kbd>.
        li(v-if="$v.fieldA.$error") Field A has <kbd>$error</kbd> and <kbd>$anyError</kbd>.

        li(v-if="$v.fieldB.$invalid") Field B is <kbd>$invalid</kbd>.
        li(v-if="$v.fieldB.$error") Field B has <kbd>$error</kbd> and <kbd>$anyError</kbd>.

        li(v-if="$v.$invalid") Form is <kbd>$invalid</kbd>.
        li(v-else) All fine.
        li(v-if="$v.$error"): strong Form has <kbd>$error</kbd>.
        li(v-if="$v.$anyError"): strong Form has <kbd>$anyError</kbd>.

</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      fieldA: '',
      fieldB: ''
    }
  },
  validations: {
    fieldA: {
      required,
      minLength: minLength(3)
    },
    fieldB: {
      required,
      minLength: minLength(3)
    }
  }
}
</script>
