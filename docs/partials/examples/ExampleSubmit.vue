<template lang="pug">
  form(@submit.prevent="submit")
    .form-group(:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="$v.name.$model")
    .error(v-if="!$v.name.required") Name is required
    .error(v-if="!$v.name.minLength")
      | Name must have at least {{$v.name.$params.minLength.min}} letters.

    button.button(type="submit" :disabled="submitStatus === 'PENDING'") Submit!

    p.typo__p(v-if="submitStatus === 'OK'") Thanks for your submission!
    p.typo__p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
    p.typo__p(v-if="submitStatus === 'PENDING'") Sending...
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      name: '',
      age: 0,
      submitStatus: null
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    }
  },
  methods: {
    submit() {
      console.log('submit!')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.submitStatus = 'PENDING'
        setTimeout(() => {
          this.submitStatus = 'OK'
        }, 500)
      }
    }
  }
}
</script>
