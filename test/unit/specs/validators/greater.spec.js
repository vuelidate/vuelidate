import greater from 'src/validators/greater'

describe('greater validator', () => {
  const parentVm = {
    number1: 3,
    number2: 5
  }

  it('should not validate less or equal and string values', () => {
    expect(greater('number1')(2, parentVm)).to.be.false
    expect(greater('number1')(3, parentVm)).to.be.false
    expect(greater('number2')(4, parentVm)).to.be.false
    expect(greater('number2')('hello', parentVm)).to.be.false
  })

  it('should validate greater values', () => {
    expect(greater('number1')(4, parentVm)).to.be.true
    expect(greater('number1')(10, parentVm)).to.be.true
    expect(greater('number2')(6, parentVm)).to.be.true
    expect(greater('number2')(15, parentVm)).to.be.true
  })
})
