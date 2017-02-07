import withParams from 'src/withParams'

describe('withParams validator modifier', () => {
  const func = (x) => true

  beforeEach(() => {
    withParams.target = null
  })

  it('should throw on invalid input', () => {
    expect(() => withParams({}, 'string')).to.throw
  })

  it('should return a function', () => {
    expect(typeof withParams({}, func)).to.equal('function')
  })

  it('should not alter function\'s output', () => {
    expect(withParams({}, () => 'hello')()).to.equal('hello')
  })

  it('should not alter function\'s input', () => {
    expect(withParams({}, (x) => x)('world')).to.equal('world')
  })

  it('should add params after function evaluation', () => {
    const $params = {a: 1, b: 2}
    withParams.target = {}
    withParams($params, func)('test')
    expect(withParams.target.$sub[0]).to.deep.equal($params)
  })

  it('should stack combining params to $sub key', () => {
    const $params1 = {a: 0, c: 3}
    const $params2 = {a: 1, b: 2}
    withParams.target = {}
    withParams($params2, withParams($params1, func))('test')
    expect(withParams.target.$sub[0])
      .to.deep.equal({a: 1, b: 2, $sub: [{a: 0, c: 3}]})
  })
})
