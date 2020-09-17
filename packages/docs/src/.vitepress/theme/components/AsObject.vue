<template>
  <div>
    <label>Minimal password length</label>
    <input type="number" v-model.number="minimumLength">
    <hr />
    <label>Password: </label>
    <input type="text" v-model="password">
    <br>
    <label>Repeat Password: </label>
    <input type="text" v-model="repeatPassword">
    <p
      v-for="(error, index) of $v.$errors"
      :key="index"
      :style="error.$pending ? 'color: blue;' : 'color: red;'"
    >
      <strong>{{ error.$validator }}</strong>
      <small style="color: black"> on property</small>
      <strong>{{ error.$property }}</strong>
      <small style="color: black"> says:</small>
      <strong>{{ error.$message }}</strong>
    </p>
  </div>
</template>

<script>
import { VuelidateMixin } from '@vuelidate/core'

import { required, minLength, sameAs, helpers } from '@vuelidate/validators'

const { withMessage, withParams, unwrap } = helpers

function asyncValidator (v) {
  return new Promise(resolve => {
    console.log('called')
    setTimeout(() => {
      console.log('resolved')
      resolve(v === 'aaaa')
    }, 2000)
  })
}

function $t (key, params) {
  return {
    'errors.sameAs': `It has to be the same as ${params}`
  }[key]
}

export default {
  name: 'AsObject',
  mixins: [VuelidateMixin],
  data () {
    return {
      minimumLength: 7,
      password: '',
      repeatPassword: ''
    }
  },
  validations () {
    return {
      password: {
        required: withMessage('This field is required', required),
        minLength: withMessage(
          ({ $params }) => `Has to be at least ${$params.count} characters long`,
          withParams({ count: this.minimumLength }, minLength(this.minimumLength))
        ),
        asyncValidator: withMessage(
          ({ $pending, $model }) => $pending ? 'Checking!' : `Error! ${$model} Isn’t "aaaa"`,
          asyncValidator
        ),
        $autoDirty: true
      },
      repeatPassword: {
        required,
        sameAs: withMessage(
          ({ $params }) => $t('errors.sameAs', $params.equalTo),
          withParams({ equalTo: this.password }, sameAs(this.password))
        ),
        $autoDirty: true
      }
    }
  }
}
</script>
