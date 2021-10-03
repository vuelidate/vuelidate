import { NormalizedT, T } from '../../../tests/fixtures'
import withAsync from '../withAsync'
import withParams from '../withParams'

describe('withAsync', () => {
  it('returns an async validator object, when passed a function', () => {
    expect(withAsync(T)).toEqual({
      $validator: T,
      $async: true,
      $watchTargets: []
    })
  })

  it('returns async validator object, when passed a normalised validator objet', () => {
    expect(withAsync(NormalizedT)).toEqual({
      $validator: T,
      $async: true,
      $watchTargets: []
    })
  })

  it('retains $params', () => {
    expect(withAsync(withParams({ foo: 'foo' }, NormalizedT))).toEqual({
      $validator: T,
      $async: true,
      $watchTargets: [],
      $params: {
        foo: 'foo'
      }
    })
  })

  it('allows specifying watch targets', () => {
    const foo = 'foo'
    expect(withAsync(NormalizedT, [foo])).toEqual({
      $validator: T,
      $async: true,
      $watchTargets: [foo]
    })
  })
})
