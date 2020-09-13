# Advanced usage

## Per component mixin

Alternatively it is possible to apply all the Vuelidate functionality to dedicated components via a mixin.

```vue
<script>
import { VuelidateMixin } from '@vuelidate/core'

export default {
  mixins: [VuelidateMixin],
  data(){ },
  validations() { }
}
</script>
```

Everything else is the same.

## Composition API

```js
import { ref } from 'vue' // or '@vue/composition-api' in Vue 2.x
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

export default {
  setup () {
    const name = ref('')
    const emailAddress = ref('')
    const rules = {
      name: { required },
      emailAddress: { required, email }
    }

    const $v = useVuelidate(rules, { name, emailAddress })

    return { name, emailAddress, $v }
  }
}
```

## Nested validations

When using `useVuelidate`, Vuelidate will collect all validation `$errors` from all nested components. No need to pass any props or listen to any events.

This is the recommended approach when handling collections. Create a new, nested component with it’s own validation rules.

::: warning
Currently this only works when child components also use `useVuelidate` to register their validation rules.
:::

```vue
<template>
  <div>
    <CompA />
    <CompB />

    <p v-for="(error, index) of $v.$errors" :key="index">
      {{ error.$message }}
    </p>
  </div>
<template>

<script>
import { useVuelidate } from '@vuelidate/core'

export default {
  setup () {
    const $v = useVuelidate() // this will contain all $errors from both <CompA> and <CompB>

    return { $v }
  }
}
</script>
```

## Validating Collections

::: warning
`$each` has been removed. Use the above solution (nested validations) instead.
:::
