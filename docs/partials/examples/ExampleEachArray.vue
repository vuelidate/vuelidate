<template lang="pug">
  div
    div(v-for="(v, index) in $v.people.$each.$iter")
      .form-group(:class="{ 'form-group--error': v.$error }")
        label.form__label Name for {{ index }}
        input.form__input(v-model.trim="v.name.$model")
      .error(v-if="!v.name.required") Name is required.
      .error(v-if="!v.name.minLength")
        | Name must have at least {{ v.name.$params.minLength.min }} letters.
    div
      button.button(@click="people.push({name: ''})") Add
      button.button(@click="people.pop()") Remove
    .form-group(:class="{ 'form-group--error': $v.people.$error }")
    .error(v-if="!$v.people.minLength")
      | List must have at least {{ $v.people.$params.minLength.min }} elements.
    .error(v-else-if="!$v.people.required") List must not be empty.
    .error(v-else-if="$v.people.$error") List is invalid.
    button.button(@click="$v.people.$touch") $touch
    button.button(@click="$v.people.$reset") $reset
    tree-view(:data="$v.people", :options="{rootObjectKey: '$v.people', maxDepth: 2}")
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      people: [
        {
          name: 'John'
        },
        {
          name: ''
        }
      ]
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
