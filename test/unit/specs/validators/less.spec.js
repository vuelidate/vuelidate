import less from 'src/validators/less'

describe('less validator', () => {
  const parentVm = {
    number1: 3,
    number2: 5
  }

  it('should not validate greater or equal and string values', () => {
    expect(less('number1')(3, parentVm)).to.be.false
    expect(less('number1')(4, parentVm)).to.be.false
    expect(less('number2')(5, parentVm)).to.be.false
    expect(less('number2')(10, parentVm)).to.be.false
    expect(less('number2')('hello', parentVm)).to.be.false
  })

  it('should validate less values', () => {
    expect(less('number1')(2, parentVm)).to.be.true
    expect(less('number1')(1, parentVm)).to.be.true
    expect(less('number2')(3, parentVm)).to.be.true
    expect(less('number2')(4, parentVm)).to.be.true
  })
})
