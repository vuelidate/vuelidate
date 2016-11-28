import or from 'src/validators/or'

describe('or validator', () => {
  const T = () => true
  const F = () => false

  it('should not validate no functions', () => {
    expect(or()()).to.be.false
  })

  it('should not validate single false function', () => {
    expect(or(F)()).to.be.false
  })

  it('should validate single true function', () => {
    expect(or(T)()).to.be.true
  })

  it('should validate all true functions', () => {
    expect(or(T, T, T)()).to.be.true
  })

  it('should validate some true functions', () => {
    expect(or(T, F, T)()).to.be.true
  })

  it('should not validate all false functions', () => {
    expect(or(F, F, F)()).to.be.false
  })

  it('should pass values or model to function', () => {
    const spy = sinon.spy()
    or(spy)(1, 2)
    expect(spy).to.have.been.calledWith(1, 2)
  })
})
