# Validators

_vuelidate_ comes with a set of builtin validators that you can just require and use, but it doesn't end there. All of those are just simple predicates - functions of data into `boolean`, which denotes if data is valid. You can easily write your own or use any function in this shape from any library you already have, like `_.conformsTo` from lodash or higher order functions and chains like `R.cond` from _ramda_. Think of the possibilities.

This documentation presents every builtin validator with short description and presents an example custom validator implementation to help understanding them and writing your own as easy as possible.

## Builtin validators

### With а bundler

To use any of builtin validators, you have to import it from vuelidate library.

```js
import { required, maxLength } from 'vuelidate/lib/validators'
```

You can also import specific validators directly, to avoid loading unused ones in case your bundler doesn't support tree shaking. This is not required for Rollup or Webpack 2 among others.

```js
import required from 'vuelidate/lib/validators/required'
import maxLength from 'vuelidate/lib/validators/maxLength'
```

### In Browser

It is possible to use validators directly in browser by using a browser-ready bundle. Keep in mind this will always load all builtin validators at once.

```html
<script src="vuelidate/dist/validators.min.js"></script>
```

```js
var required = validators.required
var maxLength = validators.maxLength
```

Here is a full list of provided validators.
| Name             | Meta parameters        | Description                                                                                                                                                                                                                                                                   |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `required`       | **none**               | Requires non-empty data. Checks for empty arrays and strings containing only whitespaces.                                                                                                                                                                                     |
| `requiredIf`     | **locator\***          | Requires non-empty data only if provided property or predicate is true.                                                                                                                                                                                                       |
| `requiredUnless` | **locator\***          | Requires non-empty data only if provided property or predicate is false.                                                                                                                                                                                                      |
| `minLength`      | **min**                | Requires the input to have a minimum specified length, inclusive. Works with arrays.                                                                                                                                                                                          |
| `maxLength`      | **max**                | Requires the input to have a maximum specified length, inclusive. Works with arrays.                                                                                                                                                                                          |
| `minValue`       | **min**                | Requires entry to have a specified minimum numeric value or Date.                                                                                                                                                                                                             |
| `maxValue`       | **max**                | Requires entry to have a specified maximum numeric value or Date.                                                                                                                                                                                                             |
| `between`        | **min, max**           | Checks if a number or Date is in specified bounds. Min and max are both inclusive.                                                                                                                                                                                            |
| `alpha`          | **none**               | Accepts only alphabet characters.                                                                                                                                                                                                                                             |
| `alphaNum`       | **none**               | Accepts only alphanumerics.                                                                                                                                                                                                                                                   |
| `numeric`        | **none**               | Accepts only numerics.                                                                                                                                                                                                                                                        |
| `integer`        | **none**               | Accepts positive and negative integers.                                                                                                                                                                                                                                       |
| `decimal`        | **none**               | Accepts positive and negative decimal numbers.                                                                                                                                                                                                                                |
| `email`          | **none**               | Accepts valid email addresses. Keep in mind you still have to carefully verify it on your server, as it is impossible to tell if the address is real without sending verification email.                                                                                      |
| `ipAddress`      | **none**               | Accepts valid IPv4 addresses in dotted decimal notation like *127.0.0.1*.                                                                                                                                                                                                     |
| `macAddress`     | **separator=':'**      | Accepts valid MAC addresses like *00:ff:11:22:33:44:55*. Don't forget to call it `macAddress()`, as it has optional parameter. You can specify your own separator instead of `':'`. Provide empty separator `macAddress('')` to validate MAC addresses like *00ff1122334455*. |
| `sameAs`         | **locator\***          | Checks for equality with a given property.                                                                                                                                                                                                                                    |
| `url`            | **none**               | Accepts only URLs.                                                                                                                                                                                                                                                            |
| `or`             | **validators...**      | Passes when at least one of provided validators passes.                                                                                                                                                                                                                       |
| `and`            | **validators...**      | Passes when all of provided validators passes.                                                                                                                                                                                                                                |
| `not`            | **validator**          | Passes when provided validator would not pass, fails otherwise. Can be chained with other validators like `not(sameAs('field'))`.                                                                                                                                             |
| `withParams`     | **$params, validator** | Not really a validator, but a validator modifier. Adds a `$params` object to the provided validator. Can be used on validation functions or even entire nested field validation objects. Useful for creating your own custom validators.                                      |

\* Locator can be either a sibling property name or a function. When provided as a function, it receives the model under validation as argument and `this` is bound to the component instance so you can access all its properties and methods, even in the scope of a nested validation.

Example of conditional validations using a locator meta parameter:

```js
export default {
  ...,
  data() {
    return {
      field: "foo",
      nested: {
        field: "bar",
        someFlag: true
      }
    }
  },
  computed: {
    isOptional() {
      return true // some conditional logic here...
    }
  },
  validations: {
    field: {
      required: requiredUnless('isOptional')
    },
    nested: {
      required: requiredIf(function (nestedModel) {
        return !this.isOptional && nestedModel.someFlag
      })
    }
  }
}
```

## Validator parameters

Every validator can save parameters. Validators are responsible for saving their type and parameters, because they are simple functions, and we may want to inform the user about them.

Use `withParams` to apply parameters to a validator. Declared parameters bubble up by one level, so they are included in the `$params` of the parent validation object. Vuelidate is designed in a way that does not allow the validation result to directly include params.

You may call the `$flattenParams` method on a validation object to get an array of validator params for all validators that exist in that validation object. For example, let's say a validation object contains a between validator to check that a value is between **5** and **10**. Calling `$flattenParams` returns the following array.

```js
[
  {
    path: [],
    name: 'between',
    params: { type: 'between', min: 5, max: 10 }
  }
]
```
