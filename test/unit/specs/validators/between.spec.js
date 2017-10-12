import between from 'src/validators/between'

describe('between validator', () => {
  it('should validate empty string', () => {
    expect(between(2, 3)('')).to.be.true
  })

  it('should validate numeric zero in range', () => {
    expect(between(-1, 1)(0)).to.be.true
  })

  it('should not validate numeric zero outside of range', () => {
    expect(between(2, 3)(0)).to.be.false
  })

  it('should not validate input outside of range', () => {
    expect(between(5, 10)('15')).to.be.false
    expect(between(5, 10)('3')).to.be.false
  })

  it('should have inclusive lower bound', () => {
    expect(between(5, 10)('5')).to.be.true
  })

  it('should have inclusive upper bound', () => {
    expect(between(3, 4)('4')).to.be.true
  })

  it('should validate exact number in point range', () => {
    expect(between(3, 3)('3')).to.be.true
  })

  it('should not validate number just outside of range', () => {
    expect(between(3, 3)('3')).to.be.true
  })

  it('should not validate space', () => {
    expect(between(3, 3)(' ')).to.be.false
  })

  it('should not validate text', () => {
    expect(between(3, 3)('hello')).to.be.false
  })

  it('should not validate number-like text', () => {
    expect(between(3, 3)('15a')).to.be.false
  })

  it('should not validate padded numbers', () => {
    expect(between(5, 20)(' 15')).to.be.false
    expect(between(5, 20)('15 ')).to.be.false
  })

  it('should validate fractions', () => {
    expect(between(3, 16)('15.5')).to.be.true
  })

  it('should validate negative fractions on bound', () => {
    expect(between(-15.512, 4.56)('-15.512')).to.be.true
  })

  it('should validate real numbers', () => {
    expect(between(3, 16)(15.5)).to.be.true
  })

  it('should not validate real numbers outside of range', () => {
    expect(between(3, 16)(25.5)).to.be.false
  })

  it('should not validate NaN', () => {
    expect(between(3, 16)(NaN)).to.be.false
  })

  it('should validate the upper bound date value', () => {
    expect(between(new Date(100), new Date(10000))(new Date(10000))).to.be.true
  })

  it('should validate the lower bound date value', () => {
    expect(between(new Date(100), new Date(10000))(new Date(100))).to.be.true
  })

  it('should validate the valid date value', () => {
    expect(between(new Date(100), new Date(10000))(new Date(1000))).to.be.true
  })

  it('should validate the invalid date value', () => {
    expect(between(new Date(100), new Date(10000))(new Date(100000))).to.be.false
  })
})
