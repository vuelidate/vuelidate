import maxValue from '../maxValue'

describe('maxValue validator', () => {
  it('should validate max number', () => {
    expect(maxValue(5)(5)).toBe(true)
  })

  it('should validate the valid number', () => {
    expect(maxValue(5)(4)).toBe(true)
  })

  it('should validate the invalid number', () => {
    expect(maxValue(5)(6)).toBe(false)
  })

  it('should validate the string value', () => {
    expect(maxValue(5)('not string here')).toBe(false)
  })

  it('should validate the object value', () => {
    expect(maxValue(5)({ hello: 'world' })).toBe(false)
  })

  it('should validate the max date value', () => {
    expect(maxValue(new Date(1000000))(new Date(1000000))).toBe(true)
  })

  it('should validate the valid date value', () => {
    expect(maxValue(new Date(1000000))(new Date(100))).toBe(true)
  })

  it('should validate the invalid date value', () => {
    expect(maxValue(new Date(100))(new Date(1000000))).toBe(false)
  })
})
