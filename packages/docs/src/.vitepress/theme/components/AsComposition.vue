<template>
  <div style="padding-top: 2rem;">
    <div style="margin-bottom: 20px">
      <label>Minimal password length</label>
      <input type="number" v-model.number="minimumLength">
    </div>
    <div style="margin-bottom: 10px">
      <label>Password: </label>
      <input type="text" v-model="password">
    </div>
    <div style="margin-bottom: 10px">
      <label>Repeat Password: </label>
      <input type="text" v-model="repeatPassword">
    </div>
    <p
      v-for="(error, index) of vuelidate.$errors"
      :key="index"
      :style="error.$pending ? 'color: blue;' : 'color: red;'"
    >
      <strong>{{ error.$validator }}</strong>
      <small style="color: black"> on property</small>
      <strong>{{ error.$property }}</strong>
      <small style="color: black"> says:</small>
      <strong>{{ error.$message }}</strong>
    </p>
    <pre style="background-color: white;">{{ vuelidate.$errors }}</pre>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'

const { withMessage, withParams, unwrap } = helpers

function $t (key, params) {
  return {
    'errors.sameAs': `It has to be the same as ${params}`
  }[key]
}

function asyncValidator (v) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(v === 'aaaa')
    }, 2000)
  })
}

function usePassword ({ minimumLength }) {
  const password = ref('')
  const repeatPassword = ref('')

  const rules = {
    password: {
      required: withMessage('This field is required', required),
      minLength: withMessage(
        ({ $params }) => `Has to be at least ${$params.length} characters long`,
        minLength(minimumLength)
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
        sameAs(password)
      ),
      $autoDirty: true
    }
  }

  const vuelidate = useVuelidate(
    rules, { password, repeatPassword }, 'usePassword'
  )

  return {
    vuelidate,
    password,
    repeatPassword,
    rules
  }
}

const hasKeys = keyLength => value => Object.keys(value).length === unwrap(keyLength)
const hasKeysWithParams = keys => withParams({ keys }, hasKeys(keys))

export default {
  name: 'AsComposition',
  setup () {
    const minimumLength = ref(7)
    const { password, repeatPassword, vuelidate } = usePassword({ minimumLength })

    return { password, repeatPassword, vuelidate, minimumLength }
  }
}
</script>
