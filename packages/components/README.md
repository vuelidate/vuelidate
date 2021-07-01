# Vuelidate Components

Visit [Vuelidate Docs](https://vuelidate-next.netlify.app) for detailed instructions.

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

Vuelidate Components are meant to be used alongside `@vuelidate/core` and `@vuelidate/validators`.

```bash
npm install @vuelidate/core @vuelidate/validators @vuelidate/components
# or
yarn add @vuelidate/core @vuelidate/validators @vuelidate/components
```

## Usage

Import the component you need and use it in your forms.

```js
import { ValidateEach } from '@vuelidate/components'

export default {
  components: { ValidateEach },
  // ... rest of your component setup
}
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
