# Validators

_Vuelidate 2_ does not bundle any validators, however it exposes them via a secondary package `@vuelidate/validators`. It consists of a set of
validators and helpers, that you can just import and use.

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

```js
export default {
  validations () {
    return {
      name: { required }
    }
  }
}
```

## requiredIf

* **Arguments:**
  * `{Ref<Any> | Any | Function} prop` - the property, to base the `required` validator on.

* **Usage:**

  Requires non-empty data, only if provided data property, ref, or a function resolve to `true`.

```js
export default {
  validations () {
    return {
      name: {
        requiredIfFoo: requiredIf(this.foo),
        requiredIfRef: requiredIf(someRef),
        requiredIfFuction: requiredIf(someFunction),
        requiredIfAsyncFuction: requiredIf(asyncFunction),
      }
    }
  }
}
```

## requiredUnless

* **Arguments:**
  * `{Ref<Any> | Any | Function} prop` - the property, to base the `required` validator on.

* **Usage:**

  Requires non-empty data, only if provided data property, ref, or a function resolve to `false`.

```js
export default {
  validations () {
    return {
      name: {
        requiredIfFoo: requiredUnless(this.foo),
        requiredIfRef: requiredUnless(someRef),
        requiredIfFuction: requiredUnless(someFunction),
        requiredIfAsyncFuction: requiredUnless(asyncFunction),
      }
    }
  }
}
```

## minLength

* **Arguments:**
  * `{Ref<Number> | Number} min`

* **Works With:**
  * `{Array | Object | String}`

* **Usage:**

  Requires the input value to have a minimum specified length, inclusive. Works with arrays, objects and strings.

```js
export default {
  validations () {
    return {
      name: {
        minLength: minLength(this.foo),
        minLengthRef: minLength(someRef),
        minLengthValue: minLength(10),
      }
    }
  }
}
```

## maxLength

* **Arguments:**
  * `{Ref<Number> | Number} max`

* **Works With:**
  * `{Array | Object | String}`

* **Usage:**

  Requires the input value to have a maximum specified length, inclusive. Works with arrays, objects and strings.

```js
export default {
  validations () {
    return {
      name: {
        maxLength: maxLength(this.foo),
        maxLengthRef: maxLength(someRef),
        maxLengthValue: maxLength(10),
      }
    }
  }
}
```

## minValue

* **Arguments:**
  * `{Ref<Number> | Number} min`

* **Works With:**
  * `{Number | Date}`

* **Usage:**

  Requires entry to have a specified minimum numeric value or Date.

```js
export default {
  validations () {
    return {
      name: {
        minValue: minValue(this.foo),
        minValueRef: minValue(someRef),
        minValueValue: minValue(10),
      }
    }
  }
}
```

## maxValue

* **Arguments:**
  * `{Ref<Number> | Number} max`

* **Works With:**
  * `{Number | Date}`

* **Usage:**

  Requires entry to have a specified maximum numeric value or Date.

```js
export default {
  validations () {
    return {
      name: {
        maxValue: maxValue(this.foo),
        maxValueRef: maxValue(someRef),
        maxValueValue: maxValue(10),
      }
    }
  }
}
```

## between

* **Arguments:**
  * `{Ref<Number> | Number} min`
  * `{Ref<Number> | Number} max`

* **Works With:**
  * `{Number | Date}`

* **Usage:**

  Checks if a number or Date is in specified bounds. `min` and `max` are both inclusive.

```js
export default {
  validations () {
    return {
      name: {
        between: between(this.foo, this.bar),
        betweenRef: between(someFooRef, someBarRef),
        betweenValue: between(10, 15),
      }
    }
  }
}
```

## alpha

* **Usage:**

  Accepts only alphabet characters.

## alphaNum

* **Usage:**

  Accepts only alphanumerics.

## numeric

* **Usage:**

  Accepts only numerics. String numbers are also numeric.

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

  Accepts valid MAC addresses like **00:ff:11:22:33:44:55**. Don't forget to call it as a function `macAddress()`, as it has an optional parameter.
  You can specify your own separator instead of `':'`. Provide empty separator `macAddress('')` to validate MAC addresses like **00ff1122334455**.

```js
export default {
  validations () {
    return {
      mac: {
        macAddress: macAddress()
      }
    }
  }
}
```

## sameAs

* **Arguments:**
  * `{String | Number| Boolean | Ref} equalTo`

* **Usage:**

  Checks for equality with a given property. Accepts a ref, a direct reference to a data property, or a raw value to compare to it directly.

```js
export default {
  validations () {
    return {
      confirmPassword: {
        sameAsPassword: sameAs(this.password), // can be a reference to a field or computed property
        sameAsRef: sameAs(ref), // can be passed a ref to compare
        sameAsRawValue: sameAs('foo') // this will compare if `sameAsRawValue` equals to "foo"
      }
    }
  }
}
```

## url

* **Arguments:**
  * `{Any} equalTo`

* **Usage:**

  Accepts only URLs.

## or

* **Arguments:**
  * `{...(NormalizedValidator|Function)} validators`

* **Usage:**

  Passes when at least one of the provided validators returns `true` or `{ $valid: true }`. Validators can return more data, when using the object
  response.

```js
export default {
  validations () {
    return {
      agree: {
        shouldBeChecked: or(validatorOne, validatorTwo, validatorThree)
      }
    }
  }
}
```

### Async or

`or` can also accept a mix of sync and async validators. Async ones that return a promise, should be wrapped in `withAsync`.

```js
export default {
  validations () {
    return {
      agree: {
        shouldBeCheckedAsync: or(withAsync(asyncOne), withAsync(asyncTwo), validatorThree)
      }
    }
  }
}
```

## and

* **Arguments:**
  * `{...(NormalizedValidator | Function)} validators`

* **Usage:**

  Passes when all of provided validators return `true` or `{ $valid: true }`.

```js
export default {
  validations () {
    return {
      agree: {
        shouldBeChecked: and(validatorOne, validatorTwo, validatorThree)
      }
    }
  }
}
```

### Async and

`and` can also accept a mix of sync and async validators. Async ones that return a promise, should be wrapped in `withAsync`.

```js
export default {
  validations () {
    return {
      agree: {
        shouldBeChecked: and(withAsync(validatorOne), validatorTwo, withAsync(validatorThree))
      }
    }
  }
}
```

## not

* **Arguments:**
  * `{...(NormalizedValidator|Function)} validators`

* **Usage:**

  Passes when provided validator would not pass, fails otherwise. Can be chained with other validators.

```js
export default {
  validations () {
    return {
      name: {
        otherProperty: not(sameAs(this.email)),
        asyncFunction: not(sameAs(asyncFunction)),
      }
    }
  }
}
```
