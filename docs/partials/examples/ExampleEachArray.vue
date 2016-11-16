<template lang="pug">
  div
    div(v-for="(person, index) in people")
      .form-group(v-bind:class="{ 'form-group--error': $v.people.$each[index].$error }")
        label.form__label Name for {{ index }}
        input.form__input(v-model="person.name" @input="$v.people.$each[index].name.$touch()")
      span.form-group__message(v-if="!$v.people.$each[index].name.required") Name is required.

    div
      button.button(@click="people.push({name: ''})") Add
      button.button(@click="people.pop()") Remove
    .form-group(v-bind:class="{ 'form-group--error': $v.people.$error }")
    span.form-group__message(v-if="$v.people.$error") List is invalid.

    pre
      | people: {{ $v.people }}
</template>

<script>
import { required, minLength } from 'vue-validations/lib/validators'

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
      minLength: minLength(1),
      $each: {
        name: {
          required
        }
      }
    }

  }
}
</script>
