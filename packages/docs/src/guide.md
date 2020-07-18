# Guide

## Basics
As we mentioned in the [getting started quick guide](/#getting-started-2), validation rules are defined inside the object returned by the `validations` method. We will refer to those as just _validations_ from now on.

You can access the component's instance and it's properties via `this` when writing more complicated validation rules.

::: warning
**Note:** Pre Vuelidate 2 `validations` was allowed to be an object as well as a function. This is still available, for backwards compatibility reasons, but is discouraged. Please migrate to a method instead.
:::

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

Validators are functions that return a boolean value after checking the validity of the state of a form.

Vuelidate also supports writing your own custom validators, you can learn more about how to write your own validators on the [Custom Validators](./custom_validators.md) page.

### Checking for validation state

Now that we have our validation rules set up, we can start checking for errors.

Vuelidate builds a validation state, that can be accessed via the `v$` property. It is a nested object that follows your `validations` structure,
but with some extra validity related properties.

`v$` is also reactive - meaning it changes as the user types.

Building up on our form example above, to check whether name is valid we can now check to see if the `name.$error` property is `true` or `false`, and display an error for our users.

```html
<label>
  <input v-model="name">
  <div v-if="v$.name.$error">Name field has an error.</div>
</label>
```

Using this approach, you can apply error classes, show messages or add attributes.

The properties you will check against most often are:

```
  "$dirty": false,
  "$error": false,
  "$errors": [],
  "$invalid": false,
```

This is just a subset of all the properties, but they are enough to get us started. To see all available properties, check the [Validation state API](./api.md#validation-state-values)

### The dirty state

Vuelidate tracks the `dirty` state of each field.

A field is considered `dirty` after it has received some sort of interaction from the user, which means all fields begin with a `dirty` state of `false`. Once the user types into, or modifies the `value` of the input's model, the field's `$dirty` state becomes `true`.

This can come in handy to determine when to show error messages, or compare data.

If you ever need to programmatically change the  `$dirty` state on a field to `true` - as if the user of your form had manipulated it, you can use the handy `$touch()` method, attached to an `input` event.

```html
<input v-model="name" @input="v$.name.$touch">
```

This will ensure that the field is "touched" every time you input something.

This same process can be achieved within your methods and watchers by directly calling the function in them.

```js
methods: {
  makeDirty() {
    this.$v.name.$touch()
  }
}
```

#### Using the $model property

A less verbose way to ensure that your validations are ran whenever your input's state changes is to directly bind your input's `v-model` declaration into the `$model` of that field's validation object.

This is a special property that points to your validator's bound model data, and calls `touch` when you update or modify that field's data.

```html
<template>
  <input v-model="v$.name.$model">
</template>

<script>
import { required } from '@vuelidate/validators'
export default {
  data() {
    return {
      name: ''
    }
  },
  validations: {
    name: { required }
  }
}
</script>
```

In the above example, we no longer need to call `$touch` manually every time the input is updated.

Additionally, Vuelidate will take of updating the state of the component for you.

In the above example, whenever the `input` element changes, `v$.name.$touch()` will be called, updating the state of the validation - and the `name` state will be updated.

This binding is accomplished internally through a getter/setter that reads and updates the original state. When the setter is called, it also triggers `$touch()` for that property.

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

The validation state holds data like the invalid state of each validator of a property, along with extra properties, like an error message or extra parameters.

The easiest way to display errors is to use the form's top level `$errors` property. It is an array of validation objects, that you can iterate over.

```vue
<p
  v-for="(error, index) of $v.$errors"
  :key="index"
>
  <strong>{{ error.$validator }}</strong>
  <small> on property</small>
  <strong>{{ error.$property }}</strong>
  <small> says:</small>
  <strong>{{ error.$message }}</strong>
</p>
```

You can also check for errors on each form property:

```vue
<p
  v-for="(error, index) of $v.name.$errors"
  :key="index"
>
  <!-- Same as above -->
</p>
```

### Validating forms before submitting

To submit a form, you often need to validate it first. In most cases, you can just check for the `$error` status of the form. It is a good practice to `$touch` the form first, so all validators initiate.

```js
export default {
  methods: {
    submitForm() {
      this.$v.$touch()
      if(this.$v.$error) return
      // do stuff
    }
  }
}
```

This is good for the general case, but what if you have async validators? You can use the `$validate` method, which returns a promise. That promise resolves with a boolean,
depending on what the validation status is.

```js
export default {
  methods: {
    async submitForm() {
      if(! await this.$v.$validate()) return
      // do stuff
    }
  }
}
```

## Validating collections
