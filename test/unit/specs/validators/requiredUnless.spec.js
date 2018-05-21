import requiredUnless from 'src/validators/requiredUnless'

const T = () => true
const F = () => false

describe('requiredUnless validator', () => {
  it('should not validate empty string when functional condition is not met', () => {
    expect(requiredUnless(F)('')).to.be.false
  })

  it('should validate empty string when functional condition met', () => {
    expect(requiredUnless(T)('')).to.be.true
  })

  it('should not validate empty string when prop condition is not met', () => {
    expect(requiredUnless('prop')('', { prop: false })).to.be.false
  })

  it('should validate empty string when prop condition met', () => {
    expect(requiredUnless('prop')('', { prop: true })).to.be.true
  })
})
