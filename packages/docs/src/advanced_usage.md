# Advanced usage

## Using component mixin

::: warning
**BREAKING CHANGE:** Since Vuelidate@2.0.0-alpha.9 the mixin has been removed. Instead, you have to use `useVuelidate` in your component’s `setup`.
You can still define your validation rules as part of the Options API.
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

When using `useVuelidate`, Vuelidate will collect all validation `$errors` and `$silentErrors` from all nested components. No need to pass any props
or listen to any events. Additionally, calling `$touch` in the root component will automatically call `$touch` in the nested components, making
building complex forms a breeze.

This is the recommended approach when handling collections. Create a new, nested component with its own validation rules.

```vue

<template>
  <div>
    <CompA />
    <CompB />

    <!-- this will contain all $errors and $silentErrors from both <CompA> and <CompB>-->
    <p v-for="error of v.$errors" :key="error.$uid">
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
**BREAKING CHANGE:** The `$each` helper has been removed from Vuelidate 2, we recommend using [Nested validations](#nested-validations) instead. If
you cannot migrate to it at this time, here are some workarounds:
:::

### Using the new forEach helper

Using the `forEach` helper from `@vuelidate/validators`, you can easily validate all properties inside a collection, without any extra components.

::: warning
**Note:** This helper will re-run every validator, for every property, in every item in your collection, on every change in the collection. This may
cause performance issues in more complex scenarios. Refer to [Nested Validators](#nested-validations) in those cases.
:::

```vue

<template>
  <div
    v-for="(input, index) in state.collection"
    :key="index"
    :class="{
        error: v$.collection.$each.$response.$errors[index].name.length,
      }"
  >
    <input v-model="input.name" type="text" />
    <div
      v-for="error in v$.collection.$each.$response.$errors[index].name"
      :key="error"
    >
      {{ error.$message }}
    </div>
  </div>
</template>
<script>
// setup in a component
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { reactive } from 'vue'

export default {
  setup () {
    const rules = {
      collection: {
        $each: helpers.forEach({
          name: {
            required
          }
        })
      }
    }
    const state = reactive({
      collection: [
        { name: '' }, { name: 'bar' }
      ]
    })
    const v = useVuelidate(rules, state)
    return { v, state }
  }
}

</script>
```

The `$response` for the validator follows the schema below, so you can use it as you wish:

```js
const result = {
  $data: [
    {
      propertyToValidate: {
        validator: boolean,
      }
    },
  ],
  $errors: [
    {
      propertyToValidate: [
        {
          $message: string, // the validator error
          $model: '', // the model that was validated
          $params: {}, // params, if validator has any
          $pending: false, // always false, no async support.
          $property: string, // the property to validate
          $response: boolean, // response
          $validator: string // validator name
        },
      ]
    },
    {
      name: []
    }
  ],
  $valid: boolean
}
```

The `$message` of the validator is just a two-dimensional array.

```js
const $message = [
  ['Collection 1 - Error 1', 'Collection 1 - Error 2'],
  ['Collection 2 - Error 1']
]
```

### Using our ValidateEach component

A simple validator provider like the shown `ValidateEach` component below comes in handy, when you just want to have a quick collection validation,
without the need for dedicated form components, and still have all the rules and collection state defined near your form data.

```vue
<!--YourForm.vue-->
<template>
  <ValidateEach
    v-for="(item, index) in collection"
    :key="index"
    :state="item"
    :rules="rules"
  >
    <template #default="{ v }">
      <div>
        <input
          v-model="v.name.$model"
          type="text"
        >
        <div
          v-for="(error, errorIndex) in v.name.$errors"
          :key="errorIndex"
        >
          {{ error.$message }}
        </div>
      </div>
    </template>
  </ValidateEach>
