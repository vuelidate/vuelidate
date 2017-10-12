import maxValue from 'src/validators/maxValue'

describe('maxValue validator', () => {
  it('should validate max number', () => {
    expect(maxValue(5)(5)).to.be.true
  })

  it('should validate the valid number', () => {
    expect(maxValue(5)(4)).to.be.true
  })

  it('should validate the invalid number', () => {
    expect(maxValue(5)(6)).to.be.false
  })

  it('should validate the string value', () => {
    expect(maxValue(5)('not string here')).to.be.false
  })

  it('should validate the object value', () => {
    expect(maxValue(5)({hello: 'world'})).to.be.false
  })

  it('should validate the max date value', () => {
    expect(maxValue(new Date(1000000))(new Date(1000000))).to.be.true
  })

  it('should validate the valid date value', () => {
    expect(maxValue(new Date(1000000))(new Date(100))).to.be.true
  })

  it('should validate the invalid date value', () => {
    expect(maxValue(new Date(100))(new Date(1000000))).to.be.false
  })
})
