import { alphaNum } from 'vuelidate/lib/validators'
import { expect } from 'chai';

describe('alphaNum validator', () => {
  it('should validate empty string', () => {
    expect(alphaNum('')).to.be.true
  })

  it('should validate numbers', () => {
    expect(alphaNum('1234567890')).to.be.true
  })

  it('should not validate space', () => {
    expect(alphaNum(' ')).to.be.false
  })

  it('should validate english letters', () => {
    expect(alphaNum('abcxyzABCXYZ')).to.be.true
  })

  it('should validate alphaNum', () => {
    expect(alphaNum('abc123')).to.be.true
  })

  it('should not validate padded letters', () => {
    expect(alphaNum(' abc ')).to.be.false
  })

  it('should not validate unicode', () => {
    expect(alphaNum('🎉')).to.be.false
  })
})
