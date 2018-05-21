import not from 'src/validators/not'

describe('not validator', () => {
  const T = () => true
  const F = () => false

  it('should not validate with true function', () => {
    expect(not(T)('test')).to.be.false
  })

  it('should validate with true function on empty input', () => {
    expect(not(T)('')).to.be.true
  })

  it('should validate with false function', () => {
    expect(not(F)('test')).to.be.true
  })

  it('should validate with false function on empty input', () => {
    expect(not(T)('')).to.be.true
  })

  it('should pass values or model to function', () => {
    const spy = sinon.spy()
    not(spy)(1, 2)
    expect(spy).to.have.been.calledWith(1, 2)
  })
})
