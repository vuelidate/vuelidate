import { and } from 'vuelidate/lib/validators';
import { expect } from 'chai';
import { SinonStatic } from 'sinon';

describe('and validator', () => {

  let sinon: SinonStatic = window['sinon'];

  const T = () => true
  const F = () => false

  it('should not validate no functions', () => {
    expect(and()()).to.be.false
  })

  it('should not validate single false function', () => {
    expect(and(F)()).to.be.false
  })

  it('should validate single true function', () => {
    expect(and(T)()).to.be.true
  })

  it('should validate all true functions', () => {
    expect(and(T, T, T)()).to.be.true
  })

  it('should not validate some true functions', () => {
    expect(and(T, F, T)()).to.be.false
  })

  it('should not validate all false functions', () => {
    expect(and(F, F, F)()).to.be.false
  })

  it('should pass values and model to function', () => {
    const spy = sinon.spy();
    (<any>and(spy))(1, 2);
    expect(spy.calledWith(1,2)).to.be.true;
  })
})
