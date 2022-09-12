# Getting started

![Vuelidate Logotype](/logotype.png)

**Vuelidate 2** is a simple, but powerful, lightweight model-based validation for Vue.js 3 and 2.

Vuelidate is considered _model-based_ because the validation rules are defined next to your data, and the validation tree structure matches the data model structure.

::: tip
Vuelidate v2.0 supports both Vue 3.0 and Vue 2.x**
:::

## Installation

Installing Vuelidate is straightforward, and can be done with your package manager of choice.

```bash
npm install @vuelidate/core @vuelidate/validators

// OR

yarn add @vuelidate/core @vuelidate/validators
```

## Using CDN

Vuelidate also exposes a browser ready version, that you can use directly without a bundler.
Add these imports to your browser:

```html
<!-- Vue-->
<!--  For Vue 2 -->
<!--  <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>-->
<!--  <script src="https://cdn.jsdelivr.net/npm/@vue/composition-api"></script>-->
<!--  For Vue 3 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
<!--  Vuelidate -->
<script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
<script src="https://cdn.jsdelivr.net/npm/@vuelidate/core"></script>
<script src="https://cdn.jsdelivr.net/npm/@vuelidate/validators"></script>
```

Now you can access use `VueDemi`, `Vuelidate` and `VuelidateValidators` to build validations.

## Getting Started

::: tip
When used with Vue 2.x, you need to install the `@vue/composition-api` plugin. You can learn how to do that [here](https://github.com/vuejs/composition-api).
Once this is done, you can proceed with the below.
:::


```js
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      contact: {
        email: ''
      }
    }
  },
  validations () {
    return {
      firstName: { required }, // Matches this.firstName
      lastName: { required }, // Matches this.lastName
      contact: {
        email: { required, email } // Matches this.contact.email
      }
    }
  }
}
```

Lets explain what happens here. We declare our local state with `data`, then we declare our validation rules with `validations`. Lastly, we activate Vuelidate inside `setup` by calling `useVuelidate`. Internally it will take the `validations` returned object and treat it as the validation rules. It will also take the whole component instance local state (including `data`, but also `computed`).

Notice how the the objects returned from `data` and `validations` have a matching structure.

```js{9-15,18-24}
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      contact: {
        email: ''
      }
    }
  },
  validations () {
    return {
      firstName: { required }, // Matches this.firstName
      lastName: { required }, // Matches this.lastName
      contact: {
        email: { required, email } // Matches this.contact.email
      }
    }
  }
}
```

### Alternative syntax (Composition API)

Vuelidate v2.x also comes with support for Composition API. The above example can be translated into the composition API syntax.

```js
import { reactive } from 'vue' // "from '@vue/composition-api'" if you are using Vue 2.x
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  setup () {
    const state = reactive({
      firstName: '',
      lastName: '',
      contact: {
        email: ''
      }
    })
    const rules = {
      firstName: { required }, // Matches state.firstName
      lastName: { required }, // Matches state.lastName
      contact: {
        email: { required, email } // Matches state.contact.email
      }
    }

    const v$ = useVuelidate(rules, state)

    return { state, v$ }
  }
}
```

Now that validations are set up, we can check inside our template for errors by looking for example at the `firstName` property inside of the `v$` Vuelidate object. It will hold all the information and state of our `firstName` state's validation.

If _any_ error is present, the `$errors` array property inside of `$v.firstName` will contain an object that describes each error for us to loop through.

Each object inside the `$errors` array will contain a few properties that allows us to dynamically build our error message.

An example of our `firstName` property being in an error state due to it being `required` would be:

```js
{
  "$property": "firstName",
  "$validator": "required",
  "$message": "Value is required",
  [...]
}
```

Now that we understand the basic content of the error objects, we can build our error messages in the template. This approach will dynamically cover any number of validators that were applied to our input.

```html
<div :class="{ error: v$.firstName.$errors.length }">
  <input v-model="state.firstName">
  <div class="input-errors" v-for="error of v$.firstName.$errors" :key="error.$uid">
    <div class="error-msg">{{ error.$message }}</div>
  </div>
</div>
```

That's it! Our validations are set and ready.

Head over to the [Guide](./guide.md) page now for a more detailed guide on how to use Vuelidate.

## Sponsors

### Gold

<p align="center">
  <a href="https://vuejs.amsterdam/?utm_source=newsletter&utm_medium=logo&utm_campaign=vuejs-newsletter" target="_blank">
    <img src="https://camo.githubusercontent.com/d70ce43e50f085dcaaba44706e75107b0f86ad6ab45d7cd75ec2d877db543d86/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f6174746163686d656e74732f3739333538333739373435343530333937362f3739333538333833313336393634363132302f7675656a73616d7374657264616d2e706e67" alt="Vue.js Amsterdam" width="360px">
  </a>
</p>

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
