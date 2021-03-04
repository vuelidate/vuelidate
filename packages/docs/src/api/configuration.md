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
