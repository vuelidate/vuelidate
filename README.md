# vuelidate
[![codecov](https://codecov.io/gh/vuelidate/vuelidate/branch/master/graph/badge.svg)](https://codecov.io/gh/vuelidate/vuelidate)
![gzip size](http://img.badgesize.io/vuelidate/vuelidate/master/dist/vuelidate.min.js.svg?compression=gzip)

> Simple, lightweight model-based validation for Vue.js

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

### Features & characteristics:
* Model based
* Decoupled from templates
* Dependency free, minimalistic library
* Support for collection validations
* Support for nested models
* Contextified validators
* Easy to use with custom validators (e.g. Moment.js)
* Support for function composition
* Validates different data sources: Vuex getters, computed values, etc.

## Demo & docs

[https://vuelidate.netlify.com/](https://vuelidate.netlify.com/)

## Installation

```bash
npm install @vuelidate/core @vuelidate/validators @vue/composition-api --save
```
or
```bash
yarn add @vuelidate/core @vuelidate/validators @vue/composition-api
```

First you need to install `@vue/composition-api`, Vuelidate uses it extensively under the hood.

To enable the functionality globally on all components containing validation configuration, you can import the library and use as a Vue plugin.

```javascript
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { VuelidatePlugin } from '@vuelidate/core'

Vue.use(VueCompositionApi)
Vue.use(VuelidatePlugin)
```

Alternatively it is possible to import a mixin directly to components in which it will be used.

```html
<script>
import { VuelidateMixin } from '@vuelidate/core'

export default {
  mixins: [VuelidateMixin],
  validations: {...}
}
</script>
```

## Basic usage

For each value you want to validate, you have to create a key inside validations options. You can specify when input becomes dirty by using appropriate event on your input box.

```javascript
import { required, minLength, between } from '@vuelidate/validators'

export default {
  data () {
    return {
      name: '',
      age: 0
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    age: {
      between: between(20, 30)
    }
  }
}
```

This will result in a validation object:

```json
{
  "name": {
    "required": false,
    "minLength": false,
    "$invalid": true,
    "$dirty": false,
    "$error": false,
    "$pending": false
  },
  "age": {
    "between": false
    "$invalid": true,
    "$dirty": false,
    "$error": false,
    "$pending": false
  }
}
```

Checkout the docs for more examples: [https://vuelidate.netlify.com/](https://vuelidate.netlify.com/)

## Contributing

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
