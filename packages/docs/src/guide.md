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

Vuelidate builds a validation state, that can be accessed via the `v$` property. It is a nested object that roughly follows your `validations` structure,
but with some extra validity related properties. It is reactive, meaning it changes as you type.

So for our form above, to check whether name is valid, we would can see if the `name.$error` property is `true` or not:

```html
<label>
  <input v-model="name">
  <div v-if="v$.name.$error">Name field has an error.</div>
</label>
```

It is as simple as that. Using this approach, you can apply error classes, show messages or add attributes.

The properties you will check against most often are:

```
  "$dirty": false,
  "$error": false,
  "$errors": [],
  "$invalid": false,
```

This is just a subset of all the properties, but they are enough to get us started. To see all available properties, check the [Validation state API](./api.md#validation-state-values)

### The dirty state

Vuelidate tracks the `dirty` state of each field, which means it can tell you when a field has beep changed. This can come in handy to determine when to show error messages, or compare data.

To change the `$dirty` state on a field, you can use the handy `$touch()` method, attached to an `input` event.

```html
<input v-model="name" @input="v$.name.$touch">
```

This will ensure that the field is "touched" every time you input something.

#### Using the $model property

If you want to make things a bit cleaner, you can use the `$model`, available for each field data property.
This is a special property that points to your validator's bound model data, and calls `touch` when you augment that field's data.

```html
<input v-model="v$.name.$model">
```

#### Setting dirty state with $autoDirty

It is quite common to forget to use `$model` or `$touch`. If you want to ensure dirty state is always tracked, you can use the `$autoDirty` settings property, when defining your validations:

```js
export default {
  validations() {
    return {
      name: { required, $autoDirty: true },
    }
  }
}
```

It will ensure the validator tracks it's bound data, and sets the dirty state accordingly.

You can then change your field's `v-model` to:

```html
<input v-model="name">
```

#### Lazy validations by default

Validation in Vuelidate 2 is by default lazy, meaning validators are only called, after a field is dirty, ie `touche()` is called.

#### Resetting dirty state

If you wish to reset a form's `$dirty` state, you can do so by using the appropriately named `$reset` method. For example when closing a modal, you dont want the validation to stay.

```html
<app-modal @closed="v$.$reset()">
  <!-- some inputs  -->
</app-modal>
```

### Collective properties

The validation state has entries for each validator, that hold a set of helpful properties that we can use to show warnings, add classes and more.

```json
{
  "$dirty": false,
  "$error": false,
  "$errors": [],
  "$invalid": false,
  // .. other properties
  "name": {
    "$dirty": false,
    "required": {
      "$message": "Value is required",
      "$params": {},
      "$pending": false,
      "$invalid": false
    },
    "$invalid": false,
    "$pending": false,
    "$error": false,
    "$errors": [],
    // .. other properties
  }
}
```

As you can see, the `name` field has it's own `$dirty`, `$error` among other attributes, as well as an object for the `required` validator.

The root properties like, `$dirty`, `$error` and `$invalid` are all collective computed properties, meaning their value changes depending on the nested children's state.

**Example:** If a form has 10 fields and one of them has it's `$error: true`, then the root `$error` will also be `true`, giving allot of flexibility when trying to display error state.

### Displaying error messages

### Submitting forms

## Validating collections
