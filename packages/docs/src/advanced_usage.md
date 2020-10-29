# Advanced usage

## Using component mixin

::: warning
**BREAKING CHANGE:** Since Vuelidate@2.0.0-alpha.9 the mixin has been removed. Instead, you have to use `useVuelidate` in your component’s `setup`. You can still define your validation rules as part of the Options API.
:::

```vue
<script>
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

export default {
  setup () { return { v$: useVuelidate() } },
  data () {
    name: 'John',
    requiredNameLength: 2
  },
  validations () {
    name: {
      minLength: minLength(this.requiredNameLength),
      required
    }
  }
}
</script>
```

## Composition API

```js
import { ref, computed } from 'vue' // or '@vue/composition-api' in Vue 2.x
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

export default {
  setup () {
    const name = ref('')
    const requiredNameLength = ref(2)
    const rules = computed(() => ({
      name: {
        required,
        minLength: minLength(requiredNameLength.value)
      },
    }))

    const v$ = useVuelidate(rules, { name })

    return { name, requiredNameLength, v$ }
  }
}
```

## Nested validations

When using `useVuelidate`, Vuelidate will collect all validation `$errors` from all nested components. No need to pass any props or listen to any events.

This is the recommended approach when handling collections. Create a new, nested component with it’s own validation rules.

```vue
<template>
  <div>
    <CompA />
    <CompB />

    <p v-for="(error, index) of v.$errors" :key="index">
      {{ error.$message }}
    </p>
  </div>
<template>

<script>
import { useVuelidate } from '@vuelidate/core'
import CompA from '@/components/CompA'
import CompB from '@/components/CompB'

export default {
  components: { CompA, CompB }
  setup () {
    // this will contain all $errors and $silentErrors from both <CompA> and <CompB>
    const v = useVuelidate()

    return { v }
  }
}
</script>
```

## Validating Collections

::: warning
**BREAKING CHANGE:** The `$each` helper has been removed. Use the above solution (nested validations) instead.
:::
