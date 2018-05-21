import sameAs from 'src/validators/sameAs'

describe('sameAs validator', () => {
  const parentVm = {
    first: 'hello',
    second: 'world',
    undef: undefined,
    nil: null,
    empty: ''
  }

  it('should not validate different values', () => {
    expect(sameAs('first')('world', parentVm)).to.be.false
    expect(sameAs('second')('hello', parentVm)).to.be.false
    expect(sameAs('first')(undefined, parentVm)).to.be.false
    expect(sameAs('first')(null, parentVm)).to.be.false
    expect(sameAs('first')('', parentVm)).to.be.false
    expect(sameAs('undef')('any', parentVm)).to.be.false
    expect(sameAs('nil')('any', parentVm)).to.be.false
    expect(sameAs('empty')('any', parentVm)).to.be.false
  })

  it('should validate identical values', () => {
    expect(sameAs('first')('hello', parentVm)).to.be.true
    expect(sameAs('second')('world', parentVm)).to.be.true
    expect(sameAs('undef')(undefined, parentVm)).to.be.true
    expect(sameAs('nil')(null, parentVm)).to.be.true
    expect(sameAs('empty')('', parentVm)).to.be.true
  })

  it('should allow function expression', () => {
    expect(sameAs((p) => p.first)('hello', parentVm)).to.be.true
  })
})
