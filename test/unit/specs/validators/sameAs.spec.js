import sameAs from 'src/validators/sameAs'

describe('sameAs validator', () => {
  const parentVm = {
    first: 'hello',
    second: 'world'
  }

  it('should validate empty string', () => {
    expect(sameAs('second')('', parentVm)).to.be.true
  })

  it('should validate null', () => {
    expect(sameAs('second')(null, parentVm)).to.be.true
  })

  it('should not validate different string', () => {
    expect(sameAs('first')('world', parentVm)).to.be.false
    expect(sameAs('second')('hello', parentVm)).to.be.false
  })

  it('should validate identical string', () => {
    expect(sameAs('first')('hello', parentVm)).to.be.true
    expect(sameAs('second')('world', parentVm)).to.be.true
  })
})
