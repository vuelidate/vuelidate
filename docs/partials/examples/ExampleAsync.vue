<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.username.$error, 'form-group--loading': $v.username.$pending }")
      label.form__label Username
      input.form__input(v-model.trim="$v.username.$model")
    .error(v-if="!$v.username.required")
      | Username is required.
    .error(v-if="!$v.username.isUnique")
      | This username is already registered.
    tree-view(:data="$v.username", :options="{rootObjectKey: '$v.username', maxDepth: 2}")
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      username: ''
    }
  },
  validations: {
    username: {
      required,
      isUnique(value) {
        // standalone validator ideally should not assume a field is required
        if (value === '') return true

        // simulate async call, fail for all logins with even length
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(typeof value === 'string' && value.length % 2 !== 0)
          }, 350 + Math.random() * 300)
        })
      }
    }
  }
}
</script>
