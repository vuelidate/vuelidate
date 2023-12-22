# Advanced usage

## Using component mixin

::: warning
**BREAKING CHANGE:** Since Vuelidate@2.0.0-alpha.9 the mixin has been removed. Instead, you have to use `useVuelidate` in your component’s `setup`.
You can still define your validation rules as part of the Options API.
:::

```vue

<script>
import { useVuelidate } from '@vuelidate/core'
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
import { ref, computed } from 'vue' // or '@vue/composition-api' in Vue <2.7
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

::: warning
`useVuelidate` returns a `computed`, so you need to use `.value` when accessing any of it's properties, like `$error`, `$validate` inside the `setup` function.

In the template it is unwrapped for you.
:::

### Using `reactive` state

```js
import { ref, computed, reactive } from 'vue'
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

### Using mixed (e.g. `reactive` and `computed`) state

```js
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minValue, required } from '@vuelidate/validators'

export default {
  setup () {
    // reactive state, e.g. form data
    const data = reactive({
      type: '',
      name: '',
      targetMonth: new Date().getMonth(),
      targetYear: new Date().getFullYear()
    })
    // computed state which needs validation
    const targetDate = computed(() => new Date(data.targetYear, data.targetMonth + 1, 0)) // last day in the month

    const rules = {
      data: {
        type: { required },
        name: { required }
      },
      targetDate: { minValue: minValue(new Date()) },
    }

    const v$ = useVuelidate(rules, { data, targetDate })

    return { data, v$ }
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
import { useVuelidate } from '@vuelidate/core'
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

Each validator function is passed 3 parameters - `rule(value, object, vm)`
1. The value of the property, for iterated object
2. The current iterated object, aka siblings to property
3. The component instance

### Using the ValidateEach component

A simple validator provider like the `ValidateEach` component below comes in handy, when you just want to have a quick collection validation, without
the need for dedicated form components. This would allow you to keep all the rules and state defined near your form data.

```vue

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
import { useVuelidate } from '@vuelidate/core'
import { ValidateEach } from '@vuelidate/components'
import { minLength, required } from '@vuelidate/validators'

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
them to its parent, and children as scoped slot parameters.

You can find `ValidateEach` inside the `@vuelidate/components` package.

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
// component that should not collect/emit any result.
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

:::tip
**Note:** You can pass validation configs as a single parameter to `useVuelidate`

