# Guide

## Basics
As we mentioned before, validation rules are set inside an object, that is returned by the `validations` method. We will refer to those as just _validations_.
You can access the component's instance and it's properties via `this` when writing more complicated validation rules.

**Note:** Pre Vuelidate 2 `validations` was allowed to be an object as well as a function. This is still available, for backwards compatibility reasons, but is discouraged. Please migrate to a method instead.

Each validation rule must have a corresponding property inside the `data` object.

```html
<script>
import { required } from '@vuelidate/validators'

export default {
  data() {
    return {
      name: ''
    }
  },
  validations() {
    return {
      name: { required }
    }
  }
}
</script>
```

Vuelidate comes with a set of validators, that live inside the `@vuelidate/validations` package, which you must install separately. For a full list of available validators, check the [Validators](./validators.md) page.

Validators can be as simple as functions returning a boolean, you are free to write your own or use third party validators. Read more about how to write your own validators on the [Custom Validators](./custom_validators.md) page.

### Checking for validation state

We have a our validation rules ready, now we need to check for errors.

Vuelidate builds a validation state, that can be accessed via the `v$` property. It is a nested object that roughly follows your `validations` structure, but with some extra validity related properties. It is reactive, meaning it changes as you type.

So for our form above, to check whether name is valid, we would do:

```html
<label>
  <input v-model="name">
  <div v-if="v$.name.$error">Name field has an error.</div>
</label>
```

The properties you will check against the most are:

```js
const v$ = {
    $errors: [],
    $error: false,
    $invalid: false,
    $dirty: false,
    $pending: false,
    // ... and others
    name: {
      $error: false,
      $invalid: false,
      $dirty: false,
      $pending: false,
      // ... and others
    }
}
```

The validation state has properties for each validator, that hold a set of helpful properties that we can use to show warnings, add classes and more.

This is just a subset of all the properties, but they are enough to get us started. To see all available properties, check the [Validation state API](./api.md#validation-state-values)

- explain collective properties

### The dirty state

- lazy by default
- auto dirty

### Displaying error messages

### Submitting forms

## Validating collections
