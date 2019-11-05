# vuelidate
[![codecov](https://codecov.io/gh/vuelidate/vuelidate/branch/master/graph/badge.svg)](https://codecov.io/gh/vuelidate/vuelidate)
![gzip size](http://img.badgesize.io/vuelidate/vuelidate/master/dist/vuelidate.min.js.svg?compression=gzip)

> Simple, lightweight model-based validation for Vue.js

Visit [Vuelidate Docs](https://vuelidate-next.netlify.org) for detailed instructions.

## Installation

You can use Vuelidate just by itself, but we suggest you use it along `@vuelidate/validators`, as it gives a nice collection of commonly used validators.

```bash
npm install @vuelidate/core @vuelidate/validators
# or
yarn add @vuelidate/core @vuelidate/validators
```

## Usage

```js
// main.js

import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { VuelidatePlugin } from '@vuelidate/core'

Vue.use(VueCompositionApi)
Vue.use(VuelidatePlugin)

```

Then you can use it in all components

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

You can now access `$v.form` to see all the validation statuses of each validator.

For more info, visit the [Vuelidate Docs](https://vuelidate-next.netlify.org).

## Development
To test the package run

```bash
yarn test:unit
```

To link the package run

```bash
yarn link
```

To build run the package, run: 

```bash
npm run build
```
