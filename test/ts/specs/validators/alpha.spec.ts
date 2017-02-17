import { alpha } from 'vuelidate/lib/validators'
import { expect } from 'chai';

describe('alpha validator', () => {
  it('should validate empty string', () => {
    expect(alpha('')).to.be.true
  })

  it('should not validate numbers', () => {
    expect(alpha('1234')).to.be.false
  })

  it('should not validate space', () => {
    expect(alpha(' ')).to.be.false
  })

  it('should validate english letters', () => {
    expect(alpha('abcdefghijklmnopqrstuvwxyz')).to.be.true
  })

  it('should validate english letters uppercase', () => {
    expect(alpha('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).to.be.true
  })

  it('should validate english letters uppercase', () => {
    expect(alpha('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).to.be.true
  })

  it('should not validate alphanum', () => {
    expect(alpha('abc123')).to.be.false
  })

  it('should not validate padded letters', () => {
    expect(alpha(' abc ')).to.be.false
  })

  it('should not validate unicode', () => {
    expect(alpha('🎉')).to.be.false
  })
})
