# Getting started

## Package content

Simple, lightweight model-based validation for Vue.js

You can read the [introduction post](https://www.monterail.com/blog/vuelidate-vuejs) for more insight on how this solution differs from other validation libraries.

## Installation

Package is installable via npm

```bash
npm install vuelidate --save
```

## Basic usage

You can import the library and `use` as a Vue plugin to enable the functionality globally on all components containing validation configuration.

```js
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
```

Alternatively it is possible to import a mixin directly to components in which it will be used.

```vue
<script>
import { validationMixin } from 'vuelidate'

export default {
  mixins: [validationMixin],
  validations: { ... }
}
</script>
```

If you prefer using `require`, it can be used instead of `import` statements. This works especially great with destructuring syntax.

```js
const { validationMixin, default: Vuelidate } = require('vuelidate')
const { required, minLength } = require('vuelidate/lib/validators')
```

The browser-ready bundle is also provided in the package.

```html
<script src="vuelidate/dist/vuelidate.min.js"></script>
```
```js
// global
Vue.use(window.vuelidate.default)

// local mixin
var validationMixin = window.vuelidate.validationMixin
```
Check out the [JSFiddle example](https://jsfiddle.net/Frizi/b5v4faqf/) which uses this setup.
