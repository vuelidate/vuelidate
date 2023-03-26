# Validation State Values

There are two distinct structures present in _vuelidate_:

* `validations` component option - the definition of your validation
* `v$ structure` - an object in the Vue VM, that holds the validation state

The Validation state defines a set of properties which hold the output of user defined validation functions, following the provided `validations` property structure.
The presence of those special reserved keywords means that you cannot specify your own validators with that name.

## $invalid

* **Type:** `Boolean`
* **Details:**

  Indicates the state of validation for given model becomes `true` when any of its child validators specified in options returns a **falsy** value.

## $dirty

* **Type:** `Boolean`
* **Details:**

  A flag representing if the field under validation was touched by the user at least once. Usually it is used to decide if the message is supposed to be displayed to the end user. You can manage this flag manually by using **$touch** and `$reset` methods. It is set automatically when writing to `$model` value. The `$dirty` flag is considered true if given model was `$touched` or **all of its children** are `$dirty`.

## $anyDirty

* **Type:** `Boolean`
* **Details:**

  A flag very similar to `$dirty`, with one exception. The `$anyDirty` flag is considered `true` if given model was `$touched` or **any of its children** are `$anyDirty` which means at least one descendant is `$dirty`.

## $model

* **Type:** `any`
* **Details:**

  A reference to the original validated model. Reading this value will always give you exactly the same value as if you referenced the model directly. That means `this.v$.value.$model` is equivalent to `this.value` when read. Writing to that value will update the model and invoke `$touch` method automatically. This is very useful to use as `v-model` payload, providing a way of automatically marking given field as `$dirty` on first touch. Pairs well with `.lazy` modifier.

## $error

* **Type:** `Boolean`
* **Details:**

  Convenience flag to easily decide if a message should be displayed. Equivalent to `this.$dirty && !this.$pending && this.$invalid`.

## $errors

* **Type:** `Array`
* **Details:**

  Collection of all the error messages, collected for all child properties and nested forms (Vue components). Only contains errors from properties where `$dirty` equals `true`.

## $silentErrors

* **Type:** `Array`
* **Details:**

  Collection of all the error messages, collected for all child properties and nested forms (Vue components).

## $pending

* **Type:** `Boolean`
* **Details:**

  Indicates if any child async validator is currently pending. Always `false` if all validators are synchronous.

## $params

* **Type:** `Object`
* **Details:**

  Contains types and parameters of all provided validators at the current level, as well as types and parameters of child validation groups, which may be declared using `withParams`. Useful as an input to your error rendering system. Safe to use in translated text.

## $response

* **Type:** `Boolean | Object | Null`
* **Default:** `null`
* **Details:**

  Contains the response and rejections of a validator.

## $path

* **Type:** `String`
* **Details:**

  A dot notation nested path, of the current form leaf.
