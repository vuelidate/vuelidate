import requiredIf from 'src/validators/requiredIf'

const T = () => true
const F = () => false

describe('requiredIf validator', () => {
  it('should not validate empty string when functional condition is met', () => {
    expect(requiredIf(T)('')).to.be.false
  })

  it('should validate empty string when functional condition not met', () => {
    expect(requiredIf(F)('')).to.be.true
  })

  it('should not validate empty string when prop condition is met', () => {
    expect(requiredIf('prop')('', { prop: true })).to.be.false
  })

  it('should validate empty string when prop condition not met', () => {
    expect(requiredIf('prop')('', { prop: false })).to.be.true
  })
})
