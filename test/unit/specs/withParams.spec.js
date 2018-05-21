import withParams from 'src/withParams'
import { target, _setTarget } from 'src/params'

describe('withParams validator modifier', () => {
  const func = (x) => true

  beforeEach(() => {
    _setTarget(null)
  })

  it('should throw on invalid params', () => {
    expect(() => withParams([], func)).to.throw
  })

  it('should throw on string params in closure', () => {
    const v = withParams((addParams) => () => addParams('notObject'))
    expect(v).to.throw('params must be an object')
  })

  it('should throw on array params in closure', () => {
    const v = withParams((addParams) => () => addParams([]))
    expect(v).to.throw('params must be an object')
  })

  it('should throw on string input', () => {
    expect(() => withParams({}, 'string')).to.throw
  })

  it('should throw on array input', () => {
    expect(() => withParams({}, [])).to.throw
  })

  it('should return a function', () => {
    expect(typeof withParams({}, func)).to.equal('function')
  })

  it("should not alter function's output", () => {
    expect(withParams({}, () => 'hello')()).to.equal('hello')
  })

  it("should not alter function's input", () => {
    expect(withParams({}, (x) => x)('world')).to.equal('world')
  })

  it('should add params after function evaluation', () => {
    const $params = { a: 1, b: 2 }
    _setTarget({})
    withParams($params, func)('test')
    expect(target.$sub[0]).to.deep.equal($params)
  })

  it('should stack combining params to $sub key', () => {
    const $params1 = { a: 0, c: 3 }
    const $params2 = { a: 1, b: 2 }
    _setTarget({})
    withParams($params2, withParams($params1, func))('test')
    expect(target.$sub[0]).to.deep.equal({ a: 1, b: 2, $sub: [{ a: 0, c: 3 }] })
  })

  it('should stack multiple $sub keys', () => {
    const $params1 = { a: 0, c: 3 }
    const $params2 = { a: 1, b: 2 }
    const $params3 = { a: 2, b: 3 }
    _setTarget({})
    withParams($params1, (v) => {
      const v1 = withParams($params2, func)(v)
      const v2 = withParams($params3, func)(v)
      return v1 && v2
    })('test')

    expect(target.$sub[0]).to.deep.equal({
      a: 0,
      c: 3,
      $sub: [{ a: 1, b: 2 }, { a: 2, b: 3 }]
    })
  })
})
