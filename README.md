# vuelidate
[![codecov](https://codecov.io/gh/vuelidate/vuelidate/branch/master/graph/badge.svg)](https://codecov.io/gh/vuelidate/vuelidate)
![gzip size](http://img.badgesize.io/vuelidate/vuelidate/master/dist/vuelidate.min.js.svg?compression=gzip)

> Simple, lightweight model-based validation for Vue.js

## Sponsors

### Gold

<p align="center">
  <a href="https://us.vuejs.org/?utm_campaign=Vue.js%20News&utm_medium=email&utm_source=Revue%20newsletter" target="_blank">
    <img src="https://cdn.discordapp.com/attachments/560524372897562636/636900780481445888/ef278f141a55e3f44f50b8dbc1f9ca17.png" alt="VueConf.us" width="260px">
  </a>
</p>

### Silver

<p align="center">
  <a href="https://www.nativescript.org/vue?utm_source=vuejsnewsletter&utm_medium=email&utm_campaign=nativescript-awareness" target="_blank">
    <img src="https://cdn.discordapp.com/attachments/491313387129667594/602523039229542400/nativescript-logo.png" alt="NativeScript" width="170px">
  </a>
</p>

### Bronze

<p align="center">
  <a href="https://www.vuemastery.com/" target="_blank">
    <img src="https://cdn.discordapp.com/attachments/258614093362102272/557267759130607630/Vue-Mastery-Big.png" alt="Vue Mastery logo" width="180px">
  </a>
  <a href="https://vuejobs.com/" target="_blank">
    <img src="https://cdn.discordapp.com/attachments/560524372897562636/636900598700179456/vuejobs-logo.png" alt="Vue Mastery logo" width="140px">
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
npm install vuelidate --save
```

You can import the library and use as a Vue plugin to enable the functionality globally on all components containing validation configuration.

```javascript
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
```

Alternatively it is possible to import a mixin directly to components in which it will be used.

```javascript
import { validationMixin } from 'vuelidate'

var Component = Vue.extend({
  mixins: [validationMixin],
  validations: { ... }
})
```

The browser-ready bundle is also provided in the package.

```html
<script src="vuelidate/dist/vuelidate.min.js"></script>
<!-- The builtin validators is added by adding the following line. -->
<script src="vuelidate/dist/validators.min.js"></script>
```

```javascript
Vue.use(window.vuelidate.default)
```

## Basic usage

For each value you want to validate, you have to create a key inside validations options. You can specify when input becomes dirty by using appropriate event on your input box.

```javascript
import { required, minLength, between } from 'vuelidate/lib/validators'

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

```javascript
$v: {
  name: {
    "required": false,
    "minLength": false,
    "$invalid": true,
    "$dirty": false,
    "$error": false,
    "$pending": false
  },
  age: {
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
npm install

# serve with hot reload at localhost:8080
npm run dev

# create UMD bundle.
npm run build

# Create docs inside /gh-pages ready to be published
npm run docs

# run unit tests
npm run unit

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Contributors

### Current

- [Damian Dulisz](https://github.com/shentao)
- [Natalia Tepluhina](https://github.com/NataliaTepluhina)
- [Dobromir Hristov](https://github.com/dobromir-hristov)
- [Ben Hong](https://github.com/bencodezen)

### Emeriti

Here we honor past contributors who have been a major part on this project.

- [Monterail](https://github.com/monterail)
- [Paweł Grabarz](https://github.com/Frizi)

## License

[MIT](http://opensource.org/licenses/MIT)
