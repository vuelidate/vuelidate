<template lang="pug">
  div
    div(v-for="(person, index) in people")
      .form-group(v-bind:class="{ 'form-group--error': $v.people.$each[index].$error }")
        label.form__label Name for {{ index }}
        input.form__input(v-model.trim="person.name" @input="$v.people.$each[index].name.$touch()")
      span.form-group__message(v-if="!$v.people.$each[index].name.required") Name is required.
      span.form-group__message(v-if="!$v.people.$each[index].name.minLength")
        | Name must have at least {{ $v.people.$each[index].name.$params.minLength.min }} letters.

    div
      button.button(@click="people.push({name: ''})") Add
      button.button(@click="people.pop()") Remove
    .form-group(v-bind:class="{ 'form-group--error': $v.people.$error }")
    span.form-group__message(v-if="!$v.people.minLength")
      | List must have at least {{ $v.people.$params.minLength.min }} elements.
    span.form-group__message(v-else-if="!$v.people.required") List must not be empty.
    span.form-group__message(v-else-if="$v.people.$error") List is invalid.
    button.button(@click="$v.people.$touch") $touch
    button.button(@click="$v.people.$reset") $reset

    pre
      | people: {{ $v.people }}
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      people: [{
        name: 'John'
      }, {
        name: ''
      }]
    }
  },
  validations: {

    people: {
      required,
      minLength: minLength(3),
      $each: {
        name: {
          required,
          minLength: minLength(2)
        }
      }
    }

  }
}
</script>
