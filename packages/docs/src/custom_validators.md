# Custom Validators

You can easily write custom validators and combine them with builtin ones, as those are just a simple predicate functions.

## Simplest example

Suppose you want a validator that checks if a string contains the word `cool` in it. You can write a plain JavaScript function to check that:

```js
const mustBeCool = (value) => value.includes('cool')
```

The second part is actually applying your validator. You can do it exactly the same way as with builtin ones.

```js
validations() {
  return {
    myField: {
      required, mustBeCool
    }
  }
}
```

## Optional validator

The pattern presented above is often good enough, but this validator will always return `false` for empty inputs.
This is not correct when your input is considered optional. For this reason, there exist a `req` helper, which is kinda stripped-down version of `required` validator.
You can use it to make your validator behave well in presence of optional fields.

```js
import { helpers } from '@vuelidate/validators'
const mustBeCool = (value) => !helpers.req(value) || value.includes('cool')

// ...
validations() {
  return {
    myField: {
      mustBeCool
    }
  }
}
```

## Extra parameters

If your validator needs to provide parameters, you can simply create a higher order function that returns the actual validator, like in `between` builtin validator.

```js
import { helpers } from '@vuelidate/validators'
const contains = (param) => (value) =>
  !helpers.req(value) || value.includes(param)

// ...

validations() {
  return {
    myField: {
      mustBeCool: contains('cool')
    }
  }
}
```

## Passing extra properties to validators

If you need to attach extra properties to your validation result, to display in error messages for example, you can use the `withParams` helper and look into the `$props` attribute on your validation result.
Lets attach a `type` property, so that we can later retrieve it.

**Note:** `$props` is reactive, which means you could add `computed` properties, `ref` or other, and they will update accordingly.

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

The same behaviour extends to higher order validators, ones with extra parameters. You just must be careful to wrap the **inner** function with `withParams` call, as follows.

```js
import { helpers } from '@vuelidate/validators'
const contains = (param) =>
  helpers.withParams(
    { type: 'contains', value: param },
    (value) => !helpers.req(value) || value.includes('cool')
  )

// ...
validations() {
  return {
    myField: {
      mustBeCool: contains('cool')
    }
  }
}

// ...
console.log(this.$v.myField.mustBeCool.$params)
// -> { type: 'contains', value: 'cool' }
```

## Accessing component

In more complex cases when access to the whole model is necessary, like `sameAs`, make use of the function context (`this`) to access any value on your component or use provided `parentVm` to access sibling properties.

```js
// both equivalent
const otherFieldContainsMe = (value, vm) =>
  vm.other.nested.field.contains(value)

function otherFieldContainsMe(value) {
  return this.other.nested.field.contains(value)
}
```

## regex based validator

Some validators can be easily expressed as `regex`. You can use a regex helper to quickly define full-fledged validator of this kind. This already includes handling optional fields and `$params`.

```js
import { helpers } from 'vuelidate/lib/validators'
const alpha = helpers.regex('alpha', /^[a-zA-Z]*$/)
```

## locator based validator

If you want to use locator strategy, exactly the same one as in `sameAs` or `requiredIf` builtin validators, you can use `ref` helper to accomplish that, in exactly the same way how it is used inside those two validators.

```js
import { ref, withParams } from './common'
export default (equalTo) =>
  withParams({ type: 'sameAs', eq: equalTo }, function(value, parentVm) {
    return value === ref(equalTo, this, parentVm)
  })
```

```js
import { req, ref, withParams } from './common'

export default (prop) =>
  withParams({ type: 'requiredIf', prop }, function(value, parentVm) {
    return ref(prop, this, parentVm) ? req(value) : true
  })
```

Note that imports are slightly different, as this is how the code looks like from library source point of view. This style is the correct one if you are willing to contribute your own validators to vuelidate. You should still use helpers export inside your own code (as presented in previous examples).

## List of helpers

This table contains all helpers that can be used to help you with writing your own validators. You can import them from validators library

```js
import { helpers } from 'vuelidate/lib/validators'
```

| Helper       | Description                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `withParams` | Allows adding `$params` metadata to your validation function.                                                                                 |
| `req`        | Minimal version of `required` validator. Use it to make your validator accept optional fields                                                 |
| `ref`        | A locator helper. This allows for convinient referencing of other fields in the model.                                                        |
| `len`        | Get length of any kind value, whatever makes sense in the context. This can mean array length, string length, or number of keys on the object |
| `regex`      | Useful for quick creation of regex based validators.                                                                                          |
