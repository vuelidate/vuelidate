<template>
  <div class="SimpleForm">
    <input
      v-model="name"
      type="text"
    >
    <button @click="validate">Validate</button>
    <pre>{{ v$ }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

const { withAsync } = helpers

const asyncValidator = withAsync((v) => {
  return new Promise(resolve => {
    console.log('called')
    setTimeout(() => {
      console.log('resolved')
      resolve(v === 'aaaa')
    }, 2000)
  })
})

export default {
  name: 'SimpleForm',
  setup () {
    const name = ref('')

    let v$ = useVuelidate(
      { name: { required, asyncValidator } },
      { name }
    )
    return { name, v$ }
  },
  methods: {
    validate () {
      this.v$.$validate().then((result) => {
        console.log('Result is', result)
      })
    }
  }
}
</script>