- [Passing a single parameter to useVuelidate](#passing-a-single-parameter-to-usevuelidate)
  :::

## Returning extra data from validators

In more advanced use cases, a validator needs to return more than just a boolean, rather extra data to help the user understand the error. In those
cases, validators can return an object, which must have a `$valid` key, and any other data, that the developer chooses.

```js
function validator (value) {
  if (value === 'something') return { $valid: true }
  return {
    $valid: false,
    message: 'The value must be "something"',
    extraParams: {}
  }
}
```

The entire response can be accessed from `$response` property in the validation and error objects.

```json5
{
  "v$": {
    "name": {
      "validator": {
        "$error": true,
        "$invalid": true,
        "$dirty": true,
        "$response": {
          "$valid": false,
          "message": "The value must be 'something'",
          "extraParams": {}
        },
        // other properties
      }
    }
  }
}
```

We can use this to show a more custom error message.

```js
const validatorWithMessage = withMessage(({ $response }) => $response?.message || 'Invalid Data', validator)
```

If you need to access the data, you can just go into the `$response` property.

```js
export default {
  computed: {
    someComputed () {
      const params = this.v$.name.validatorName.$response
    }
  }
}
```

## Providing global config to your Vuelidate instance

You can provide configurations to your Vuelidate instance using the third parameter of `useVuelidate` or by using the `validationsConfig` for Options
API. These config options can be used to change some core Vuelidate functionality, like `$autoDirty`, `$lazy`, `$scope` and more. Read about each one
in [Validation Configuration](./api/configuration.md).

### Config with Options API

#### Using `validationConfig`

If you are using the Options API, you can specify a `validationConfig` object, that Vuelidate will read configs from.

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

#### Using the config object of useVuelidate

An alternative is to use the first parameter of `useVuelidate` to pass a config object,
see [Passing a single parameter to useVuelidate](#passing-a-single-parameter-to-usevuelidate) for more info.

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
  setup: () => ({ v$: useVuelidate({ $lazy: true, $autoDirty: true, $scope: 'foo' }) }),
}
</script>
```

### Config with Composition API

When using the Composition API, you can pass your configuration object as the third parameter to `useVuelidate`, or as the first one, if the component
is just a collector, see [Passing a single parameter to useVuelidate](#passing-a-single-parameter-to-usevuelidate).

```js
import { reactive } from 'vue' // or '@vue/composition-api' in Vue <2.7
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
can pass global configs like `$scope`, `$stopPropagation` as a single parameter to `useVuelidate()`.

```js
import { useVuelidate } from '@vuelidate/core'
import FormA from '@/componnets/FormA'
import FormB from '@/componnets/FormB'

export default {
  components: { FormA, FormB },
  setup: () => ({ v$: useVuelidate({ $stopPropagation: true, $scope: 'foo' }) })
}
```

## Providing external validations, server side validation

To provide validation messages from an external source, like from a server side validation response, you can use the `$externalResults` functionality.
Each property in the validated state can have a corresponding string or array of strings as response message. This works with both Composition API and
Options API.

### External results with Composition API

When using the Composition API, you can pass a `reactive` or `ref` object, to the `$externalResults` global config.

```js
// inside setup
const state = reactive({ foo: '' });
const $externalResults = ref({}) // works with reactive({}) too.

const rules = { foo: { someValidation } }
const v = useVuelidate(rules, state, { $externalResults })

// validate method
async function validate () {
  // check if everything is valid
  if (!await v.value.$validate()) return
  await doAsyncStuff()
  // do server validation, and assume we have these errors
  const errors = {
    // foo: 'error', is also supported
    foo: ['Error one', 'Error Two']
  }
  // add the errors into the external results object
  $externalResults.value = errors
  // if using a `reactive` object instead,
  // Object.assign($externalResults, errors)
}

return { v, validate }
```

### External results with Options API

When using the Options API, you can either define a `vuelidateExternalResults` data property, and assign the errors to it. You can also pass
an `$externalResults` property to the `useVuelidate` config object.

It is a good practice to pre-define your external results keys, to match your form structure, otherwise Vue may have a hard time tracking changes.

#### Using `vuelidateExternalResults` property

```js
export default {
  data () {
    return {
      foo: '',
      vuelidateExternalResults: {
        foo: []
      }
    }
  },
  validations () {
    return {
      foo: { someValidation }
    }
  },
  methods: {
    validate () {
      // perform validations
      const errors = { foo: ['Error one', 'Error Two'] }
      // merge the errors into the validation results
      Object.assign(this.vuelidateExternalResults, errors)
    }
  }
}
```

#### Using `$externalResults` config

```js
export default {
  data: () => ({ foo: '' }),
  validations () {
    return {
      foo: { someValidation }
    }
  },
  setup: () => {
    const externalResults = ref()
    return {
      externalResults,
      v: useVuelidate({ $externalResults: externalResults })
    }
  },
  methods: {
    validate () {
      // perform validations
      const errors = { foo: ['Error one', 'Error Two'] }
      // merge the errors into the validation results
      Object.assign(this.externalResults, errors)
    }
  }
}
```

### Clearing $externalResults

If you are using `$model` to modify your form state, Vuelidate automatically will clear any corresponding external results.

If you are using `$autoDirty: true`, then Vuelidate will track any changes to your form state and reset the external results as well, no need to
use `$model`

If you need to clear the entire object, use the handy `$clearExternalResults()` method, that Vuelidate provides. It will properly handle both `ref`
and `reactive` objects.

```js
async function validate () {
  // clear out old external results
  v.value.$clearExternalResults()
  // check if everything is valid
  if (!await v.value.$validate()) return
  //
}
```

## i18n support

Validator messages are very flexible. You can wrap each validator with a helper, that returns a translated error message, based on the validator name.
Vuelidate already exports one for you, but you are free to create your own.

```js
// @/utils/i18n-validators.js
import * as validators from '@vuelidate/validators'
import { i18n } from "@/i18n"

// or import { createI18nMessage } from '@vuelidate/validators'
const { createI18nMessage } = validators

// Create your i18n message instance. Used for vue-i18n@9
const withI18nMessage = createI18nMessage({ t: i18n.global.t.bind(i18n) })
// for vue-i18n@8
// const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })

// wrap each validator.
export const required = withI18nMessage(validators.required)
// validators that expect a parameter should have `{ withArguments: true }` passed as a second parameter, to annotate they should be wrapped
export const minLength = withI18nMessage(validators.minLength, { withArguments: true })
// or you can provide the param at definition, statically
export const maxLength = withI18nMessage(validators.maxLength(10))
```

We can now use the validators as we normally do:

```vue

<script>
import { required, minLength } from '@/utils/i18n-validators'

export default {
  validations () {
    return {
      name: { required, minLength: minLength(10) }
    }
  }
}
</script>
```

The translations for the validation messages, with optional data inside each message can be defined like this:

```en.json
{
  "validations": {
    "required": "The field {property} is required.",
    "minLength": "The {property} field has a value of '{model}', but it must have a min length of {min}."
  }
}
```

### Customising the i18n message

The `t` function is responsible for doing the actual translation. It gets two parameters, a path and an object.

1. The path is a `string`, representing the path for the validation message, it looks like `validations.${validator}`. This means that by default,
   validation messages, are expected to live under the `validations` key in your translations.

2. The second parameter is an object, with similar properties as the one passed to `withMessage` functions. Mind that properties do not have `$`
   prefixed, this is intentional, as vue-i18n does not like those.

```
{
    model: any,
    property: string,
    pending: boolean,
    invalid: boolean,
    response: any,
    validator: string,
    propertyPath: string,
    ...props.$params
}
```

If you wish to change the way `t` retrieves validation messages, you can pass a `messagePath` property to `createI18nMessage`. It will allow you to
specify your own translation message paths. It gets access to the same params as the `withMessage` function, like the validator name, model etc.

```js
// change the path for fetching validator messages
const messagePath = ({ $validator }) => `messages.${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

const required = withI18nMessage(validators.required)

```

:::tip
**Note:** You can also pass a `messagePath` or `messageParams` function to `withI18nMessage` to override the global ones, on a per validator basis.
:::

```js
const required = withI18nMessage(validators.required, { messagePath: () => 'overrides.required' })
```

## Calling useVuelidate from async setup function

In situations where you need to call useVuelidate from outside your setup function, or in an async setup function, you should use
the `currentVueInstance` config to pass the component's vue instance.

```js
export default {
  render: () => {},
  async setup () {
    const currentVueInstance = getCurrentInstance()?.proxy
    const result = await doAsyncStuff()
    const vuelidate = useVuelidate(rules, result.state, { currentVueInstance })
    return { vuelidate }
  }
}
```

## Validation Groups

You may want to group a few validation rules under one roof, in which case a validation group is a perfect choice.

To create a validation group, you must specify a config property at the top level of your rules, called `$validationGroups`.

This is an object that holds the name of your groups and an array of property paths, which will be the group itself.

```js
const rules = {
  number: { isEven },
  nested: {
    word: { required: v => !!v }
  },
  $validationGroups: {
    firstGroup: ['number', 'nested.word']
  }
}
```

In the above example, it will create a group called `firstGroup` that will reflect the state of `number` and `nested.word`.

You can see all your defined groups in the `v$.$validationGroups` property of your vue instance.

The group has the typical properties of other validations:

```ts
interface ValidationGroupItem {
  $invalid: boolean,
  $error: boolean,
  $pending: boolean,
  $errors: ErrorObject[],
  $silentErrors: ErrorObject[]
}
```
