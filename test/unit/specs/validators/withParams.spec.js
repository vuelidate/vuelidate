import withParams from 'src/validators/withParams'

describe('withParams validator modifier', () => {
  const func = (x) => x

  it('should return original function', () => {
    expect(withParams({}, func)).to.equal(func)
  })

  it('should return original object', () => {
    const obj = {}
    expect(withParams({}, obj)).to.equal(obj)
  })

  it('should add params as $params key to the function', () => {
    const $params = {a: 1, b: 2}
    expect(withParams($params, func).$params).to.equal($params)
  })
})
