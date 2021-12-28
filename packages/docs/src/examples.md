# Examples

## Without v-model

In case you don't want to modify your model directly, you can still use separate `:input` and `@event` bindings. This is especially useful if you are
using data from external source, like Vuex, or transforming the data on each keystroke. In that case you have to manually take care of setting
the `$dirty` by calling `$touch()`
method.

```vue

<template>
  <input type="text" :value="name" @input="setName">
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({ name: '' }),
  validations () {
    return {
      name: { required }
    }
  },
  methods: {
    setName ($event) {
      // do some silly transformation
      this.name = $event.target.value.toUpperCase()
      this.v$.name.$touch()
    }
  }
}
</script>
```

## Form submission

A common thing to do with forms, is to check their validity before submission. You can do this by calling the `$validate` method and check it's
output.

```vue

<script>
export default {
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({ name: '' }),
  validations () {
    return {
      name: { required }
    }
  },
  methods: {
    async submit () {
      const result = await this.v$.$validate()
      if (!result) {
        // notify user form is invalid
        return
      }
      // perform async actions
    }
  }
}
</script>
```

## Contextified validators

You can link fields together, by passing a field's value to another field's validator. An example of this being `sameAs` builtin validator.

```vue

<script>
import useVuelidate from '@vuelidate/core'
import { sameAs } from '@vuelidate/validators'

export default {
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({ password: '', confirmPassword: '' }),
  validations () {
    return {
      password: { required },
      confirmPassword: sameAs(this.password)
    }
  },
}
</script>
```

## Data nesting

You can nest validators to match your data as deep as you want. Parent validator is `$invalid` when any of its children validators reports
an `$invalid`
state. This might be very useful for overall form validation.

```vue

<script>
import useVuelidate from '@vuelidate/core'
import { sameAs } from '@vuelidate/validators'

export default {
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    form: {
      address: {
        primary: ''
      }
    }
  }),
  validations () {
    return {
      form: {
        address: {
          primary: { required }
        }
      }
    }
  },
}
</script>
```

## Collections validation

A parent element will collect all of its child component validations. This allows for easy validation of collections.

```vue

<template>
  <div>
    <input type="text" v-model="householdName">
    <PersonForm v-for="person in people" v-model="person" />
    <button @click.prevent="addPerson">Add person</button>
    <!-- this will contain all $errors from every <PersonForm/> component -->
    <p v-for="error of v.$errors" :key="error.$uid">
      {{ error.$message }}
    </p>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import PersonForm from '@/components/PersonForm'

export default {
  components: { PersonForm },
  data () {
    return {
      householdName: '',
      people: []
    }
  },
  validations () {
    return { householdName: { required } }
  },
  setup: () => ({ v: useVuelidate() }),
  methods: {
    addPerson () {
      this.people.push({
        name: '',
        email: '',
        address: ''
      })
    }
  }
}
</script>
```

## Asynchronous validation

Async validators are just validators that return a Promise and are wrapped in the `withAsync` helper. Read more about it
in [Async Validators](./custom_validators#async-validators)

```js
import { helpers } from '@vuelidate/validators'

const isEmailTaken = (value) => fetch(`/api/unique/${value}`).then(r => r.json()) // check the email in the server

export default {
  validations () {
    return {
      email: {
        isUnique: helpers.withAsync(isEmailTaken)
      }
    }
  }
}
```

The `async/await` syntax is fully supported. It works especially great in combination with Fetch API.

```js
export default {
  validations () {
    return {
      email: {
        async isUnique (value) {
          if (value === '') return true
          const response = await fetch(`/api/unique/${value}`)
          return (await response.json()).valid
        }
      }
    }
  }
}
```

## Accessing validator parameters

You can access information about your validations through `$params`.

```vue

<template>
  <input type="text" v-model="name">
  <div>Note: Name must be at least {{ v$.name.$params.min }}</div>
</template>
<script>
import { minLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

export default {
  data: () => ({ name: '' }),
  validations () {
    return {
      name: {
        minLength: minLength(10)
      }
    }
  },
  setup: () => ({ v$: useVuelidate() })
}
</script>
```

## Dynamic validation schema

Validations being a function or computed property, allow for a dynamic and changing schema, based on your model's data. Re-computation will happen
automatically. Validation's `$dirty` state is preserved even if the property tree gets temporarily removed.

### Options API

```vue

<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  data: () => ({
    shippingAddress: '',
    billingSameAsShipping: false,
    billingAddress: ''
  }),
  validations () {
    const localRules = {
      shippingAddress: { required }
    }
    if (!this.billingSameAsShipping) {
      // if billing is not the same as shipping, require it
      localRules.billingAddress = {
        required
      }
    }
    return localRules
  },
  setup: () => ({ v$: useVuelidate() })
}
</script>
```

### Composition API

```vue

<script>
import { reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  setup () {
    const state = reactive({
      shippingAddress: '',
      billingSameAsShipping: false,
      billingAddress: ''
    })
    const rules = computed(() => {
      const localRules = {
        shippingAddress: { required }
      }
      if (!state.billingSameAsShipping) {
        // if billing is not the same as shipping, require it
        localRules.billingAddress = {
          required
        }
      }
      return localRules
    })
    const v$ = useVuelidate(rules, state)
    return {
      v$
    }
  }
}
</script>
```

## Dynamic parameters

Parameters passed to validators can be reactive, and be accessed from `$params` property.

```js
const name = ref('')
const fieldLength = ref(5)

const rules = {
  name: { minLength: minLength(fieldLength) }
}

return {
  v$: useVuelidate(rules, { name }),
  fieldLength
}
```

Now everytime the `fieldLength` changes, the `minLength` validator will use the new value.

```vue

<template>
  <label>Name Length: <input type="text" v-model="fieldLength"></label>
  <label>Name: <input type="text" v-model="v$.name.$model"></label>
</template>
```

## Returning metadata from validators

In cases where a validator can return more than just a boolean, we can return an object with a `$valid` boolean. All the extra data from what we
return can be read through the `$response` property.

Let's implement a `$warn` concept, where a validator returns a warning, if the data is valid, but not ideal.

```vue

<template>
  <div>
    <DragAndDropArea v-model="v$.avatar.$model" />
    <div v-if="v$.name.imageSize.$response?.$warn" class="alert--warning">
      We recommend uploading an image at least {{ v$.name.imageSize.$response.recommendedSize }}kb,
      yours is {{ v$.name.imageSize.$response.currentSize }}kb.
    </div>
  </div>
</template>
<script>
import useVuelidate from '@vuelidate/core'

export default {
  setup () {
    const validateImage = (file) => {
      // perform some fancy FileReader logic, and return results
      return {
        $valid: isValid,
        $warn: isImageBigEnough,
        recommendedSize,
        currentSize
      }
    }
    const rules = {
      avatar: {
        imageSize: validateImage
      }
    }
    const avatar = ref(null)
    return {
      v$: useVuelidate(rules, { avatar }),
    }
  }
}
</script>
```

## `Reward early, punish late` mode

The `$rewardEarly` mode of Vuelidate stops validators from running once a field becomes valid. You can re-run them using either `$validate`
or `$commit`. This is often done on `blur` of the field.

```vue

<template>
  <div>
    <input v-model="v$.name.$model" @blur="v$.name.$commit" />
    <p v-for="error of v.$errors" :key="error.$uid">
      {{ error.$message }}
    </p>
  </div>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  setup () {
    const rules = {
      name: { required }
    }
    const name = ref(null)
    return {
      v$: useVuelidate(rules, { name }, { $rewardEarly: true }),
    }
  }
}
</script>
```
