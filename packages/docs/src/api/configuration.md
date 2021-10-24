# Validation Configuration

## $scope

* **Type:** `{String | Boolean | Symbol | Number}`

* **Default:** `true`

* **Usage:**

  Defines a scope, which the component will use to collect validation results from child components and push them up to its parent, with the same
  scope. `true` means it collects all, `false` means it collects none.

## $stopPropagation

* **Type:** `{Boolean}`

* **Default:** `false`

* **Usage:**

  Should the component stop emitting its results up, no matter the scope. This is useful for complex forms, which should child validations, but not
  emit those validations with any parent forms.

## $autoDirty

* **Type:** `{Boolean}`

* **Default:** `false`

* **Usage:**

  Tells Vuelidate to track changes on the state automatically. No need to use `$model` or `$touch`.

## $lazy

* **Type:** `{Boolean}`

* **Default:** `false`

* **Usage:**

  When set to `false`, tells the validation rules to be called on init, otherwise they are lazy and only called when the field is dirty.

## $registerAs

* **Type:** `{String}`

* **Usage:**

  Allow assigning a custom component registration name to a Vuelidate instance. This is used when a validation is registered in a parent validation
  form.

## $externalResults

* **Type:** `ServerErrors | Ref<ServerErrors> | UnwrapRef<ServerErrors>`

* **Usage:**

  Pass an object, matching your state, that holds external validation errors. These can be from a backend validations or something else.

* **Example:**

```js
const $externalResults = reactive({})
const state = { number: 0 }
const validations = { number: { required } }
const v$ = useVuelidate(validations, state, { $externalResults })
// some other logic
$externalResults.number = ['One error', 'Two Errors']
// setting a value in `$externalResults` for the `number` property would cause that property to become invalid.
expect(v$.value.number.$invalid).toBe(true)
```

## $rewardEarly

* **Type:** `Boolean`

* **Usage:**

  Turn on the `reward-early-punish-late` mode of Vuelidate. This mode will not set fields as `invalid` once they are `valid`, unless manually
  triggered, by `$commit` or `$validate` methods. See https://github.com/vuelidate/vuelidate/issues/897
