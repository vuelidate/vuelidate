# Migration Guide from v0.x

::: danger BREAKING CHANGES
Vuelidate v2.0 is still in early alpha/beta stage. This means the changes listed below might not be final.
:::

## Package name and imports

The core library and validators have been split into separate packages: `@vuelidate/core` and `@vuelidate/validators` for easier maintenance and separate release cycles.

#### Migration Strategy

1. Replace the below
```js
import Vuelidate from 'vuelidate'
```
with
```js
import useVuelidate from '@vuelidate/core'
```

2. Change import location for validators
```js
import { required, minLength } from 'vuelidate/lib/validators'
```
with
```js
import { required, minLength } from '@vuelidate/validators'
```

## Removal of Vuelidate (plugin)

In Vuelidate 0.x you were able to install Vuelidate globally. This is no longer possible due to the removal of the Vuelidate mixin mentioned below.

#### Migration Strategy

1. Remove `Vue.use(Vuelidate)`.
2. Use `useVuelidate()` inside `setup` where needed.

## Removal of `validationMixin`

The `validationMixin` has been removed.

#### Migration Strategy

1. Remove `mixins: [ validationMixin ]` from component definitions.
2. Use `useVuelidate()` inside `setup` where needed.

## Removal of `$each` param

The `$each` helper was used to handle validation of collections. Although useful, it was pretty hard to optimize and not as flexible as we would like.
This has been removed.

```js{11-16}
export default {
  data() {
    return {
      people: [ { name: 'John' }, { name: '' } ]
    }
  },
  validations: {
    people: {
      required,
      minLength: minLength(3),
      $each: {
        name: {
          required,
          minLength: minLength(2)
        }
      }
    }
  }
}
```

#### Migration Strategy

There is no direct migration path here. However, most problems that required the use of `$each` can now be solved with the new support for [nested validations](advanced_usage.md#nested-validations).
The above example could be replaced with the following, given we create a separate component to handle each element of the `people` collection.

Here’s the wrapper component.

```vue
<!-- PeopleList.vue -->
<template>
  <div>
    <PersonInput
      v-for="(person, index) of people"
      :person="person"
      :key="index"
      @updatePerson="person = $event"
    />
    <!-- This list will include all errors,
         both from this component and errors from every <PersonInput> -->
    <div v-for="error of v$.$errors" :key="error.$uid">
      {{ error.$message }}
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import PersonInput from '@/components/PersonInput'

export default {
  components: { PersonInput },
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      people: [ { name: 'John' }, { name: '' } ]
    }
  },
  validations: {
    people: {
      required,
      minLength: minLength(3),
    }
  }
}
</script>
```

And here we have the single person component that has its own validation rules.

```vue
<!-- PersonInput.vue -->
<template>
  <div>
    <input type="text" :value="person.name" @input="$emit('updatePerson', { name: $event })" />
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'

export default {
  props: {
    person: { type: Object, required: true },
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations: {
    person: {
      required,
      minLength: minLength(2),
    }
  }
}
</script>
```

This might seem like a lot of overhead, but aside from simple examples like the above, is generally much more powerful. Here’s a list of reasons:
1. It is not limited to only parent-child component relations, as the parent will collect all validation results from any descendant component.
2. Each of those child components can control how their validation rules should look like.
3. The parent component doesn't need to know the object structure of the elements in the collection.

## Async validators need to be wrapped in withAsync

All validators are expected to be synchronous. They are most common, and we use `computed` under the hood to track all possible reactive deps.

### Migration strategy

If a validators needs to be async, just use the `withAsync` helper to wrap your validators, that return a Promise. This is necessary in order to tell
Vuelidate to await this validator to resolve.

```js
import { helpers } from '@vuelidate/validators'

const { withAsync } = helpers
export default {
  validations: {
    foo: { asyncValidator: withAsync(asyncValidator) }
  }
}
```