</template>
<script>
import { reactive } from 'vue'
import { minLength, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import ValidateEach from '@/components/ValidateEach'

export default {
  components: { ValidateEach },
  setup () {
    const rules = {
      name: {
        required,
        minLength: minLength(10)
      }
    }
    const collection = reactive([
      { name: 'foo' },
      { name: 'bar' }
    ])
    const v = useVuelidate()

    return { rules, collection, v }
  }
}
</script>
```

The `ValidateEach` component is just a simple wrapper, without any template of its own. Its sole purpose is to create Vuelidate instances and pass
them to its parent.

You can just copy/paste it from below, into your project, and it should work in both Vue 2 and Vue 3.

```vue

<script>
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'ValidateEach',
  props: ['rules', 'state', 'options'],
  setup (props) {
    const v = useVuelidate(props.rules, props.state, props.options)
    return { v }
  },
  render () {
    return ('$scopedSlots' in this ? this.$scopedSlots : this.$slots).default({ v: this.v })
  }
}
</script>
```

## Validation scopes

As we learned in [Nested Validations](#nested-validations), you can rely on the parent component to collect validation results from its children.
There are cases where we need to limit which forms get collected by the parent.

This is where the `$scope` and `$stopPropagation` properties come in handy. These are configuration settings, that can be passed as a third parameter
to the `useVuelidate` composable.

### $scope property

The `$scope` property has three main use cases:

1. `true` (Collect all) - collect results from all and emits to all, this is the default setting. This means that each component that
   uses `useVuelidate`, can collect results from validation children, and emit to parent components.
2. `false` (Collect none) - collect no validation results and emit none.
3. `string|number|symbol` (Specific scope) - collect and emit results, only to/from components, that have the same scope.

**Example using $scope**

```js
// component that should not collect/emit eny resulsts.
const IsolatedComponent = {
  setup () {
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
  setup (props) {
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
  setup () {
    const scope = 'foo'
    const validations = {}
    const state = {}
    // collects validations from `ChildComponent` but not from `IsolatedComponent`.
    const v = useVuelidate(validations, state, { $scope: scope })
    return { v, scope }
  },
  template: '<ChildComponent :scope="scope"/><IsolatedComponent />'
}
```

### $stopPropagation property

The `$stopPropagation` is used to stop emitting results up to parents, but still collect everything from children. Example use case would be a modal,
which has its own validations, and shouldn't emit results to the outer forms.

```js
export default {
  components: { ChildComponent },
  setup () {
    // collects validations from `ChildComponent` but does not emit it up to parent validations.
    const v = useVuelidate(validations, state, { $stopPropagation: true })
    return { v }
  }
}
```

### Collector only components

A collector only component is the top level component, in a chain of form validations. This component is used most often just to show error messages,
and has no validation or state.

In such cases, you can just call `useVuelidate` without any parameters:

```js
// a collector only component
export default {
  setup: () => ({ v: useVuelidate() })
  // ...other settings
}
```

:::tip You can pass validation configs as a single parameter to `useVuelidate`

- [Passing a single parameter to useVuelidate](#passing-a-single-parameter-to-usevuelidate)
  :::

## Returning extra data from validators

In more advanced use cases, it is necessary for a validator to return more than just a boolean, extra data to help the user. In those cases,
validators can return an object, which must have a `$valid` key, and any other data, that the developer chooses.

```js
function validator (value) {
  if (value === 'something') return true
  return {
    $valid: false,
    data: { message: 'The value must be "something"', extraParams: {} }
  }
}
```

The entire response can be accessed from `$response` property in the validation and error objects. We can use this to show a more custom error
message.

```js
const validatorWithMessage = withMessage(({ $response }) => $response ? $response.data.message : 'Invalid Data', validator)
```

If you need to access the data, you can just go into the `$response` property.

```js
export default {
  computed: {
    someComputed () {
      const params = this.v.someProperty.validatorName.$response
    }
  }
}
```

## Providing global config to your Vuelidate instance

You can provide global configs to your Vuelidate instance using the third parameter of `useVuelidate` or by using the `validationsConfig`. These
config options are used to change some core Vuelidate functionality, like `autoDirty`, `lazy`, `scope` and more. Learn all about them
in [Validation Configuration](./api/configuration.md).

### Config with Options API

If you prefer the Options API, you can specify a `validationConfig` object, that Vuelidate will read configs from.

```vue

<script>
import { useVuelidate } from '@vuelidate/core'

export default {
  data () {
    return { ...state }
  },
  validations () {
    return { ...validations }
  },
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
  }
}
</script>
```

### Config with Composition API

When using the Composition API, you can pass your configuration object as the third parameter to `useVuelidate`.

```js
import { reactive } from 'vue' // or '@vue/composition-api' in Vue 2.x
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

export default {
  setup () {
    const state = reactive({})
    const rules = {}
    const v$ = useVuelidate(rules, state, { $lazy: true })

    return { state, v$ }
  }
}
```

#### Passing a single parameter to useVuelidate

A common scenario is to call `useVuelidate()` without passing any state or validations, usually in validation collector components. In such cases you
can pass global configs like `$scope` or `$stopPropagation` as a single parameter to `useVuelidate()`.

```js
import { useVuelidate } from '@vuelidate/core'
import FormA from '@/componnets/FormA'
import FormB from '@/componnets/FormB'

export default {
  components: { FormA, FormB },
  setup: () => ({ v$: useVuelidate({ $stopPropagation: true }) })
}
```
