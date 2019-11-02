import sameAs from '../sameAs'

describe('sameAs validator', () => {
  const parentVm = {
    first: 'hello',
    second: 'world',
    undef: undefined,
    nil: null,
    empty: ''
  }

  it('should not validate different values', () => {
    expect(sameAs('first')('world', parentVm)).toBe(false)
    expect(sameAs('second')('hello', parentVm)).toBe(false)
    expect(sameAs('first')(undefined, parentVm)).toBe(false)
    expect(sameAs('first')(null, parentVm)).toBe(false)
    expect(sameAs('first')('', parentVm)).toBe(false)
    expect(sameAs('undef')('any', parentVm)).toBe(false)
    expect(sameAs('nil')('any', parentVm)).toBe(false)
    expect(sameAs('empty')('any', parentVm)).toBe(false)
  })

  it('should validate identical values', () => {
    expect(sameAs('first')('hello', parentVm)).toBe(true)
    expect(sameAs('second')('world', parentVm)).toBe(true)
    expect(sameAs('undef')(undefined, parentVm)).toBe(true)
    expect(sameAs('nil')(null, parentVm)).toBe(true)
    expect(sameAs('empty')('', parentVm)).toBe(true)
  })

  it('should allow function expression', () => {
    expect(sameAs((p) => p.first)('hello', parentVm)).toBe(true)
  })
})
