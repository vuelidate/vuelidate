# Validation Rules

Validations can be defined in a few ways, each has its PROs over others.

## Object with Options API

Vuelidate 0.x supported defining rules as an object, and we kept this functionality, though it is limited compared to the other methods below.

```vue

<script>
export default {
  data: () => ({
    name: ''
  }),
  validations: {
    name: { required }
  }
}
</script>
```

## Function with Options API

A more flexible way to create validation rules is to use a function for your rules. This allows you to access and pass the current component state as
params to other validators.

```vue

<script>
export default {
  data: () => ({
    password: '',
    confirmPassword: '',
  }),
  validations () {
    return {
      password: { required },
      confirmPassword: { sameAs: sameAs(this.password) }
    }
  }
}
</script>
```

## Object with Composition API

Rules can be defined as objects in Composition API. This works great for simpler forms and rules that are mostly static.

```js
const password = ref('');
const confirmPassword = ref('');
// inside setup
const rules = {
  password: { required },
  confirmPassword: { sameAs: sameAs(password) }
}
const v$ = useVuelidate(rules, { password, confirmPassword })
```

::: warning

If you are using a `reactive` state and need to pass state as props to validators, then use the method below, or you will lose reactivity
:::

### Computed function with Composition API

Using a computed function allows your validation rules to be reactive and update with the state inside. This means that props passed from reactive
states are kept reactive, rules can morph entirely.

```js
// inside setup
// state
const state = reactive({
  password: '',
  confirmPassword: ''
})
// rules
const rules = computed(() => {
  if (someBoolean.value) {
    // rules can change drastically
    return {
      password: { someValidator }
    }
  }
  return {
    password: { required },
    confirmPassword: { sameAs: sameAs(state.password) }
  }
})
const v$ = useVuelidate(rules, state)
```
