import { maxLength } from 'vuelidate/lib/validators';
import { expect } from 'chai';

describe('maxLength validator', () => {
  it('should validate empty string', () => {
    expect(maxLength(5)('')).to.be.true
  })

  it('should validate empty string for arbitrary limits', () => {
    expect(maxLength(-1)('')).to.be.true
  })

  it('should validate null', () => {
    expect(maxLength(5)(null)).to.be.true
  })

  it('should not validate too long string', () => {
    expect(maxLength(5)('abcdefgh')).to.be.false
  })

  it('should validate characters on length bound', () => {
    expect(maxLength(5)('abcde')).to.be.true
  })

  it('should not validate too much characters', () => {
    expect(maxLength(5)('abcdefghi')).to.be.false
  })

  it('should validate chain of spaces', () => {
    expect(maxLength(5)('     ')).to.be.true
  })

  it('should validate empty arrays', () => {
    expect(maxLength(-2)([])).to.be.true
  })

  it('should validate short arrays', () => {
    expect(maxLength(5)([1])).to.be.true
  })

  it('should not validate too long arrays', () => {
    expect(maxLength(5)([1, 2, 3, 4, 5, 6])).to.be.false
  })

  it('should validate arrays on length bound', () => {
    expect(maxLength(5)([1, 2, 3, 4, 5])).to.be.true
  })
})
