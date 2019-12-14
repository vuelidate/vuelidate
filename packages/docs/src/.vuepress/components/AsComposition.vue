<template>
  <div>
    <h2>As Composition</h2>
    <hr />
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
    <pre>{{ $v }}</pre>
    <hr />
    <label>User required key length: </label>
    <input type="number" v-model.number="keyLength">
    <pre>{{ $vUser }}</pre>
  </div>
</template>

<script>
import { ref, reactive } from '@vue/composition-api'

import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs, helpers } from '@vuelidate/validators/dist/raw'

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
        minLength(minimumLength),
        ({ $params }) => `Has to be at least ${$params.length} characters long`
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

  const $v = useVuelidate(
    rules, { password, repeatPassword }, 'usePassword'
  )

  return {
    $v,
    password,
    repeatPassword,
    rules
  }
}

const hasKeys = keyLength => value => Object.keys(value).length === unwrap(keyLength)
const hasKeysWithParams = keys => withParams({ keys }, hasKeys(keys))

export default {
  setup () {
    const minimumLength = ref(7)
    const { password, repeatPassword, $v } = usePassword({ minimumLength })

    const keyLength = ref(3)
    const user = reactive({
      firstName: '',
      lastName: ''
    })
    const userRules = {
      hasKeys: withMessage(
        ({ $params }) => `Should have exactly ${$params.keys} keys.`,
        hasKeysWithParams(keyLength)
      ),
      firstName: { required },
      lastName: { required }
    }

    const $vUser = useVuelidate({ user: userRules }, { user }, 'useUser')

    return { password, repeatPassword, $v, minimumLength, $vUser, keyLength }
  }
}
</script>
