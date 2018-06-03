import greaterEqual from 'src/validators/greaterEqual'

describe('greaterEqual validator', () => {
  const parentVm = {
    number1: 3,
    number2: 5
  }

  it('should not validate less and string values', () => {
    expect(greaterEqual('number1')(2, parentVm)).to.be.false
    expect(greaterEqual('number2')(4, parentVm)).to.be.false
    expect(greaterEqual('number2')('hello', parentVm)).to.be.false
  })

  it('should validate greater or equal values', () => {
    expect(greaterEqual('number1')(3, parentVm)).to.be.true
    expect(greaterEqual('number1')(4, parentVm)).to.be.true
    expect(greaterEqual('number1')(10, parentVm)).to.be.true
    expect(greaterEqual('number2')(5, parentVm)).to.be.true
    expect(greaterEqual('number2')(6, parentVm)).to.be.true
    expect(greaterEqual('number2')(15, parentVm)).to.be.true
  })
})
