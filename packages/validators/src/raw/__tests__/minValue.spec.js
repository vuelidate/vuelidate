import minValue from '../minValue'

describe('minValue validator', () => {
  it('should validate min number', () => {
    expect(minValue(5)(5)).toBe(true)
  })

  it('should validate the valid number', () => {
    expect(minValue(5)(6)).toBe(true)
  })

  it('should validate the invalid number', () => {
    expect(minValue(5)(4)).toBe(false)
  })

  it('should validate the string value', () => {
    expect(minValue(5)('not string here')).toBe(false)
  })

  it('should validate the object value', () => {
    expect(minValue(5)({ hello: 'world' })).toBe(false)
  })

  it('should validate the minimum date value', () => {
    expect(minValue(new Date(100))(new Date(100))).toBe(true)
  })

  it('should validate the valid date value', () => {
    expect(minValue(new Date(100))(new Date(1000000))).toBe(true)
  })

  it('should validate the invalid date value', () => {
    expect(minValue(new Date(1000000))(new Date(100))).toBe(false)
  })
})
