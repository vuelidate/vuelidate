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

  it('should return an object', () => {
    expect(withParams({}, func)).toEqual({
      $validator: func,
      $params: {}
    })
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

  // TODO: This changes from $sub to combining into $params. Do we want this?
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

  it.skip('should stack multiple $sub keys', () => {
    const $params1 = { a: 0, c: 3 }
    const $params2 = { a: 1, b: 2 }
    const $params3 = { a: 2, b: 3 }
    _setTarget({})
    withParams($params1, (v) => {
      const v1 = withParams($params2, func)(v)
      const v2 = withParams($params3, func)(v)
      return v1 && v2
    })('test')

    expect(target.$sub[0]).toEqual({
      a: 0,
      c: 3,
      $sub: [{ a: 1, b: 2 }, { a: 2, b: 3 }]
    })
  })
})
