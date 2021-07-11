import createI18nMessage from '../createI18nMessage'

const t = jest.fn((key) => key)

const validator = jest.fn()

const validatorObject = {
  $validator: validator
}

const params = {
  $validator: 'foo',
  $model: 'model',
  $property: 'property',
  $params: {
    foo: 'foo'
  }
}
describe('createI18nMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a factory function', () => {
    expect(createI18nMessage({ t })).toEqual(expect.any(Function))
  })

  it('returns a withMessage validator, for objects', () => {
    const i18n = createI18nMessage({ t })
    const v = i18n(validatorObject)
    expect(v).toEqual({
      $message: expect.any(Function),
      $validator: validator
    })

    expect(v.$message(params)).toEqual('validations.foo')
    expect(t).toHaveBeenCalledWith('validations.foo', {
      model: params.$model,
      property: params.$property,
      ...params.$params
    })
  })

  it('returns a withMessage validator, for plain functions', () => {
    const i18n = createI18nMessage({ t })
    const v = i18n(validator)
    expect(v).toEqual({
      $message: expect.any(Function),
      $validator: validator
    })

    expect(v.$message(params)).toEqual('validations.foo')
    expect(t).toHaveBeenCalledWith('validations.foo', {
      model: params.$model,
      property: params.$property,
      ...params.$params
    })
  })

  it('returns a wrapper function for validators, that expect a parameter', () => {
    const i18n = createI18nMessage({ t })

    const localValidator = jest.fn()
    const wrappedValidator = jest.fn().mockReturnValue(localValidator)
    const v = i18n(wrappedValidator, true)

    expect(v).toBeInstanceOf(Function)
    const result = v(1, 2, 3)
    expect(result).toEqual({
      $message: expect.any(Function),
      $validator: localValidator
    })
    expect(wrappedValidator).toHaveBeenCalledWith(1, 2, 3)
    expect(result.$message(params)).toEqual('validations.foo')
  })

  it('allows overriding the messagePath', () => {
    const messagePath = jest.fn().mockReturnValue('overridden')
    const i18n = createI18nMessage({ t, messagePath })
    const v = i18n(validatorObject)
    expect(v.$message(params)).toEqual('overridden')
    expect(messagePath).toHaveBeenCalledWith(params)
    expect(t).toHaveBeenCalledWith('overridden', {
      model: params.$model, property: params.$property, ...params.$params
    })
  })

  it('passes the correct context, for objects', () => {
    const i18n = createI18nMessage({ t })
    const v = i18n(validatorObject)

    const context = { foo: 'foo' }
    v.$validator.call(context, true)
    expect(validator.mock.instances[0]).toEqual(context)
  })

  it('passes the correct context, for functions', () => {
    const i18n = createI18nMessage({ t })
    const v = i18n(() => validator, true)

    const context = { foo: 'foo' }
    v(1).$validator.call(context, true)
    expect(validator.mock.instances[0]).toEqual(context)
  })
})
