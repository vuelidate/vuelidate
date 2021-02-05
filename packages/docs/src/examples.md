# Examples

## Without v-model

In case you don't want to modify your model directly, you can still use separate `:input` and `@event` bindings. This is especially useful if you are using data from external source, like Vuex store or props. In that case you have to manually take care of setting the `$dirty` by calling `$touch()` method when appropriate.

> Example

## Form submission

A common thing to do with validated forms is to check their validity before submission. You can accomplish this easily by checking for `$invalid` state before sending any requests.

> Example

## Contextified validators

You can link related fields by contextified validators. An example of this being sameAs builtin validator.

> Example

## Data nesting

You can nest validators to match your data as deep as you want. Parent validator is $invalid when any of its children validators reports an $invalid state. This might be very useful for overall form validation.

> Example

## $error vs $anyError

There are two common ways of considering if an error should be displayed. It is important to understand which one suits your use case better. You can use either `$error` or `$anyError` validation property, or by extension, the low-level variants: `$dirty` or `$anyDirty`. Note that this documentation uses mainly `$error` variant in it's examples, but the choice is yours to make.

> Example

## Validation Groups

If you want to create a validator that groups many otherwise unrelated fields together, you can create a validation group.

> Example

## Collections validation

Use nested component validations.

> Example

## Asynchronous validation

Async support is provided out of the box. Just use a validator that returns a promise. Promise's success value is used for validation directly, failed promise just fails the validation and throws the error.

Any component's data has to be accessed synchronously for correct reactive behaviour. Store it as a variable in validator's scope if you need to use it in any asynchronous callback, for example in `.then`.

Validator is evaluated on every data change, as it is essentially a computed value. If you need to throttle an async call, do it on your data change event, not on the validator itself. You may end up with broken Vue observables otherwise.

```js
const asyncEmailValidator = (v) => Promise.resolve() // does something async
export default {
  validations () {
    return {
      email: {
        isUnique: asyncEmailValidator
      }
    }
  }
}
```

The `async/await` syntax is fully supported. It works especially great in combination with Fetch API.

```js
export default {
  validations () {
    return {
      email: {
        async isUnique (value) {
          if (value === '') return true
          const response = await fetch(`/api/unique/${value}`)
          return Boolean(await response.json())
        }
      }
    }
  }
}
```

## Delayed validation errors

You can do anything you need with the `$touch` state, no matter how fancy your requirements are. It all boils down to calling $touch and $reset in the right moment. As an example of that, here is an easy to follow implementation of delayed error based on custom `setTimeout` logic. It triggers one second after last input.

> Example

## Accessing validator parameters

You can access information about your validations through `$params` of a parent validator. This is be useful for reporting errors to users.

> Example

## Dynamic validation schema

Validations schema can be a function, which will make it dynamic and possibly dependant on your model's data. Recomputations will happend automatically as if it was a computed value. Validation's `$dirty` state will be preserved as long as the key name won't change or disappear.

> Example

## Dynamic parameters

Because the whole validation process is based on computed properties, nothing prevents you from making the validator name dynamic. Such cases allows for very dynamic behaviour even when your data is changing in time.

> Example
