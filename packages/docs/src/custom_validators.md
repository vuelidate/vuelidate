# Custom Validators

You can easily write custom validators and combine them with builtin ones, as those are just a simple predicate functions.

## Simple example

Suppose you want a validator that checks if a string contains the word `cool` in it. You can write a plain JavaScript function to check that:

```js
const mustBeCool = (value) => value.includes('cool')
```

The second part is actually applying your validator. You can do it exactly the same way as with builtin ones.

```js
export default {
  data () {
    return {
      myField: 'cool'
    }
  },
  validations () {
    return {
      myField: {
        required, mustBeCool
      }
    }
  }
}
```

## Optional validator

The pattern presented above is often good enough, but this validator will always return `false` for empty inputs. This is not correct when your input
is considered optional. For this reason, Vuelidate provides a `req` helper, which is a kinda stripped-down version of `required` validator. You can
use it to make your validator behave well in presence of optional fields.

```js
import { helpers } from '@vuelidate/validators'

const mustBeCool = (value) => !helpers.req(value) || value.includes('cool')

export default {
  data () {},
  validations () {
    return {
      myField: {
        mustBeCool
      }
    }
  }
}
```

## Extra parameters

If your validator needs to provide parameters, you can simply create a higher order function that returns the actual validator, like in `between`
builtin validator.

```js
import { helpers } from '@vuelidate/validators'

const contains = (param) => (value) =>
  !helpers.req(value) || value.includes(param)

export default {
  data () {},
  validations () {
    return {
      myField: {
        mustBeCool: contains('cool')
      }
    }
  }
}
```

## Passing extra properties to validators

If you need to attach extra properties to your validation result, to display in error messages for example, you can use the `withParams` helper. It
will attach a `$props` attribute on your validation result. Let's add a `type` property, so that we can later retrieve it.

:::tip
`$props` is reactive, which means you could add `computed` properties, `ref` or other, and they will update accordingly.
:::

```js
import { helpers } from '@vuelidate/validators'

const mustBeCool = helpers.withParams(
  { type: 'mustBeCool' },
  (value) => !helpers.req(value) || value.includes('cool')
)

// ...

console.log(this.$v.myField.mustBeCool.$params)
// -> { type: 'mustBeCool' }
```

The same behaviour extends to higher order validators, ones with extra parameters. You just must be careful to wrap the **inner** function
with `withParams` call, as follows.

```js
import { helpers } from '@vuelidate/validators'

const contains = (param) =>
  helpers.withParams(
    { type: 'contains', value: param },
    (value) => !helpers.req(value) || value.includes('cool')
  )

export default {
  validations () {
    return {
      myField: {
        mustBeCool: contains('cool')
      }
    }
  },
  created () {
    console.log(this.$v.myField.mustBeCool.$params)
    // -> { type: 'contains', value: 'cool' }
  }
}
```

## Accessing component instance from validator

In more complex cases when access to the whole model is necessary, you can make use of the function context (`this`), or the second parameter - `vm`
to access any value on your component, this includes computed properties and data properties.

```js
// both equivalent
const otherFieldContainsMe = (value, vm) =>
  vm.other.nested.field.contains(value)

function otherFieldContainsMe (value) {
  return this.other.nested.field.contains(value)
}
```

:::warning

When using with Composition API, `vm` and `this` may not have your state on initial call. This is because the composition state has not yet been
attached to the Vue instance yet. To work around this, you can either use the `$lazy` option, or use `await nextTick()` in your validator.

:::

## regex based validator

Some validators can be easily expressed as `regex`. You can use a regex helper to quickly define full-fledged validator of this kind. This already
includes handling optional fields and `$params`.

```js
import { helpers } from 'vuelidate/lib/validators'

const alpha = helpers.regex(/^[a-zA-Z]*$/)
```

## Custom error messages

While validators from the `@vuelidate/validators` package come with basic error messages, you may want to override them or define messages for your
own validators. The best way to do this is via the `withMessage` helper.

`withMessage` takes `message` as the first argument, and a validator as the second argument, returning a version of that validator with the customised
message.

