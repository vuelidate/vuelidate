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
    .form-group(v-bind:class="{ 'form-group--error': $v.cookies.$error }")
      label.form__label Cookies
      input.form__input(v-model.trim="cookies" @blur="$v.cookies.$touch()")
    span.form-group__message(v-if='!$v.cookies.minValue')
      | Must have minimum {{ $v.cookies.$params.minValue.min }}
    pre
      | cookies: {{ $v.cookies }}
    .form-group(v-bind:class="{ 'form-group--error': $v.books.$error }")
      label.form__label Books
      input.form__input(v-model.trim="books" @blur="$v.books.$touch()")
    span.form-group__message(v-if='!$v.books.maxValue')
      | Must have maximum {{ $v.books.$params.maxValue.max }}
    pre
      | books: {{ $v.books }}
</template>

<script>
import { required, minLength, between, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      name: '',
      age: 0,
      cookies: 0,
      books: 2
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    age: {
      between: between(20, 30)
    },
    cookies: {
      minValue: minValue(1)
    },
    books: {
      maxValue: maxValue(5)
    }
  }
}
</script>
