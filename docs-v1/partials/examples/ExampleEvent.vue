<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="name", @input="setName($event.target.value)")
    .error(v-if="!$v.name.required") Field is required
    .error(v-if="!$v.name.minLength")
      | Name must have at least {{$v.name.$params.minLength.min}} letters.

    .form-group(:class="{ 'form-group--error': $v.age.$error }")
      label.form__label Age
      input.form__input(:value="age" @change="setAge($event.target.value)")
    .error(v-if="!$v.age.between")
      | Must be between {{$v.age.$params.between.min}} and {{$v.age.$params.between.max}}
    span(tabindex="0") Blur to see changes
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
  },

  methods: {
    setName(value) {
      this.name = value
      this.$v.name.$touch()
    },
    setAge(value) {
      this.age = value
      this.$v.age.$touch()
    }
  }
}
</script>
