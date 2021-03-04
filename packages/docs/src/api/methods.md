# Validation Methods

## $validate

* **Returns:** `Promise<Boolean>`

* **Usage:**

  Triggers all validators if not triggered already. Returns a Promise with a boolean, which resolves once all validators finish.

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

  Resets the validation state of a validation tree.