```js
import { required, helpers, minLength } from '@vuelidate/validators'

const validations = {
  name: {
    required: helpers.withMessage('This field cannot be empty', required),
  }
};
```

`$message` can also take a function that is reactive to changes in the validator state and model. The `$messages` function receives an object with the
following properties:

| Property   |                            |
| ---------  | -------------------------- |
| `$invalid` | The valid state of the validator |
| `$model`   | The value being validated |
| `$params`  | Values of params in any validator created with the `withParams` helper |
| `$pending` | Whether an async validator has resolved yet  |

```js
import { required, helpers, minLength } from '@vuelidate/validators'

const validations = {
  name: {
    minLength: helpers.withMessage(
      ({
        $pending,
        $invalid,
        $params,
        $model
      }) => `This field has a value of '${$model}' but must have a min length of ${$params.min} so it is ${$invalid ? 'invalid' : 'valid'}`,
      minLength(4),
    ),
  }
};
```

## Async validators

Async validators that return a Promise, need to be wrapped in the `withAsync` helper. This will tell Vuelidate to treat the validator in a special
way, tracking pending status, storing response and more.

```js
import { helpers } from '@vuelidate/validators'

const { withAsync } = helpers
export default {
  data () {
    return { foo: '' }
  },
  validations: {
    foo: { asyncValidator: withAsync(asyncValidator) }
  }
}
```

### Async validators with extra reactive dependencies

When your async validator depends internally on other properties, you can pass those as a second parameter to the `withAsync` helper.

Such scenarios are common, when relying on some reactive data, different from the validated property.

```js
const foo = ref('')

function validator (value) {
  if (foo.value === 'foo') return false
  return value === 'bar'
}

const asyncValidator = withAsync(validator, foo) // here we pass in the `foo` ref as an extra watch target.

const validations = {
  someProperty: { asyncValidator }
}
```

### Watching multiple extra values

You can pass multiple extra dependencies to track, by passing an array of refs to `withAsync`.

```js
const foo = ref('')
const bar = reaf(false)
const validator = () => true

const asyncValidator = withAsync(validator, [foo, bar]) // here we pass in the `foo` and `bar` refs, as extra watch targets.
```

### Passing a reactive property

To pass a `reactive` property, when using the Options or Composition APis, you can just pass a function returning the correct value, or a computed
property, returning that value:

```js
const store = reactive({ foo: '' })

// when using Composition API
const asyncValidator = withAsync(validator, () => store.foo)

// or a computed property
const getter = computed(() => store.foo)
const asyncValidator = withAsync(validator, getter)

// when using Options API
export default {
  validatons () {
    return {
      foo: {
        validator: withAsync(asyncValidator, () => this.store.foo)
      }
    }
  }
}
```

## forEach helper

The `forEach` helper is added for cases where you might need a very simple collection validation, but don't want to go into defining new components.
Please read [Validating Collections](./advanced_usage.md#validating-collections) carefully, before using it.

```js
import { helpers } from '@vuelidate/validators'

const rules = {
  collection: {
    $each: helpers.forEach({
      name: {
        required
      }
    })
  }
}
```

## List of helpers

This table contains all helpers that can be used to help you with writing your own validators. You can import them from validators library

```js
import { helpers } from '@vuelidate/validators'
```

| Helper       | Description                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `withParams` | Allows adding `$params` metadata to your validation function.                                                                                 |
| `withMessage` | Allows adding custom error messages to built-in or custom validators                                                                         |
| `withAsync`  | Specifies that a validator returns a promise.                                                                         |
| `forEach`    | Helper to migrate from old `$each` helper more easily.                                                                         |
| `req`        | Minimal version of `required` validator. Use it to make your validator accept optional fields                                                 |
| `len`        | Get length of any kind value, whatever makes sense in the context. This can mean array length, string length, or number of keys on the object |
| `regex`      | Useful for quick creation of regex based validators.                                                                                          |
| `unwrap`     | Extract a value, from a ref, computed, or reactive property.                                                                                  |
