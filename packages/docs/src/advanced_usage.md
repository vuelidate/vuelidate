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
    return {
      name: 'John',
      requiredNameLength: 2
    }
  },
  validations () {
    return {
      name: {
        minLength: minLength(this.requiredNameLength),
        required
      }
    }
  }
}
</script>
```

## Composition API

Vuelidate is primarily built on top of the Composition API, so its best suited to work with it.

### Using an object of `refs`

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

### Using `reactive` state

```js
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

export default {
  setup () {
    const state = reactive({
      name: 'foo'
    })
    const requiredNameLength = ref(2)
    const rules = computed(() => ({
      name: {
        required,
        minLength: minLength(requiredNameLength.value)
      },
    }))

    const v$ = useVuelidate(rules, state)

    return { name, requiredNameLength, v$ }
  }
}
```

## Nested validations

When using `useVuelidate`, Vuelidate will collect all validation `$errors` and `$silentErrors` from all nested components. No need to pass any props or listen to any events. Additionally, calling `$touch` in the root component will automatically call `$touch` in the nested components, making building complex forms a breeze.

This is the recommended approach when handling collections. Create a new, nested component with its own validation rules.

```vue
<template>
  <div>
    <CompA />
    <CompB />

    <!-- this will contain all $errors and $silentErrors from both <CompA> and <CompB>-->
    <p v-for="(error, index) of v.$errors" :key="index">
      {{ error.$message }}
    </p>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import CompA from '@/components/CompA'
import CompB from '@/components/CompB'

export default {
  components: { CompA, CompB },
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

## Validation scopes

As we learned in [Nested Validations](#nested-validations), you can rely on the parent component to collect validation results from its children. There are cases where we need to limit which forms get collected by the parent.

This is where the `$scope` and `$stopPropagation` properties come in handy. These are configuration settings, that can be passed as a third parameter to the `useVuelidate` composable.

### $scope property

The `$scope` property has three main use cases:

1. `true` (Collect all) - collect results from all and emits to all, this is the default setting. This means that each component that uses `useVuelidate`, can collect results from validation children, and emit to parent components.
2. `false` (Collect none) - collect no validation results and emit none.
3. `string` (Specific scope) - collect and emit results, only to/from components, that have the same scope.

**Example using $scope**

```js
// component that should not collect/emit eny resulsts.
const IsolatedComponent = {
  setup(){
    const validations = {}
    const state = {}
    // do not send or collect any validations
    const v = useVuelidate(validations, state, { $scope: false })
    return { v }
  }
  // .. other stuff
}

// child component that emits validations
const ChildComponent = {
  setup(props) {
    const validations = {}
    const state = {}
    // sends validations to its parent, if it has the same scope.
    const v = useVuelidate(validations, state, { $scope: props.scope })
    return { v }
  },
  // .. other stuff
}

// Parent component that collects child validations
const ParentComponent = {
  components: { ChildComponent, IsolatedComponent },
  setup() {
    const scope = 'foo'
    const validations = {}
    const state = {}
    // collects validations from `ChildComponent` but does not emit it up to parent validations.
    const v = useVuelidate(validations, state, { $scope: scope })
    return { v, scope }
  },
  template: '<ChildComponent :scope="scope"/><IsolatedComponent />'
}
```

### $stopPropagation property

The `$stopPropagation` is used to stop emitting results up to parents, but still collect everything from children. Example use case would be a modal, which has its own validations, and shouldn't emit results to the outer forms.

```js
export default {
  components: { ChildComponent },
  setup() {
    // collects validations from `ChildComponent` but does not emit it up to parent validations.
    const v = useVuelidate(validations, state, { $stopPropagation: true })
    return { v }
  }
}
```

### Collector only components

A collector only component is the top level component, in a chain of form validations. This component is used most often just to show error messages, and has no validation or state.

In such cases, you can just call `useVuelidate` without any parameters, or pass only the configurations object.

```js
// a collector only component
export default {
  setup: () => ({ v: useVuelidate({ $stopPropagation: true }) })
  // ...other settings
}
```

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

The entire response can be accessed from `$response` property in the validation and error objects. We can use this to show a more custom error message.

```js
const validatorWithMessage = withMessage(({ $response }) => $response ? $response.data.message: 'Invalid Data', validator)
```

If you need to access the data, you can just go into the `$response` property.

```js
export default {
  computed: {
    someComputed() {
      const params = this.v.someProperty.validatorName.$response
    }
  }
}
```
