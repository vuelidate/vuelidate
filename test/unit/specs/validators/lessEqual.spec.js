import lessEqual from 'src/validators/lessEqual'

describe('lessEqual validator', () => {
  const parentVm = {
    number1: 3,
    number2: 5
  }

  it('should not validate greater and string values', () => {
    expect(lessEqual('number1')(4, parentVm)).to.be.false
    expect(lessEqual('number2')(6, parentVm)).to.be.false
    expect(lessEqual('number2')('hello', parentVm)).to.be.false
  })

  it('should validate less or equal values', () => {
    expect(lessEqual('number1')(3, parentVm)).to.be.true
    expect(lessEqual('number1')(2, parentVm)).to.be.true
    expect(lessEqual('number1')(1, parentVm)).to.be.true
    expect(lessEqual('number2')(5, parentVm)).to.be.true
    expect(lessEqual('number2')(4, parentVm)).to.be.true
    expect(lessEqual('number2')(3, parentVm)).to.be.true
  })
})
