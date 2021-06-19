# Error Object

The error object is used to easily check for and output error messages for each validation property.

It is found both in the `$errors` and `$silentErrors` arrays.

```ts
export interface ErrorObject {
  $propertyPath: string
  $property: string
  $validator: string
  $message: string | Ref<string>
  $params: object
  $pending: boolean
  $response: any,
  $uid: string,
}
```

## $propertyPath

* **Type:** `String`
* **Details:**

The deep dot-notation path of the property this validation result belongs to. This will follow deeply nested objects.

* **Example:**

`$propertyPath: "form.users.address.region"`

## $property

* **Type:** `String`
* **Details:**

The name of the current property, that is being validated.

## $validator

* **Type:** `String`
* **Details:**

The function name of the validator, for this validation result.

## $message

* **Type:** `String`
* **Details:**

An optional message, when using `withMessage` helper on validator functions. All `@vuelidate/validators` validators have messages by default.

## $params

* **Type:** `Object`
* **Details:**

An object that holds a reactive object with optionally passed params to validators via the `withParams` helper.

## $pending

* **Type:** `Boolean`
* **Details:**

A reactive property, telling whether the validator is still pending. Useful for Async validators.

## $response

* **Type:** `Any`
* **Details:**

The response returned from a validator. Most often a boolean, unless using the [Extra Validation Data](../advanced_usage.md#returning-extra-data-from-validators) feature.

## $uid

* **Type:** `String`
* **Details:**

A unique property, to use as a `key` when iterating over validation messages.
