# Getting started

**Vuelidate 2** is a simple, but powerful, lightweight model-based validation for Vue.js 3.

Vuelidate is considered _model-based_ because the validation rules are defined next to your data, and the validation tree structure matches the data model structure.

_If you are looking for Vuelidate that supports Vue 2, use [Vuelidate 1](https://github.com/vuelidate/vuelidate/tree/v1)._

## Installation

You can install via npm

```bash
npm install @vuelidate/core @vuelidate/validators --save
```

## Getting Started

You can import the library and use it as a Vue plugin to enable the functionality globally on all components containing validation configuration.

```js
import Vue from 'vue'
import Vuelidate from '@vuelidate/core'

const app = Vue.createApp(App)
app.use(Vuelidate)
```

Then in your component you can create a `validations` method and define your validation rules.

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

Now in your templates you can check for errors like this:

```vue
<div :class="{ error: v$.name.$error }">
  <input v-model="name">
  <div v-if="v$.name.$error">
    <div v-if="v$.name.required">The Name field is required</div>
  </div>
</div>
```

There, you are all set. Head over to the [Guide](./guide.md) page, to for a more detailed guide on how to use Vuelidate.
