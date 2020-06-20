# Getting started

**Vuelidate 2** is a simple, but powerful, lightweight model-based validation for Vue.js 3.

Vuelidate is considered _model-based_ because the validation rules are defined next to your data, and the validation tree structure matches the data model structure.

_If you are looking for Vuelidate that supports Vue 2, use [Vuelidate 1](https://github.com/vuelidate/vuelidate/tree/v1)._

## Installation

Installing Vuelidate is straightforward, and can be done with your package manager of choice.

```bash
npm install @vuelidate/core @vuelidate/validators --save

// OR

yarn add @vuelidate/core @vuelidate/validators
```

## Getting Started

You can then import Vuelidate and use it as a Vue plugin to enable the functionality globally on all components containing validation configuration.

```js
import Vue from 'vue'
import Vuelidate from '@vuelidate/core'

const app = Vue.createApp(App)
app.use(Vuelidate)
```

Now that Vuelidate is registered as a global plugin, create a `validations` method inside your component and define your validation rules.

First, import the validators that you want to use from `@vuelidate/validators`.

```js
import { required } from '@vuelidate/validators'
```

Next, add the `validations` method, it should return an object that matches the structure of your state. In this example, we have a field `name`, which is declared inside of the component's `data()`.

Notice that in the `validations` method we declare the same structure, and the `name` property specifies the validators that we want to apply to it - in this case, a `required` validation.

```js
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
```

Now that validations are set up, we can check inside our template for errors by looking at the `name` property inside of the `v$` Vuelidate object. It will hold all the information and state of our `name` state's validation.

If _any_ error is present, the `$error` property inside of `$v.name` will be true.

To check in more detail if the `required` property was the one that had the problem, and display an error for our user, we will check the `required` property inside of `v$.name`

```vue
<div :class="{ error: v$.name.$error }">
  <input v-model="name">
  <div v-if="v$.name.$error">
    <div v-if="v$.name.required">The Name field is required</div>
  </div>
</div>
```

That's it! Our validations are set and ready.

Head over to the [Guide](./guide.md) page now for a more detailed guide on how to use Vuelidate.
