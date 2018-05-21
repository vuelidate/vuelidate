<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="$v.name.$model")
    .error(v-if="!$v.name.required") Field is required
    .error(v-if="!$v.name.minLength")
      | Name must have at least {{$v.name.$params.minLength.min}} letters.
    tree-view(:data="$v.name", :options="{rootObjectKey: '$v.name', maxDepth: 2}")

    .form-group(:class="{ 'form-group--error': $v.age.$error }")
      label.form__label Age
      input.form__input(v-model.trim.lazy="$v.age.$model")
    .error(v-if="!$v.age.between")
      | Must be between {{$v.age.$params.between.min}} and {{$v.age.$params.between.max}}

    span(tabindex="0") Blur to see changes
    tree-view(:data="$v.age", :options="{rootObjectKey: '$v.age', maxDepth: 2}")
</template>

<script>
import { required, minLength, between } from 'vuelidate/lib/validators'

export default {
  data() {
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
