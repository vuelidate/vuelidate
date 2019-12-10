import sameAs from '../sameAs'

describe('sameAs validator', () => {
  it('should not validate different values', () => {
    expect(sameAs('empty')('any')).toBe(false)
  })

  it('should validate identical values', () => {
    expect(sameAs('first')('first')).toBe(true)
  })
})
