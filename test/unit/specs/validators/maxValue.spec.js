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
})
