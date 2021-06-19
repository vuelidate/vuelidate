# Validation Methods

## $validate

* **Returns:** `Promise<Boolean>`

* **Usage:**

  Sets all properties as dirty, triggering all validators. Returns a Promise with a boolean, which resolves once all validators finish.

## $touch

* **Usage:**

  Sets its property and all nested properties `$dirty` state to true.

## $getResultsForChild

* **Arguments:**
  * `{string} key`

* **Returns:** `{Object} ValidationState`

* **Usage:**

  Retrieves the validation results for a nested form component.

## $reset

* **Usage:**

  Resets the `$dirty` state on all nested properties of a form.

## $clearExternalResults

* **Usage:**

  Clears the `$externalResults` state back to an empty object.
