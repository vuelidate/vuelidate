import hasValue from 'src/validators/hasValue'

describe('hasValue validator', () => {
  it('should not validate empty values', () => {
    expect(hasValue(null)(null)).to.be.false
    expect(hasValue(undefined)(undefined)).to.be.false
    expect(hasValue('')('')).to.be.false
    expect(hasValue([])([])).to.be.false
    expect(hasValue({})({})).to.be.false
  })

  it('should validate arrays values', () => {
    expect(hasValue([1, '3'])(['2', 1, '3'])).to.be.true
  })

  it('should not validate object value', () => {
    expect(hasValue([{}, '10'])(['2', {}, '3'])).to.be.false
  })

  it('should validate value in array', () => {
    expect(hasValue(1)([1, '3'])).to.be.true
  })

  it('should validate value in object', () => {
    expect(hasValue(2)({ key1: 1, key2: 2 })).to.be.true
  })

  it('should validate checked value', () => {
    expect(hasValue(true)(true)).to.be.true
  })

  it('allow function expression on arrays', () => {
    expect(hasValue((value, key) => value.first === 1 && key === 0)([{first: 1}, 1, 2])).to.be.true
  })

  it('allow function expression on objects', () => {
    expect(hasValue((value, key) => value === 1 && key === 'key1')({key1: 1, key2: 2})).to.be.true
  })

  it('should validate string value', () => {
    expect(hasValue('abcd')('abcd')).to.be.true
  })
})
