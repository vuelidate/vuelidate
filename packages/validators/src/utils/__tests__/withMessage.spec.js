import withMessage from '../withMessage'

describe('withMessage', () => {
  const fn = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw if message is array', () => {
    expect(() => withMessage([], fn)).toThrowError()
  })

  it('should throw if message is object', () => {
    expect(() => withMessage({}, fn)).toThrowError()
  })

  it('should throw if provided string as validator', () => {
    expect(() => withMessage('msg', 'fn')).toThrowError()
  })

  it('should allow message as function', () => {
    const msg = () => 'message'
    expect(withMessage(msg, fn)).toEqual({
      $message: msg,
      $validator: fn
    })
  })

  it('should allow message as string', () => {
    expect(withMessage('msg', fn)).toEqual({
      $message: 'msg',
      $validator: fn
    })
  })

  it('should overwrite previous $message declarations', () => {
    const validator = withMessage('oldmsg', fn)

    expect(withMessage('msg', validator)).toEqual({
      $message: 'msg',
      $validator: validator.$validator
    })
  })

  it('should not call the message function or validator functions', () => {
    const msg = jest.fn()
    withMessage(msg, fn)
    expect(fn).not.toHaveBeenCalled()
    expect(msg).not.toHaveBeenCalled()
  })
})
