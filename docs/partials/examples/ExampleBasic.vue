<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="name" @input="$v.name.$touch()")
    span.form-group__message(v-if="!$v.name.required") Field is required
    span.form-group__message(v-if="!$v.name.minLength")
      | Name must have at least {{$v.name.$params.minLength.min}} letters.
    pre
      | name: {{ $v.name }}

    .form-group(v-bind:class="{ 'form-group--error': $v.age.$error }")
      label.form__label Age
      input.form__input(v-model.trim="age" @blur="$v.age.$touch()")
    span.form-group__message(v-if="!$v.age.between")
      | Must be between {{$v.age.$params.between.min}} and {{$v.age.$params.between.max}}
    pre
      | age: {{ $v.age }}
</template>

<script>
import { required, minLength, between } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      name: '',
      age: 0
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    age: {
      between: between(20, 30)
    }
  }
}
</script>
