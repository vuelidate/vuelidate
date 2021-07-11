<template>
  <div class="SimpleForm">
    <div class="lang-switcher">
      Change Language to:
      <a
        href="#"
        @click.prevent="$i18n.locale = 'bg'"
      >BG</a> |
      <a
        href="#"
        @click.prevent="$i18n.locale = 'en'"
      >EN</a>
    </div>
    <div>
      <label>name</label>
      <input
        v-model="name"
        type="text"
      >
    </div>
    <div>
      <label>twitter</label>
      <input
        v-model="social.twitter"
        type="text"
      >
    </div>
    <div>
      <label>github</label>
      <input
        v-model="social.github"
        type="text"
      >
    </div>
    <button @click="validate">
      Validate
    </button>
    <button @click="v$.$touch">
      $touch
    </button>
    <button @click="v$.$reset">
      $reset
    </button>
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of v$.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
    <pre>{{ v$ }}</pre>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength, createI18nMessage } from '@vuelidate/validators'
import { i18n } from '../i18n'

const { global: { t } } = i18n
const { withAsync } = helpers

const asyncValidator = withAsync((v) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(v === 'aaaa')
    }, 2000)
  })
})

const withI18nMessage = createI18nMessage({ t, messagePath: ({ $validator }) => `messages.${$validator}` })

const minLen = withI18nMessage(minLength, true)
const req = withI18nMessage(required)

export default {
  name: 'I18nForm',
  setup () {
    const name = ref('given name')
    const social = reactive({
      github: 'hi',
      twitter: 'hey'
    })

    let v$ = useVuelidate(
      {
        name: {
          required: req,
          asyncValidator: withI18nMessage(asyncValidator),
          minLength: minLen(10)
        },
        social: {
          github: { minLength: withI18nMessage(minLength(computed(() => social.twitter.length))) },
          twitter: { minLength: withI18nMessage(minLength(computed(() => name.value.length))) }
        }
      },
      { name, social },
      { $autoDirty: true }
    )
    return { name, v$, social }
  },
  methods: {
    async validate () {
      const result = await this.v$.$validate()
      console.log('Result is', result)
    }
  }
}
</script>
<style>
.lang-switcher a {
  color: white;
}
</style>
