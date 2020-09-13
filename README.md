# vuelidate

> Simple, lightweight model-based validation for Vue.js 2.x & 3.0

Visit [Vuelidate Docs](https://vuelidate-next.netlify.org) for detailed instructions.

## Sponsors

### Silver

<p align="center">
  <a href="https://www.storyblok.com/developers?utm_source=newsletter&utm_medium=logo&utm_campaign=vuejs-newsletter" target="_blank">
    <img src="https://a.storyblok.com/f/51376/3856x824/fea44d52a9/colored-full.png" alt="Storyblok" width="240px">
  </a>
</p>

### Bronze

<p align="center">
  <a href="https://www.vuemastery.com/" target="_blank">
    <img src="https://cdn.discordapp.com/attachments/258614093362102272/557267759130607630/Vue-Mastery-Big.png" alt="Vue Mastery logo" width="180px">
  </a>
</p>

## Installation

You can use Vuelidate just by itself, but we suggest you use it along `@vuelidate/validators`, as it gives a nice collection of commonly used validators.

**Vuelidate supports both Vue 3.0 and Vue 2.x**

```bash
npm install @vuelidate/core @vuelidate/validators
# or
yarn add @vuelidate/core @vuelidate/validators
```

## Install via plugin in Vue 3.0

> This is only required if you want to use the `validations` option. `setup` usage documented later.

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { VuelidatePlugin } from '@vuelidate/core'

const app = createApp(App)
app.use(VuelidatePlugin)
app.mount('#app')
```

## Install via plugin in Vue 2.x

> This is only required if you want to use the `validations` option. `setup` usage documented later.

```js
// main.js

import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { VuelidatePlugin } from '@vuelidate/core'

Vue.use(VueCompositionApi)
Vue.use(VuelidatePlugin)

```

Then you can use it in all components with the Options API

```js
import { email, required } from '@vuelidate/validators'

export default {
  name: 'UsersPage',
  data: () => ({
    form: {
      name: '',
      email: ''
    }
  }),
  validations: {
    form: {
      name: { required },
      email: { required, email }
    }
  }
}
```

## Usage in `setup` function

```js
import { ref } from 'vue' // or '@vue/composition-api' in Vue 2.x
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

export default {
  setup () {
    const name = ref('')
    const emailAddress = ref('')
    const rules = {
      name: { required },
      emailAddress: { required, email }
    }

    const $v = useVuelidate(rules, { name, emailAddress })

    return { name, emailAddress, $v }
  }
}
```

## The `$v` object

```js
{
  $dirty: false, // validations will only run when $dirty is true
  $touch: <Function>, // call to turn the $dirty state to true
  $reset: <Function>, // call to turn the $dirty state to false
  $errors: [], // contains all the current errors { $message, $params, $pending, $invalid }
  $error: false, // true if validations have not passed
  $invalid: false, // as above for compatibility reasons
  // there are some other properties here, read the docs
}
```

## Lazy validations by default

Validation in Vuelidate 2 is by default `lazy`, meaning validators are only called, after a field is dirty, so after `$touch()` is called or by using `$model`.

This saves extra invocations for async validators as well as makes the initial validation setup a bit more performant.

### Resetting dirty state

If you wish to reset a form's `$dirty` state, you can do so by using the appropriately named `$reset` method. For example when closing a create/edit modal, you dont want the validation state to persist.

```vue
<app-modal @closed="$v.$reset()">
  <!-- some inputs  -->
</app-modal>
```

## Displaying error messages

The validation state holds useful data, like the invalid state of each property validator, along with extra properties, like an error message or extra parameters.

Error messages come out of the box with the bundled validators in `@vuelidate/validators` package. You can check how change those them over at the [Custom Validators page](./custom_validators.md)

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

For more info, visit the [Vuelidate Docs](https://vuelidate-next.netlify.org).

## Development
To test the package run

``` bash
# install dependencies
yarn install

# create bundles.
yarn build

# Create docs inside /docs package
yarn dev

# run unit tests for entire monorepo
yarn test:unit

# You can also run for same command per package
```

## Contributors

### Current

- [Damian Dulisz](https://github.com/shentao)
- [Natalia Tepluhina](https://github.com/NataliaTepluhina)
- [Dobromir Hristov](https://github.com/dobromir-hristov)

### Emeriti

Here we honor past contributors who have been a major part on this project.

- [Monterail](https://github.com/monterail)
- [Paweł Grabarz](https://github.com/Frizi)

## License

[MIT](http://opensource.org/licenses/MIT)
