# Validators

_Vuelidate 2_ does not bundle any validators, however it exposes them via a secondary package `@vuelidate/validators`. It consists of a set of
validators and helpers, that you can just require and use, but it doesn't end there. All of those are just simple predicates - functions of data
into `boolean`, which denotes if data is valid. You can easily write your own or use any function in this shape from any library you already have.

This documentation presents every builtin validator with short description and presents an example custom validator implementation to help understand
them and writing your own as easy as possible.

## Using Builtin validators

To use any of builtin validators, you have to import it from the validators package.

```js
import { required, maxLength } from '@vuelidate/validators'
```

These validators come with default error messages baked in. If you do not want that, and wish to define your own, import the raw validators instead.

```js
import { required, maxLength } from '@vuelidate/validators/dist/raw.esm'
```

## required

* **Usage:**

  Requires non-empty data. Checks for empty arrays and strings containing only whitespaces.

## requiredIf

* **Arguments:**
  * `{Ref<Any> | Any} prop` - the property to base the required on.

* **Usage:**

  Requires non-empty data only if provided property or predicate is true.

## requiredUnless

* **Arguments:**
  * `{Ref<Any> | Any} prop` - the property to base the required on.

* **Usage:**

  Requires non-empty data only if provided property or predicate is false.

## minLength

* **Arguments:**
  * `{Ref<Number> | Number} min`

* **Usage:**

  Requires the input value to have a minimum specified length, inclusive. Works with arrays.

## maxLength

* **Arguments:**
  * `{Ref<Number> | Number} max`

* **Usage:**

  Requires the input to have a maximum specified length, inclusive. Works with arrays.

## minValue

* **Arguments:**
  * `{Ref<Number> | Number} min`

* **Usage:**

  Requires entry to have a specified minimum numeric value or Date.

## maxValue

* **Arguments:**
  * `{Ref<Number> | Number} max`

* **Usage:**

  Requires entry to have a specified maximum numeric value or Date.

## between

* **Arguments:**
  * `{Ref<Number> | Number} min`
  * `{Ref<Number> | Number} max`

* **Usage:**

  Checks if a number or Date is in specified bounds. Min and max are both inclusive

## alpha

* **Usage:**

  Accepts only alphabet characters.

## alphaNum

* **Usage:**

  Accepts only alphanumerics.

## numeric

* **Usage:**

  Accepts only numerics.

## integer

* **Usage:**

  Accepts positive and negative integers.

## decimal

* **Usage:**

  Accepts positive and negative decimal numbers.

## email

* **Usage:**

  Accepts valid email addresses. Keep in mind you still have to carefully verify it on your server, as it is impossible to tell if the address is real
  without sending verification email.

## ipAddress

* **Usage:**

  Accepts valid IPv4 addresses in dotted decimal notation like *127.0.0.1*.

## macAddress

* **Arguments:**
  * `{String | Ref<String>} separator`

* **Usage:**

  Accepts valid MAC addresses like *00:ff:
  11:22:33:44:55*. Don't forget to call it `macAddress()`, as it has optional parameter. You can specify your own separator instead of `':'`. Provide
  empty separator `macAddress('')` to validate MAC addresses like 00ff1122334455*.

## sameAs

* **Arguments:**
  * `{Any} equalTo`

* **Usage:**

  Checks for equality with a given property.

## url

* **Arguments:**
  * `{Any} equalTo`

* **Usage:**

  Accepts only URLs.

## or

* **Arguments:**
  * `{...(NormalizedValidator|Function)} validators`

* **Usage:**

  Passes when at least one of provided validators passes.

## and

* **Arguments:**
  * `{...(NormalizedValidator|Function)} validators`

* **Usage:**

  Passes when all of provided validators passes.

## not

* **Arguments:**
  * `{...(NormalizedValidator|Function)} validators`

* **Usage:**

  Passes when provided validator would not pass, fails otherwise. Can be chained with other validators like `not(sameAs('field'))`.

## withParams

* **Arguments:**
  * `{Ref<Object> | Object} params`
  * `{Function | ValidatorObject} validator`

* **Usage:**

  Not really a validator, but a validator modifier. Adds a `$params` object to the provided validator. Can be used on validation functions or even
  entire nested field validation objects. Useful for creating your own custom validators.
