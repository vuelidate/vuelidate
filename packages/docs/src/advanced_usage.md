---
title: Advanced Usage | Vuelidate
lang: en-US
---

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

When using `useVuelidate`, Vuelidate will collect all validation `$errors` and `$silentErrors` from all nested components. No need to pass any props or listen to any events. Additionally calling `$touch` in the root component will automatically call `$touch` in the nested components making building complex forms a breeze.

This is the recommended approach when handling collections. Create a new, nested component with it’s own validation rules.

```vue
<template>
  <div>
    <CompA />
    <CompB />

    // this will contain all $errors and $silentErrors from both <CompA> and <CompB>
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
    // this will collect all nested component’s validation results
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

## Returning extra data from validators

In more advanced use cases, it is necessary for a validator to return more than just a boolean, extra data to help the user.
In those cases, validators can return an object, which must have an `$invalid` key, and any other data, that the developer chooses.

```js
function validator (value) {
  if(value === 'something') return true
  return {
    $invalid: true,
    data: { message: 'The value must be "something"', extraParams: {} }
  }
}
```

The entire response can be accessed from `$params.$response` property in the validation and error objects. We can use this to show a more custom error message.

```js
const validatorWithMessage = withMessage($params => _.get($params, '$response.data.message', 'Invalid data'), validator)
```

If you need to access the data, you can just go into the `$params` property.

```js
export default {
  computed: {
    someComputed() {
      const params = this.v.someProperty.validator.$params
      return params.$response ? params.$response.$data : null
    }
  }
}
```
