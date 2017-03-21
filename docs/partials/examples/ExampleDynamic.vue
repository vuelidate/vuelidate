<template lang="pug">
  div
    .form-group(v-bind:class="{ 'form-group--error': $v.name.$error}")
      label.form__label Name
      input.form__input(v-model.trim="name" @input="$v.name.$touch()")
    .form-group
      label(for="hasDesc").form__label Has description?
      .toggle
        input#hasDesc(type="checkbox", v-model="hasDescription")
        label(for="hasDesc")
          .toggle__switch
    .form-group(v-if="hasDescription" v-bind:class="{ 'form-group--error': $v.description.$error}")
      label.form__label Description
      input.form__input(v-model.trim="description" @input="$v.description.$touch()")
    pre
      | $v: {{ $v }}
</template>
<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      hasDescription: false,
      name: '',
      description: ''
    }
  },
  validations () {
    if (!this.hasDescription) {
      return {
        name: {
          required
        }
      }
    } else {
      return {
        name: {
          required
        },
        description: {
          required
        }
      }
    }
  }
}
</script>
