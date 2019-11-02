import not from '../not'

describe('not validator', () => {
  const T = () => true
  const F = () => false

  it('should not validate with true function', () => {
    expect(not(T)('test')).toBe(false)
  })

  it('should validate with true function on empty input', () => {
    expect(not(T)('')).toBe(true)
  })

  it('should validate with false function', () => {
    expect(not(F)('test')).toBe(true)
  })

  it('should validate with false function on empty input', () => {
    expect(not(T)('')).toBe(true)
  })

  it('should pass values or model to function', () => {
    const spy = jest.fn()
    not(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })
})
