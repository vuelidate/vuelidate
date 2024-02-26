import forEach from '../forEach'

const state = [{
  name: ''
}, {
  name: 'Foo'
}]
const isFoo = jest.fn().mockImplementation((v) => v === 'Foo')
const required = jest.fn().mockImplementation((v) => !!v)
const rules = {
  name: {
    isFoo: { $validator: isFoo, $message: 'Not Foo' },
    required: { $validator: required, $message: 'Is Required' }
  }
}
describe('forEach', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns an object with `$validator` and `$message` methods', () => {
    expect(forEach()).toEqual({
      $validator: expect.any(Function),
      $message: expect.any(Function)
    })
  })

  it('runs the validator against each property', () => {
    const siblingState = { siblings: {} }
    const vm = { foo: 'bar' }
    forEach(rules).$validator(state, siblingState, vm)
    expect(isFoo).toHaveBeenCalledTimes(2)
    expect(required).toHaveBeenCalledTimes(2)
    expect(isFoo).toHaveBeenCalledWith('', state[0], 0, siblingState, vm)
    expect(isFoo).toHaveBeenCalledWith('Foo', state[1], 1, siblingState, vm)
    expect(required).toHaveBeenCalledWith('', state[0], 0, siblingState, vm)
    expect(required).toHaveBeenCalledWith('Foo', state[1], 1, siblingState, vm)
  })

  it('does not throw, if a property does not have a validator', () => {
    expect(forEach(rules).$validator([{
      name: '',
      surname: '' // surname has no validator, but it should not cause errors
    }])).toEqual({
      $data: [
        {
          name: {
            isFoo: false,
            required: false,
            $invalid: true,
            $error: true
          }
        }
      ],
      $errors: [
        {
          name: [
            {
              $message: 'Not Foo',
              $model: '',
              $params: {},
              $pending: false,
              $property: 'name',
              $response: false,
              $validator: 'isFoo'
            },
            {
              $message: 'Is Required',
              $model: '',
              $params: {},
              $pending: false,
              $property: 'name',
              $response: false,
              $validator: 'required'
            }
          ]
        }
      ],
      $valid: false
    })
    expect(isFoo).toHaveBeenCalledTimes(1)
    expect(required).toHaveBeenCalledTimes(1)
  })

  it('passes the correct this context', () => {
    const context = {
      foo: 'bar'
    }
    forEach(rules).$validator.call(context, state)
    expect(isFoo.mock.instances[0]).toEqual(context)
    expect(required.mock.instances[0]).toEqual(context)
  })

  it('passes all extra params to the validators', () => {
    forEach(rules).$validator(state, 'foo', 'bar', 'baz')
    expect(isFoo).toHaveBeenCalledWith(state[0].name, state[0], 0, 'foo', 'bar', 'baz')
    expect(isFoo).toHaveBeenCalledWith(state[1].name, state[1], 1, 'foo', 'bar', 'baz')
  })

  it('returns the a validation result object, with $data, $errors and $valid', () => {
    expect(forEach(rules).$validator(state)).toEqual({
      $data: [
        {
          name: {
            isFoo: false,
            required: false,
            $error: true,
            $invalid: true
          }
        },
        {
          name: {
            isFoo: true,
            required: true,
            $error: false,
            $invalid: false
          }
        }
      ],
      $errors: [
        {
          name: [
            {
              $message: 'Not Foo',
              $model: '',
              $params: {},
              $pending: false,
              $property: 'name',
              $response: false,
              $validator: 'isFoo'
            },
            {
              $message: 'Is Required',
              $model: '',
              $params: {},
              $pending: false,
              $property: 'name',
              $response: false,
              $validator: 'required'
            }
          ]
        },
        {
          name: []
        }
      ],
      $valid: false
    })
  })

  it('does not collect error messages, if validation passes', () => {
    expect(forEach(rules).$validator([{ name: '' }]).$errors).toEqual([{
      name: [
        {
          $message: 'Not Foo',
          $model: '',
          $params: {},
          $pending: false,
          $property: 'name',
          $response: false,
          $validator: 'isFoo'
        },
        {
          $message: 'Is Required',
          $model: '',
          $params: {},
          $pending: false,
          $property: 'name',
          $response: false,
          $validator: 'required'
        }
      ]
    }])

    expect(forEach(rules).$validator([{ name: 'F' }]).$errors).toEqual([{
      name: [
        {
          $message: 'Not Foo',
          $model: 'F',
          $params: {},
          $pending: false,
          $property: 'name',
          $response: false,
          $validator: 'isFoo'
        }
      ]
    }])

    expect(forEach(rules).$validator([{ name: 'Foo' }]).$errors).toEqual([{
      name: []
    }])
  })

  it('has a `$message` method that just returns the `$errors` from the `$response`', () => {
    const $errors = [
      {
        name: [
          {
            $message: 'Not Foo',
            $model: '',
            $params: {},
            $pending: false,
            $property: 'name',
            $response: false,
            $validator: 'isFoo'
          },
          {
            $message: 'Is Required',
            $model: '',
            $params: {},
            $pending: false,
            $property: 'name',
            $response: false,
            $validator: 'required'
          }
        ]
      },
      {
        name: [{
          $message: 'Is Bar',
          $model: '',
          $params: {},
          $pending: false,
          $property: 'name',
          $response: false,
          $validator: 'required'
        }]
      }
    ]
    expect(forEach(rules).$message({ $response: { $errors } })).toEqual([
      ['Not Foo', 'Is Required'],
      ['Is Bar']
    ])
  })

  it('supports $message as a function, passing all the necessary params', () => {
    const $message = jest.fn().mockReturnValue('Not foo')
    const $params = { foo: 'foo' }

    forEach({
      name: {
        isFoo: {
          $validator: isFoo,
          $message,
          $params
        }
      }
    }).$validator([{ name: '' }])
    expect($message).toHaveBeenCalledTimes(1)
    expect($message).toHaveBeenCalledWith({
      $invalid: true,
      $model: '',
      $params,
      $pending: false,
      $response: false
    })
  })

  it('does not invoke `$message` function, if validator is valid', () => {
    const $message = jest.fn().mockReturnValue('Not foo')

    forEach({
      name: {
        isFoo: {
          $validator: isFoo,
          $message
        }
      }
    }).$validator([{ name: 'Bar' }, { name: 'Foo' }])
    expect($message).toHaveBeenCalledTimes(1)
    expect($message).toHaveBeenCalledWith({
      $invalid: true,
      $model: 'Bar',
      $params: {},
      $pending: false,
      $response: false
    })
  })

  it('collects all the responses', () => {
    isFoo.mockReturnValueOnce({
      $valid: true,
      $data: 'Foo'
    })
    expect(forEach({
      name: {
        isFoo: {
          $validator: isFoo
        }
      }
    }).$validator([{ name: 'Bar' }, { name: 'Foo' }]).$data).toEqual([{
      name: {
        $error: false,
        $invalid: false,
        isFoo: {
          $valid: true,
          $data: 'Foo'
        }
      }
    }, {
      name: {
        isFoo: true,
        $error: false,
        $invalid: false
      }
    }])
  })

  it('returns invalid, if a single item is invalid', () => {
    expect(forEach(rules).$validator(state).$valid).toBe(false)
    expect(forEach(rules).$validator([
      { name: 'Foo' }, { name: 'Foo' }
    ]).$valid).toBe(true)
  })

  it('returns invalid when required property is missing', () => {
    const validate = forEach({ something: { required } }).$validator
    expect(validate([{}]).$valid).toBe(false)
    expect(validate([{ something: 'a' }]).$valid).toBe(true)
  })
})
