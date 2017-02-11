import sameAs from 'src/validators/sameAs'

describe('sameAs validator', () => {
  const parentVm = {
    first: 'hello',
    second: 'world'
  }

  it('should not validate different string', () => {
    expect(sameAs('first')('world', parentVm)).to.be.false
    expect(sameAs('second')('hello', parentVm)).to.be.false
  })

  it('should validate identical string', () => {
    expect(sameAs('first')('hello', parentVm)).to.be.true
    expect(sameAs('second')('world', parentVm)).to.be.true
  })
})
