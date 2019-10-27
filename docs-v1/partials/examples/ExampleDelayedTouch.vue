<template lang="pug">
  div
    .form-group(:class="{ 'form-group--error': $v.name.$error }")
      label.form__label Name
      input.form__input(v-model.trim="name" @input="delayTouch($v.name)")
    .error(v-if="!$v.name.required") Field is required
    .error(v-if="!$v.name.minLength")
      | Name must have at least {{$v.name.$params.minLength.min}} letters.
    .error(v-if="!$v.name.maxLength")
      | Name must have at most {{$v.name.$params.maxLength.max}} letters.

    tree-view(:data="$v.name", :options="{rootObjectKey: '$v.name', maxDepth: 2}")
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

const touchMap = new WeakMap()

export default {
  data() {
    return {
      name: ''
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(15)
    }
  },
  methods: {
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    }
  }
}
</script>
