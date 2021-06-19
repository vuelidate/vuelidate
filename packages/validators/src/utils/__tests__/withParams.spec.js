import withParams from '../withParams'

describe('withParams validator modifier', () => {
  const func = (x) => true

  it('should throw on invalid params', () => {
    expect(() => withParams([], func)).toThrowError()
  })

  it('should throw on string params in closure', () => {
    expect(() => withParams('notObject', func)).toThrowError()
  })

  it('should throw on array params in closure', () => {
    expect(() => withParams(['asdf'], func)).toThrowError('First parameter to "withParams" should be an object')
  })

  it('should throw on string input', () => {
    expect(() => withParams({}, 'string')).toThrowError('Validator must be a function or object with $validator parameter')
  })

  it('should throw on array input', () => {
    expect(() => withParams({}, [])).toThrowError('Validator must be a function or object with $validator parameter')
  })

  it('should return an object, attaching provided params', () => {
    const params = {}
    expect(withParams(params, func)).toEqual({
      $validator: func,
      $params: params
    })
  })

  it('should not mutate validators', () => {
    const validator = {
      $validator: func,
      $message: 'some message'
    }
    withParams({}, validator)
    expect(validator).not.toHaveProperty('$params')
  })

  it('should allow a Validator object to be passed', () => {
    const validator = {
      $validator: func,
      $message: 'some message'
    }
    expect(withParams({}, validator)).toEqual({
      $validator: func,
      $message: 'some message',
      $params: {}
    })
  })

  it('should not call function', () => {
    const fn = jest.fn()
    withParams({}, fn)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should stack combining params', () => {
    const $params1 = { a: 0, c: 3 }
    const $params2 = { a: 1, b: 2 }
    const target = withParams($params2, withParams($params1, func))
    expect(target).toEqual({
      $params: {
        a: 1,
        b: 2,
        c: 3
      },
      $validator: func
    })
  })
})
