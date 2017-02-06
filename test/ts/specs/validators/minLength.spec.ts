import { minLength } from 'vuelidate/lib/validators';
import { expect } from 'chai';

describe('minLength validator', () => {
  it('should validate empty string', () => {
    expect(minLength(5)('')).to.be.true
  })

  it('should validate null', () => {
    expect(minLength(5)(null)).to.be.true
  })

  it('should not validate too short string', () => {
    expect(minLength(5)('a')).to.be.false
  })

  it('should validate enough characters', () => {
    expect(minLength(5)('abcde')).to.be.true
  })

  it('should validate more than necessary characters', () => {
    expect(minLength(5)('abcdefghi')).to.be.true
  })

  it('should validate enough spaces', () => {
    expect(minLength(5)('     ')).to.be.true
  })

  it('should validate empty arrays', () => {
    expect(minLength(5)([])).to.be.true
  })

  it('should not validate too short arrays', () => {
    expect(minLength(5)([1])).to.be.false
  })

  it('should validate arrays with enough elements', () => {
    expect(minLength(5)([1, 2, 3, 4, 5])).to.be.true
  })
})
