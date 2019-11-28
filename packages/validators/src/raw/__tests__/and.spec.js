import and from '../and'

describe('and validator', () => {
  const T = () => true
  const F = () => false

  it('should not validate no functions', () => {
    expect(and()()).toBe(false)
  })

  it('should not validate single false function', () => {
    expect(and(F)()).toBe(false)
  })

  it('should validate single true function', () => {
    expect(and(T)()).toBe(true)
  })

  it('should validate all true functions', () => {
    expect(and(T, T, T)()).toBe(true)
  })

  it('should not validate some true functions', () => {
    expect(and(T, F, T)()).toBe(false)
  })

  it('should not validate all false functions', () => {
    expect(and(F, F, F)()).toBe(false)
  })

  it('should pass values and model to function', () => {
    const spy = jest.fn()
    and(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })
})
